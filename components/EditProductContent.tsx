'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/axios';
import type { Category, Product, ProductPayload } from '@/types';
import { productService } from '@/services/product-service';
import { categoryService } from '@/services/category-service';
import { ProductForm } from '@/components/products/ProductForm';

export default function EditProductContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([productService.getById(productId), categoryService.getAll()])
      .then(([productResponse, categoryResponse]) => {
        setProduct(productResponse.data);
        setCategories(categoryResponse.data);
      })
      .catch((error) => toast.error(getErrorMessage(error, 'Failed to load product.')));
  }, [productId]);

  const handleUpdate = async (payload: ProductPayload) => {
    setIsSubmitting(true);
    try {
      await productService.update(productId, payload);
      toast.success('Product updated.');
      router.push('/dashboard/products');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update product.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit product</h1>
        <p className="text-sm text-muted-foreground">Update details, stock, or the product image.</p>
      </div>

      {product && categories ? (
        <ProductForm
          initialProduct={product}
          categories={categories}
          isSubmitting={isSubmitting}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
      ) : (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
    </div>
  );
}
