'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { PaymentMethod, PaymentStatus } from '@/constant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ViewResourceDialog } from '@/components/ViewResourceDialog';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { Payment } from '@/types';
import { getErrorMessage } from '@/lib/axios';
import { paymentService } from '@/services/payment-service';
import { PaymentTable } from '@/components/payments/PaymentTable';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [refreshingPaymentId, setRefreshingPaymentId] = useState<number | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await paymentService.getAll();
        setPayments(response.data);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Failed to load payments.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadPayments();
  }, []);

  const handleRefreshStatus = async (payment: Payment) => {
    setRefreshingPaymentId(payment.id);
    try {
      const response = await paymentService.check(payment.transaction_id);
      setPayments((currentPayments) =>
        currentPayments.map((currentPayment) =>
          currentPayment.transaction_id === payment.transaction_id
            ? { ...currentPayment, status: response.data.status }
            : currentPayment,
        ),
      );
      toast.success(`Payment status refreshed: ${response.data.status}.`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to refresh payment status.'));
    } finally {
      setRefreshingPaymentId(null);
    }
  };

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      normalizedSearch === '' ||
      [payment.transaction_id, payment.method, payment.status].some((value) =>
        value.toLocaleLowerCase().includes(normalizedSearch),
      );
    return (
      matchesSearch &&
      (methodFilter === 'all' || payment.method === methodFilter) &&
      (statusFilter === 'all' || payment.status === statusFilter)
    );
  });
  const hasActiveFilters = normalizedSearch !== '' || methodFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setMethodFilter('all');
    setStatusFilter('all');
  };

  const handleViewPayment = (payment: Payment) => {
    setViewingPayment({
      id: payment.id,
      transaction_id: String(payment.transaction_id),
      method: payment.method,
      amount: payment.amount,
      status: payment.status,
      currency: payment.currency,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-sm text-muted-foreground">Review transactions and refresh their payment status.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search transaction, method, or status..."
            aria-label="Search payments"
            className="pl-9"
          />
        </div>
        <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as 'all' | PaymentMethod)}>
          <SelectTrigger className="w-full lg:w-40" aria-label="Filter payments by method">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            {Object.values(PaymentMethod).map((method) => (
              <SelectItem key={method} value={method} className="uppercase">
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | PaymentStatus)}>
          <SelectTrigger className="w-full lg:w-40" aria-label="Filter payments by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.values(PaymentStatus).map((status) => (
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

      <PaymentTable
        payments={filteredPayments}
        isLoading={isLoading}
        errorMessage={errorMessage}
        emptyMessage={hasActiveFilters ? 'No payments match your filters.' : 'No payments found.'}
        totalCount={filteredPayments.length}
        onView={handleViewPayment}
        refreshingPaymentId={refreshingPaymentId}
        onRefreshStatus={handleRefreshStatus}
      />

      <ViewResourceDialog
        resource={viewingPayment}
        onClose={() => setViewingPayment(null)}
        getTitle={(payment) => payment.transaction_id}
        getDescription={(payment) => `Payment recorded on ${formatOrderDate(payment.created_at)}`}
      >
        {(payment) => (
          <dl className="space-y-2">
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Method</dt>
              <dd className="font-medium capitalize">{payment.method}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium">{formatCurrency(payment.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Status</dt>http://localhost:3000/admin/overview
              <dd className="font-medium capitalize">{payment.status}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Currency</dt>
              <dd className="font-medium">{payment.currency}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2 text-sm">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="font-medium">{formatOrderDate(payment.updated_at)}</dd>
            </div>
          </dl>
        )}
      </ViewResourceDialog>
    </div>
  );
}
