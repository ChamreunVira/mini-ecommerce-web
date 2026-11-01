'use client';

import { CategoryForm } from '@/components/categories/CategoryForm';
import { getErrorMessage } from '@/lib/axios';
import { categoryService } from '@/services/category-service';
import type { Category, CategoryPayload } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditCategoryContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      const categoryId = Number(id);
      if (!Number.isInteger(categoryId) || categoryId < 1) {
        setErrorMessage('Invalid category id.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await categoryService.getById(categoryId);
        const categoryData = response?.data ?? response;
        setCategory(categoryData);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Failed to load category.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategory();
  }, [id]);

  const handleUpdate = async (payload: CategoryPayload) => {
    setIsSubmitting(true);
    try {
      await categoryService.update(Number(id), payload);
      toast.success('Category updated.');
      router.push('/admin/categories');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update category.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading category...</p>;
  if (errorMessage) return <p className="text-sm text-destructive">{errorMessage}</p>;
  if (!category) return <p className="text-sm text-muted-foreground">Category not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit category</h1>
        <p className="text-sm text-muted-foreground">Update this category in your catalog.</p>
      </div>
      <CategoryForm
        initialCategory={category}
        isSubmitting={isSubmitting}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
      />
    </div>
  );
}
