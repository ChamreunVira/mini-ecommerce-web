'use client';
import { categoryService } from '@/services/category-service';
import React, { useEffect, useState } from 'react';
import { AppContainer } from './Container';
import { Category } from '@/types';
import SectionHeading from './SectionHeading';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const categoryImages = [
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
];

export const HomeCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error: unknown) {
      console.log('Error: failed to fetch categories.', error);
    }
  };

  useEffect(() => {
    handleFetchCategory();
    return () => new AbortController().abort();
  }, []);

  return (
    <AppContainer>
      <SectionHeading title="📦 Top Categories">
        <Button variant="ghost" className="text-xs group">
          All
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-75" />
        </Button>
      </SectionHeading>
      {/* <div>
        <h1 className="font-medium text-xl">📦 All Category</h1>
      </div> */}
      <div className="my-8 flex items-stretch gap-4 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <button
            type="button"
            className="group relative min-w-52 overflow-hidden rounded-md border bg-gray-100 text-left shadow-xs transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            key={category.id}
          >
            <img
              src={categoryImages[index % categoryImages.length]}
              alt=""
              className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 truncate text-base font-medium text-white">
              {category.name}
            </p>
          </button>
        ))}
      </div>
    </AppContainer>
  );
};
