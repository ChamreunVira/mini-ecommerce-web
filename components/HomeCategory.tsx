'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AppContainer } from './Container';
import { Skeleton } from './ui/skeleton';
import { categoryService } from '@/services/category-service';
import { Category } from '@/types';
import { CategoryStatus } from '@/constant';

// Curated high quality imagery for the 5 quick category showcase cards matching reference
const DEFAULT_CATEGORY_CARDS = [
  {
    id: 'cat-audio',
    name: 'Audio',
    subtitle: 'Premium Sound',
    slug: 'audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cat-smart',
    name: 'Smart Devices',
    subtitle: 'Smarter Living',
    slug: 'smart-devices',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cat-wearables',
    name: 'Wearables',
    subtitle: 'Track. Achieve.',
    slug: 'wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    subtitle: 'Designed for You',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cat-deals',
    name: 'Deals',
    subtitle: 'Top Deals Today',
    slug: 'deals',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80',
  },
];

export const HomeCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getAll();
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        setCategories(response.data.filter((c) => c.status === CategoryStatus.ACTIVE));
      }
    } catch {
      // Fallback cards handle offline/empty states gracefully
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const displayCards = DEFAULT_CATEGORY_CARDS.map((fallback, idx) => {
    const backendCat = categories[idx];
    if (backendCat) {
      return {
        id: String(backendCat.id),
        name: backendCat.name,
        subtitle: backendCat.description || fallback.subtitle,
        slug: backendCat.slug,
        image: backendCat.image || fallback.image,
      };
    }
    return fallback;
  });

  return (
    <AppContainer className="pt-6 sm:pt-8">
      {/* 5-Column Quick Category Showcase Row */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 min-w-[220px] sm:min-w-0 flex-1 rounded-[12px] bg-[#F6F7F9] p-3 flex flex-row items-center gap-3 animate-pulse border border-[#EAECEF]"
            >
              <Skeleton className="size-14 rounded-[10px] shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
              <Skeleton className="size-7 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
          {displayCards.map((card) => (
            <Link
              key={card.id}
              href={`/products?category=${encodeURIComponent(card.slug)}`}
              className="group flex h-24 min-w-[220px] sm:min-w-0 flex-1 flex-row items-center justify-between gap-3 p-3.5 rounded-[12px] bg-[#F6F7F9] border border-[#EAECEF] shadow-xs hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#C8102E]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]/30"
              aria-label={`Explore ${card.name}`}
            >
              {/* Product Thumbnail */}
              <div className="size-14 shrink-0 rounded-[10px] overflow-hidden bg-white p-1 flex items-center justify-center">
                <img
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  className="size-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#111827] text-sm leading-tight truncate group-hover:text-[#C8102E] transition-colors duration-200">
                  {card.name}
                </p>
                <p className="mt-1 text-[11px] text-[#6B7280] line-clamp-1 leading-tight">{card.subtitle}</p>
              </div>

              {/* Crimson circular arrow button */}
              <div className="size-7 shrink-0 flex items-center justify-center rounded-full bg-[#C8102E] text-white shadow-xs transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:scale-110 group-hover:bg-[#a50d26] group-hover:shadow-md">
                <span className="text-xs font-bold leading-none">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppContainer>
  );
};
