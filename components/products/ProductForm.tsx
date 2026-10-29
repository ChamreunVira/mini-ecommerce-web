'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getProductImageUrl } from '@/lib/product';
import type { Category, Product, ProductPayload } from '@/types';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  quantity: string;
  categoryId: string;
}

interface ProductFormProps {
  categories: Category[];
  initialProduct?: Product;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => void;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive">{message}</p> : null;

export const ProductForm = ({ categories, initialProduct, isSubmitting, submitLabel, onSubmit }: ProductFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(getProductImageUrl(initialProduct?.image_url ?? null));

  const initialCategoryId = categories.find((category) => category.name === initialProduct?.category)?.id;

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    defaultValues: {
      name: initialProduct?.name ?? '',
      description: initialProduct?.description ?? '',
      price: initialProduct ? String(initialProduct.price) : '',
      quantity: initialProduct ? String(initialProduct.quantity) : '',
      categoryId: initialCategoryId ? String(initialCategoryId) : '',
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setImageError('Please select an image file.');
      return;
    }
    if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('Image must be 5 MB or smaller.');
      return;
    }

    setImageError(null);
    setImageFile(selectedFile);
  };

  const handleValidSubmit: SubmitHandler<ProductFormValues> = (values) => {
    if (!initialProduct && !imageFile) {
      setImageError('Product image is required.');
      return;
    }

    if (imageFile) {
      onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        quantity: Number(values.quantity),
        category_id: Number(values.categoryId),
        image: imageFile,
      });
    }
  };

  useEffect(() => {
    if (!imageFile) return;

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
      <Card>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-[240px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-muted">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Product preview" className="size-full object-cover" />
              ) : (
                <span className="text-sm text-muted-foreground">No image selected</span>
              )}
            </div>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
            <FieldError message={imageError ?? undefined} />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="iPhone 12 Pro Max"
                {...register('name', { required: 'Name is required.' })}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...register('description')} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', {
                    required: 'Price is required.',
                    validate: (value) => Number(value) >= 0 || 'Price must be 0 or more.',
                  })}
                />
                <FieldError message={errors.price?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="1"
                  min="0"
                  {...register('quantity', {
                    required: 'Quantity is required.',
                    validate: (value) =>
                      Number.isInteger(Number(value)) && Number(value) >= 0
                        ? true
                        : 'Quantity must be a whole number, 0 or more.',
                  })}
                />
                <FieldError message={errors.quantity?.message} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: 'Category is required.' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.categoryId?.message} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
