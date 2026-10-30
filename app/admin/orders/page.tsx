'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { OrderStatus } from '@/constant';
import { DeleteResourceDialog } from '@/components/DeleteResourceDialog';
import { ViewResourceDialog } from '@/components/ViewResourceDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import { OrderTable } from '@/components/orders/OrderTable';
import { orderService } from '@/services/order-service';
import type { Order, PaginationMeta } from '@/types';

const PAGE_SIZE = 10;

const INITIAL_PAGINATION: PaginationMeta = {
  current_page: 1,
  limit: PAGE_SIZE,
  total: 0,
  last_page: 1,
  has_more_pages: false,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(INITIAL_PAGINATION);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await orderService.getAll({
          page,
          limit: PAGE_SIZE,
        });

        if (!isActive) return;

        setOrders(response.data);
        setPagination(response.meta);
      } catch (error) {
        if (!isActive) return;

        setErrorMessage(getErrorMessage(error, 'Failed to load orders.'));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      isActive = false;
    };
  }, [page]);

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    if (order.status === status) return;

    setUpdatingOrderId(order.id);
    try {
      const response = await orderService.updateStatus(order.id, { status });
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) => (currentOrder.id === order.id ? response.data : currentOrder)),
      );
      toast.success(`Order ${order.order_number} is now ${response.data.status}.`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update order status.'));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      normalizedSearch === '' ||
      [order.order_number, order.address?.recipient_name ?? '', order.address?.phone ?? ''].some((value) =>
        value.toLocaleLowerCase().includes(normalizedSearch),
      );
    return matchesSearch && (statusFilter === 'all' || order.status === statusFilter);
  });
  const hasActiveFilters = normalizedSearch !== '' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    setIsDeleting(true);

    try {
      await orderService.deleteOrder(orderToDelete.id);

      const remainingOrders = orders.filter((order) => order.id !== orderToDelete.id);

      const remainingTotal = Math.max(0, pagination.total - 1);
      const lastPage = Math.max(1, Math.ceil(remainingTotal / PAGE_SIZE));

      toast.success(`"${orderToDelete.order_number}" deleted.`);
      setOrderToDelete(null);

      if (remainingOrders.length === 0 && page > lastPage) {
        setPage(lastPage);
      } else {
        setOrders(remainingOrders);
        setPagination((previous) => ({
          ...previous,
          total: remainingTotal,
          last_page: lastPage,
          has_more_pages: page < lastPage,
        }));
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete order.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">Search orders, update their status, and review details.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search order number, customer, or phone..."
            aria-label="Search orders"
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as 'all' | OrderStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter orders by status">
            <SelectValue placeholder="Order status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(OrderStatus).map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={resetFilters}>
            <X />
            Reset
          </Button>
        )}
      </div>

      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        errorMessage={errorMessage}
        emptyMessage={hasActiveFilters ? 'No orders match your filters on this page.' : 'No orders found.'}
        paginationMeta={pagination}
        onPageChange={setPage}
        onView={setViewingOrder}
        onDelete={setOrderToDelete}
        updatingOrderId={updatingOrderId}
        onStatusChange={handleStatusChange}
      />

      <ViewResourceDialog
        resource={viewingOrder}
        onClose={() => setViewingOrder(null)}
        getTitle={(order) => order.order_number}
        getDescription={(order) => `Placed on ${formatOrderDate(order.created_at)}`}
      >
        {(order) => (
          <dl className="space-y-2">
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="text-right font-medium">{order.address?.recipient_name ?? 'Guest'}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{order.address?.phone ?? 'N/A'}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize">{order.status}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2 text-sm">
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-medium">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        )}
      </ViewResourceDialog>

      <DeleteResourceDialog
        resource={orderToDelete}
        resourceLabel="order"
        getResourceName={(order) => order.order_number}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setOrderToDelete(null)}
      />
    </div>
  );
}
