'use client';
import { categoryService } from '@/services/category-service';
import React, { useEffect, useState } from 'react';
import { AppContainer } from './Container';
import { Category } from '@/types';
import SectionHeading from './SectionHeading';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CategoryStatus } from '@/constant';

const categoryImages = [
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
];

export const HomeCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const handleFetchCategory = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.success) {
          setCategories(response.data.filter((category) => category.status === CategoryStatus.ACTIVE));
        }
      } catch (error: unknown) {
        console.log('Error: failed to fetch categories.', error);
      }
    };
    handleFetchCategory();
    return () => new AbortController().abort();
  }, []);

  return (
    <AppContainer className="pt-10 sm:pt-14">
      <SectionHeading title="Shop by category" description="A quick way to find what you need.">
        <Button variant="ghost" className="group text-xs" asChild>
          <Link href="/products">
            View all
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-75" />
          </Link>
        </Button>
      </SectionHeading>
      <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 4).map((category, index) => (
          <Link
            href={`/products?category=${encodeURIComponent(category.slug)}`}
            className="group relative min-h-48 overflow-hidden rounded border bg-gray-100 text-left shadow-xs transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            key={category.id}
            aria-label={`Browse products in ${category.name}`}
          >
            <img
              src={categoryImages[index % categoryImages.length]}
              alt={`${category.name} collection`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 text-white">
              <p className="truncate text-lg font-semibold">{category.name}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">
                {category.description || `Explore the ${category.name.toLowerCase()} collection.`}
              </p>
            </div>
          </Link>
        ))}
        {categories.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed px-5 py-8 text-center text-sm text-slate-500">
            Categories will appear here as the collection grows.
          </p>
        )}
      </div>
    </AppContainer>
  );
};
