'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/axios';
import type { CategoryPayload } from '@/types';
import { categoryService } from '@/services/category-service';
import { CategoryForm } from '@/components/categories/CategoryForm';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (payload: CategoryPayload) => {
    console.log(payload);
    setIsSubmitting(true);
    try {
      await categoryService.create(payload);
      toast.success('Product created.');
      router.push('/admin/categories');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create product.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add category</h1>
        <p className="text-sm text-muted-foreground">Create a new product in your catalog.</p>
      </div>

      <CategoryForm isSubmitting={isSubmitting} submitLabel="Create product" onSubmit={handleCreate} />
    </div>
  );
}
