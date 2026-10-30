import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatus } from '@/constant';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { Order, PaginationMeta } from '@/types';
import { Avatar } from '../ui/avatar';

interface ProductTableProps {
  orders: Order[];
  isLoading: boolean;
  errorMessage: string | null;
  emptyMessage: string;
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  onView: (product: Order) => void;
  onDelete: (product: Order) => void;
  updatingOrderId: number | null;
  onStatusChange: (order: Order, status: OrderStatus) => void;
}

const COLUMN_COUNT = 7;

const TableMessage = ({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={COLUMN_COUNT} className="h-24 text-center text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);

export const OrderTable = ({
  orders,
  isLoading,
  errorMessage,
  emptyMessage,
  paginationMeta,
  onPageChange,
  onView,
  onDelete,
  updatingOrderId,
  onStatusChange,
}: ProductTableProps) => {
  const currentPage = paginationMeta.current_page;
  const totalPages = Math.max(1, paginationMeta.last_page);
  const totalCount = paginationMeta.total;
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="">Subtotal</TableHead>
              <TableHead className="hidden lg:table-cell">Updated</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* loading */}
            {isLoading && <TableMessage message="Loading orders..." />}

            {/* handle error */}
            {!isLoading && errorMessage && <TableMessage message={errorMessage} />}

            {/* handle empty */}
            {!isLoading && !errorMessage && orders.length === 0 && <TableMessage message={emptyMessage} />}

            {!isLoading &&
              !errorMessage &&
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar />
                      <div className="leading-loose">
                        <h3 className="font-medium">{order.address?.recipient_name}</h3>
                        <p className="text-xs text-gray-800">{order.address?.address_line}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.address?.phone}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onValueChange={(status) => onStatusChange(order, status as OrderStatus)}
                    >
                      <SelectTrigger className="h-8 w-36 capitalize" aria-label={`Update status for ${order.order_number}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(OrderStatus).map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatOrderDate(order.updated_at)}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${order.order_number}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onView(order)}>
                          <Eye />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${order.id}/edit`}>
                            <Pencil />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(order)}>
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* control paginated */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {totalCount} order{totalCount === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft />
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
