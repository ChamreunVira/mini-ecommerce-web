import { Eye, MoreHorizontal, Printer, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatus } from '@/constant';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { Order, PaginationMeta } from '@/types';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  errorMessage: string | null;
  emptyMessage: string;
  paginationMeta: PaginationMeta;
  updatingOrderId: number | null;
  onPageChange: (page: number) => void;
  onView: (order: Order) => void;
  onPrint: (order: Order) => void;
  onDelete: (order: Order) => void;
  onStatusChange: (order: Order, status: OrderStatus) => void;
}

const COLUMN_COUNT = 6;

const DEFAULT_STATUS_CLASS_NAME = 'border-slate-200 bg-slate-50 text-slate-700';

// Keyed by the string value of OrderStatus. Adjust the keys to match your enum.
const statusClassNames: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  processing: 'border-blue-200 bg-blue-50 text-blue-700',
  shipped: 'border-orange-200 bg-orange-50 text-orange-700',
  delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-rose-200 bg-rose-50 text-rose-700',
  refunded: 'border-slate-200 bg-slate-50 text-slate-700',
};

const getStatusClassName = (status: OrderStatus) =>
  statusClassNames[String(status).toLowerCase()] ?? DEFAULT_STATUS_CLASS_NAME;

const formatStatus = (status: OrderStatus) => String(status).replace(/_/g, ' ');

const TableMessage = ({ message, className }: { message: string; className?: string }) => (
  <TableRow>
    <TableCell colSpan={COLUMN_COUNT} className={`h-24 text-center ${className ?? 'text-muted-foreground'}`}>
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
  updatingOrderId,
  onPageChange,
  onView,
  onPrint,
  onDelete,
  onStatusChange,
}: OrderTableProps) => (
  <div className="space-y-4">
    <div className="rounded-sm border border-slate-200 shadow-none bg-white">
      <Table className="min-w-212.5">
        <TableHeader>
          <TableRow className="border-b border-slate-200 hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableMessage message="Loading orders..." />}
          {!isLoading && errorMessage && <TableMessage message={errorMessage} className="text-destructive" />}
          {!isLoading && !errorMessage && orders.length === 0 && <TableMessage message={emptyMessage} />}
          {!isLoading &&
            !errorMessage &&
            orders.map((order) => (
              <TableRow key={order.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.address?.recipient_name ?? 'Guest'}</div>
                  <div className="text-xs text-muted-foreground">{order.address?.phone ?? 'N/A'}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatOrderDate(order.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`capitalize rounded-sm shadow-none text-xs ${getStatusClassName(order.status)}`}>
                      {formatStatus(order.status)}
                    </Badge>
                    <Select
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onValueChange={(status) => onStatusChange(order, status as OrderStatus)}
                    >
                      <SelectTrigger
                        className="h-7 w-7 rounded-sm border-0 p-0 shadow-none hover:bg-slate-100 [&>svg]:size-3"
                        aria-label={`Update status for ${order.order_number}`}
                      >
                        <span className="sr-only">Change status</span>
                      </SelectTrigger>
                      <SelectContent position="popper" align="start" className="min-w-40 rounded-sm shadow-none border-border">
                        {Object.values(OrderStatus).map((status) => (
                          <SelectItem key={status} value={status} className="capitalize rounded-sm text-xs">
                            {formatStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-sm shadow-none" aria-label={`Actions for ${order.order_number}`}>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-sm shadow-none border-border">
                      <DropdownMenuItem onSelect={() => onView(order)} className="rounded-sm cursor-pointer">
                        <Eye className="size-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onPrint(order)} className="rounded-sm cursor-pointer">
                        <Printer className="size-4" />
                        Print invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive rounded-sm cursor-pointer"
                        onSelect={() => onDelete(order)}
                      >
                        <Trash2 className="size-4" />
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

    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Page {paginationMeta.current_page} of {paginationMeta.last_page} · {paginationMeta.total} order
        {paginationMeta.total === 1 ? '' : 's'}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm shadow-none"
          disabled={paginationMeta.current_page <= 1 || isLoading}
          onClick={() => onPageChange(paginationMeta.current_page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm shadow-none"
          disabled={!paginationMeta.has_more_pages || isLoading}
          onClick={() => onPageChange(paginationMeta.current_page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);
