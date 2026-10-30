'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { CategoryStatus } from '@/constant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryTable } from '@/components/categories/CategoryTable';
import { DeleteResourceDialog } from '@/components/DeleteResourceDialog';
import { ViewResourceDialog } from '@/components/ViewResourceDialog';
import { getErrorMessage } from '@/lib/axios';
import { formatOrderDate } from '@/lib/format';
import { categoryService } from '@/services/category-service';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CategoryStatus>('all');

  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategoryId, setUpdatingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll();
        const loadedCategories = Array.isArray(response.data)
          ? response.data.filter((category): category is Category => category != null)
          : [];

        setCategories(loadedCategories);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Failed to load products.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);

    try {
      await categoryService.toggleStatus(categoryToDelete.id);
      setCategories((currentCategories) => currentCategories.filter((category) => category.id !== categoryToDelete.id));
      toast.success(`"${categoryToDelete.name}" deleted.`);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete category.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (category: Category, status: CategoryStatus) => {
    if (category.status === status) return;

    setUpdatingCategoryId(category.id);

    try {
      const response = await categoryService.toggleStatus(category.id);
      setCategories((currentCategories) =>
        currentCategories.map((currentCategory) =>
          currentCategory.id === category.id ? (response.data ?? { ...currentCategory, status }) : currentCategory,
        ),
      );
      toast.success(`"${category.name}" is now ${status}.`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update category status.'));
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [category.name, category.slug, category.description ?? ''].some((value) =>
        value.toLocaleLowerCase().includes(normalizedSearch),
      );

    return matchesSearch && (statusFilter === 'all' || category.status === statusFilter);
  });
  const hasActiveFilters = normalizedSearch.length > 0 || statusFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Category</h1>
          <p className="text-sm text-muted-foreground">Manage your catalog, name, and status.</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus />
            Add category
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, slug, or description..."
            aria-label="Search categories"
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | CategoryStatus)}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter categories by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={CategoryStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={CategoryStatus.INACTIVE}>Inactive</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={resetFilters}>
            <X />
            Reset
          </Button>
        )}
      </div>

      <CategoryTable
        categories={filteredCategories}
        isLoading={isLoading}
        errorMessage={errorMessage}
        emptyMessage={hasActiveFilters ? 'No categories match your filters.' : 'No categories found.'}
        totalCount={filteredCategories.length}
        onView={setViewingCategory}
        onDelete={setCategoryToDelete}
        updatingCategoryId={updatingCategoryId}
        onStatusChange={handleStatusChange}
      />

      <ViewResourceDialog
        resource={viewingCategory}
        onClose={() => setViewingCategory(null)}
        getTitle={(category) => category.name}
        getDescription={(category) => category.description ?? 'No description provided.'}
      >
        {(category) => (
          <dl className="space-y-2">
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium capitalize">{category.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="font-medium capitalize">{category.description ?? 'No description'}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize">{category.status}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b py-2 text-sm">
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">{formatOrderDate(category.created_at)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2 text-sm">
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="font-medium">{formatOrderDate(category.updated_at)}</dd>
            </div>
          </dl>
        )}
      </ViewResourceDialog>

      <DeleteResourceDialog
        resource={categoryToDelete}
        resourceLabel="category"
        getResourceName={(category) => category.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
