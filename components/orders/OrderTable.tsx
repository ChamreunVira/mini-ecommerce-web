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
import type { Order, PaginationMeta } from '@/types';

interface ProductTableProps {
  orders: Order[];
  isLoading: boolean;
  errorMessage: string | null;
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  onView: (product: Order) => void;
  onDelete: (product: Order) => void;
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
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.status}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.address?.recipient_name}</TableCell>
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
