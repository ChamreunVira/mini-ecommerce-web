'use client';
import { categoryService } from '@/services/category-service';
import React, { useEffect, useState } from 'react';
import { AppContainer } from './Container';
import { Category } from '@/types';
import SectionHeading from './SectionHeading';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export const HomeCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
        console.log(categories);
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
      <div className="flex items-center gap-4 my-8">
        {categories.map((category) => (
          <div className="px-8 py-4 rounded-md bg-gray-100 cursor-pointer" key={category.id}>
            <p className="text-xl font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </AppContainer>
  );
};
