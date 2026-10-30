import Link from 'next/link';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatOrderDate } from '@/lib/format';
import { CategoryStatus } from '@/constant';
import type { Category } from '@/types';

interface ProductTableProps {
  categories: Category[];
  isLoading: boolean;
  errorMessage: string | null;
  emptyMessage: string;
  totalCount: number;
  onView: (product: Category) => void;
  onDelete: (product: Category) => void;
  updatingCategoryId: number | null;
  onStatusChange: (category: Category, status: CategoryStatus) => void;
}

const COLUMN_COUNT = 6;

const TableMessage = ({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={COLUMN_COUNT} className="h-24 text-center text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);

export const CategoryTable = ({
  categories,
  isLoading,
  errorMessage,
  emptyMessage,
  totalCount,
  onView,
  onDelete,
  updatingCategoryId,
  onStatusChange,
}: ProductTableProps) => (
  <div className="space-y-4">
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Updated</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableMessage message="Loading categories..." />}
          {!isLoading && errorMessage && <TableMessage message={errorMessage} />}
          {!isLoading && !errorMessage && categories.length === 0 && <TableMessage message={emptyMessage} />}
          {!isLoading &&
            !errorMessage &&
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell className="font-medium hover:underline cursor-pointer" onClick={() => onView(category)}>
                  {category.name}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{category.description ?? 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={category.status === CategoryStatus.ACTIVE}
                      disabled={updatingCategoryId === category.id}
                      onCheckedChange={(checked) =>
                        onStatusChange(category, checked ? CategoryStatus.ACTIVE : CategoryStatus.INACTIVE)
                      }
                      aria-label={`Set ${category.name} ${category.status === CategoryStatus.ACTIVE ? 'inactive' : 'active'}`}
                    />
                    <span className="text-sm capitalize text-muted-foreground" aria-live="polite">
                      {category.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatOrderDate(category.updated_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${category.name}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onView(category)}>
                        <Eye />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Pencil />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete(category)}>
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

    <div className="text-sm text-muted-foreground">
      <span>
        {totalCount} category{totalCount === 1 ? '' : 's'}
      </span>
    </div>
  </div>
);
