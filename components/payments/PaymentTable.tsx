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
import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { PaginationMeta, Payment } from '@/types';

interface ProductTableProps {
  payment: Payment[];
  isLoading: boolean;
  errorMessage: string | null;
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  onView: (product: Payment) => void;
  onDelete: (product: Payment) => void;
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
  payment: orders,
  isLoading,
  errorMessage,
  paginationMeta,
  onPageChange,
  onView,
  onDelete,
}: ProductTableProps) => {
  const currentPage = paginationMeta.current_page;
  const totalPages = paginationMeta.total;
  const totalCount = paginationMeta.last_page;
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">Recipient Name</TableHead>
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
            {!isLoading && !errorMessage && orders.length === 0 && <TableMessage message="No orders found." />}

            {!isLoading &&
              !errorMessage &&
              orders.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.method}</TableCell>
                  <TableCell className="hidden md:table-cell">{payment.status}</TableCell>
                  <TableCell className="hidden md:table-cell">{payment.transaction_id}</TableCell>
                  <TableCell className="">{formatCurrency(payment.amount)}</TableCell>
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
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${payment.id}/edit`}>
                            <Pencil />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(payment)}>
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
          {totalCount} product{totalCount === 1 ? '' : 's'}
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
