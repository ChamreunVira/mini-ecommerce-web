import { Eye, MoreHorizontal, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { Payment } from '@/types';
import { Badge } from '../ui/badge';
import { PaymentStatus } from '@/constant';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

interface PaymentTableProps {
  payments: Payment[];
  isLoading: boolean;
  errorMessage: string | null;
  emptyMessage: string;
  totalCount: number;
  onView: (payment: Payment) => void;
  refreshingPaymentId: number | null;
  onRefreshStatus: (payment: Payment) => void;
  updatingPaymentId: number | null;
  onStatusChange: (payment: Payment, status: PaymentStatus) => void;
}

const COLUMN_COUNT = 7;

const statusClassNames: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'border-amber-200 bg-amber-50 text-amber-700',
  [PaymentStatus.PAID]: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  [PaymentStatus.FAILED]: 'border-rose-200 bg-rose-50 text-rose-700',
  [PaymentStatus.REFUNDED]: 'border-slate-200 bg-slate-50 text-slate-700',
};

const formatStatus = (status: PaymentStatus) => status.replace('_', ' ');

const TableMessage = ({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={COLUMN_COUNT} className="h-24 text-center text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);

export const PaymentTable = ({
  payments,
  isLoading,
  errorMessage,
  emptyMessage,
  totalCount,
  onView,
  refreshingPaymentId,
  onRefreshStatus,
  updatingPaymentId,
  onStatusChange,
}: PaymentTableProps) => (
  <div className="space-y-4">
    <div className="rounded-md border">
      <Table className="min-w-212.5">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="hidden lg:table-cell">Updated</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableMessage message="Loading payments..." />}
          {!isLoading && errorMessage && <TableMessage message={errorMessage} />}
          {!isLoading && !errorMessage && payments.length === 0 && <TableMessage message={emptyMessage} />}
          {!isLoading &&
            !errorMessage &&
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="max-w-56 truncate font-medium" title={payment.transaction_id}>
                  {payment.transaction_id}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase">
                    {payment.method}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`capitalize ${statusClassNames[payment.status]}`}>
                      {formatStatus(payment.status)}
                    </Badge>
                    <Select
                      value={payment.status}
                      disabled={updatingPaymentId === payment.id}
                      onValueChange={(status) => onStatusChange(payment, status as PaymentStatus)}
                    >
                      <SelectTrigger
                        className="h-8 w-8 border-0 p-0 [&>svg]:size-3"
                        aria-label={`Update status for ${payment.transaction_id}`}
                      >
                        <span className="sr-only">Change status</span>
                      </SelectTrigger>
                      <SelectContent position="popper" align="start" className="min-w-40">
                        {Object.values(PaymentStatus).map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {formatStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{payment.currency}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatOrderDate(payment.updated_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${payment.transaction_id}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onView(payment)}>
                        <Eye />
                        View details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>

    <div className="text-sm text-muted-foreground">
      <span>
        {totalCount} payment{totalCount === 1 ? '' : 's'}
      </span>
    </div>
  </div>
);
