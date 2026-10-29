'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Category } from '@/types';
import { categoryService } from '@/services/category-service';
import { CategoryTable } from '@/components/categories/CategoryTable';
import { getErrorMessage } from '@/lib/axios';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  // const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  // const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to load products.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Category</h1>
          <p className="text-sm text-muted-foreground">Manage your catalog, name, and status.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus />
            Add category
          </Link>
        </Button>
      </div>

      {/* <ProductFilters
        filters={filters}
        categoryNames={categoryNames}
        hasActiveFilters={hasActiveFilters}
        onChange={updateFilters}
        onReset={resetFilters}
      /> */}

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        errorMessage={errorMessage}
        currentPage={0}
        totalPages={0}
        totalCount={0}
        onPageChange={() => {}}
        onView={() => {}}
        onDelete={() => {}}
      />

      {/* <ProductViewDialog product={viewingProduct} onClose={() => setViewingProduct(null)} />
      <DeleteProductDialog
        product={productToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setProductToDelete(null)}
      /> */}
    </div>
  );
}
