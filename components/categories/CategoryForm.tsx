'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ImagePlus, UploadCloud, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Category, CategoryPayload } from '@/types';
import { CategoryStatus } from '@/constant';
import { Checkbox } from '../ui/checkbox';
import { getProductImageUrl } from '@/lib/product';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

interface CategoryFormProps {
  initialCategory?: Category;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (payload: CategoryPayload) => void;
}

interface CategoryFormValues {
  name: string;
  description?: string;
  status: boolean;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive">{message}</p> : null;

export const CategoryForm = ({ initialCategory, isSubmitting, submitLabel, onSubmit }: CategoryFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialCategory?.image || initialCategory?.image_url
      ? getProductImageUrl(initialCategory?.image ?? initialCategory?.image_url)
      : null,
  );
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const previewObjectUrl = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: initialCategory?.name ?? '',
      description: initialCategory?.description ?? '',
      status: initialCategory ? initialCategory.status === 'active' : true,
    },
  });

  const handleSelectedImage = (selectedFile?: File) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('Image must be 10 MB or smaller.');
      return;
    }

    setImageError(null);
    setImageFile(selectedFile);
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = URL.createObjectURL(selectedFile);
    setPreviewUrl(previewObjectUrl.current);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSelectedImage(event.target.files?.[0]);
  };

  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingImage(false);
    handleSelectedImage(event.dataTransfer.files[0]);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageError(null);
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    setPreviewUrl(null);
  };

  const handleValidSubmit: SubmitHandler<CategoryFormValues> = (values) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim(),
      status: values.status ? CategoryStatus.ACTIVE : CategoryStatus.INACTIVE,
      image: imageFile,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
      <Card className="rounded-sm shadow-none border-border">
        <CardContent className="flex flex-col pt-6">
          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Category Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g. Smart Devices, Audio, Wearables"
                className="rounded-sm shadow-none border-border"
                {...register('name', { required: 'Name is required.' })}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief summary of gadgets in this category..."
                className="rounded-sm shadow-none border-border"
                {...register('description')}
              />
            </div>

            {/* Category Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Category Thumbnail Image
              </Label>

              <div className="grid gap-4 sm:grid-cols-[140px_1fr] items-start">
                {/* Image Preview Box */}
                <div
                  className={`relative flex aspect-square size-35 items-center justify-center overflow-hidden rounded-sm border bg-slate-50 transition-colors ${
                    isDraggingImage ? 'border-[#C8102E] bg-red-50/50' : 'border-border'
                  }`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={handleImageDrop}
                >
                  {previewUrl ? (
                    <div className="relative size-full p-2 flex items-center justify-center">
                      <Image
                        src={previewUrl}
                        alt="Category preview"
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-sm bg-rose-600 text-white shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center text-xs text-slate-400">
                      <ImagePlus className="size-7 mb-1 text-slate-400" />
                      <span>No image</span>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="space-y-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="category-image-upload"
                      className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-none w-fit"
                    >
                      <UploadCloud className="size-4 text-slate-500" />
                      <span>Choose image file</span>
                    </label>
                    <input
                      id="category-image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <p className="text-[11px] text-slate-400">
                      Supports PNG, JPG, or WEBP up to 10 MB. This image will display on the client home showcase row.
                    </p>
                  </div>
                  {imageError && <p className="text-xs text-rose-600 font-medium">{imageError}</p>}
                </div>
              </div>
            </div>

            {/* Status Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <Checkbox id="status" {...register('status')} className="rounded-sm" />
              <Label htmlFor="status" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Category is Active (visible in client navigation & showcases)
              </Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" asChild className="rounded-sm shadow-none">
                <Link href="/admin/categories">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-sm shadow-none">
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
