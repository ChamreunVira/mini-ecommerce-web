'use client';

import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Category, CategoryPayload } from '@/types';
import { Checkbox } from '../ui/checkbox';

interface CategoryFormProps {
  initialCategory?: Category;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (payload: CategoryPayload) => void;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive">{message}</p> : null;

export const CategoryForm = ({ initialCategory, isSubmitting, submitLabel, onSubmit }: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryPayload>({
    defaultValues: {
      name: initialCategory?.name ?? '',
      description: initialCategory?.description ?? '',
    },
  });

  const handleValidSubmit: SubmitHandler<CategoryPayload> = (values) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim(),
      status: Boolean(values.status) || true,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
      <Card>
        <CardContent className="flex flex-col pt-6">
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

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Checkbox {...register('status')} />
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
