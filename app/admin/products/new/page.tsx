'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ProductForm } from '@/components/products/ProductForm';
import { getErrorMessage } from '@/lib/axios';
import type { Category, ProductPayload } from '@/types';
import { categoryService } from '@/services/category-service';
import { productService } from '@/services/product-service';

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    categoryService
      .getAll()
      .then((response) => setCategories(response.data))
      .catch((error) => toast.error(getErrorMessage(error, 'Failed to load categories.')));
  }, []);

  const handleCreate = async (payload: ProductPayload) => {
    setIsSubmitting(true);
    try {
      await productService.create(payload);
      toast.success('Product created.');
      router.push('/dashboard/products');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create product.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add product</h1>
        <p className="text-sm text-muted-foreground">Create a new product in your catalog.</p>
      </div>

      {categories ? (
        <ProductForm
          categories={categories}
          isSubmitting={isSubmitting}
          submitLabel="Create product"
          onSubmit={handleCreate}
        />
      ) : (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
    </div>
  );
}
