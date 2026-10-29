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
import type { PaginationMeta, Product } from '@/types';

import { ProductThumbnail } from './ProductThumbnail';
import { StockBadge } from './StockBadge';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  errorMessage: string | null;
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const COLUMN_COUNT = 7;

const TableMessage = ({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={COLUMN_COUNT} className="h-24 text-center text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);

export const ProductTable = ({
  products,
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
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="hidden sm:table-cell">Stock</TableHead>
              <TableHead className="hidden lg:table-cell">Updated</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* loading */}
            {isLoading && <TableMessage message="Loading products..." />}

            {/* handle error */}
            {!isLoading && errorMessage && <TableMessage message={errorMessage} />}

            {/* handle empty */}
            {!isLoading && !errorMessage && products.length === 0 && <TableMessage message="No products found." />}

            {!isLoading &&
              !errorMessage &&
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <ProductThumbnail imagePath={product.image_url} productName={product.name} />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span>{product.quantity}</span>
                      <StockBadge quantity={product.quantity} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formatOrderDate(product.updated_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${product.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onView(product)}>
                          <Eye />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(product)}>
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
