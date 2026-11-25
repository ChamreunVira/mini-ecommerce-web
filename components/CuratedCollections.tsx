'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AppContainer } from './Container';
import { Skeleton } from './ui/skeleton';
import { categoryService } from '@/services/category-service';
import { productService } from '@/services/product-service';
import { Product } from '@/types';
import { CategoryStatus } from '@/constant';
import { getProductImageUrl } from '@/lib/product';

interface CuratedCardItem {
  id: string;
  title: string;
  itemCountText: string;
  href: string;
  imageUrl: string;
}

const DEFAULT_CURATED_IDEAS: CuratedCardItem[] = [
  {
    id: 'setup-ideas',
    title: 'Tech Setup Ideas',
    itemCountText: '128 Ideas',
    href: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'travel-tech',
    title: 'Travel Tech Essentials',
    itemCountText: '96 Ideas',
    href: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'smart-home',
    title: 'Smart Home Inspiration',
    itemCountText: '74 Ideas',
    href: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gaming-gear',
    title: 'Gaming Gear',
    itemCountText: '155 Ideas',
    href: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'minimal-desk',
    title: 'Minimal Desk Setup',
    itemCountText: '87 Ideas',
    href: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
  },
];

export const CuratedCollections: React.FC = () => {
  const [items, setItems] = useState<CuratedCardItem[]>(DEFAULT_CURATED_IDEAS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catResponse, prodResponse] = await Promise.all([
        categoryService.getAll(),
        productService.getAll({ limit: 50 }),
      ]);

      if (catResponse && catResponse.success && Array.isArray(catResponse.data)) {
        const activeCategories = catResponse.data.filter((c) => c.status === CategoryStatus.ACTIVE);
        const allProducts: Product[] =
          prodResponse && prodResponse.success && Array.isArray(prodResponse.data) ? prodResponse.data : [];

        if (activeCategories.length >= 3) {
          const mappedItems: CuratedCardItem[] = activeCategories.slice(0, 5).map((category, idx) => {
            const categoryProducts = allProducts.filter(
              (p) =>
                p.category?.toLowerCase() === category.name.toLowerCase() ||
                p.category?.toLowerCase() === category.slug.toLowerCase(),
            );

            const firstProductWithImage = categoryProducts.find((p) => p.image_url);
            const fallback = DEFAULT_CURATED_IDEAS[idx % DEFAULT_CURATED_IDEAS.length];
            const imageUrl = firstProductWithImage
              ? getProductImageUrl(firstProductWithImage.image_url)
              : fallback.imageUrl;

            return {
              id: String(category.id),
              title: category.name,
              itemCountText: `${categoryProducts.length > 0 ? categoryProducts.length * 12 : 50 + idx * 20} Ideas`,
              href: `/products?category=${encodeURIComponent(category.slug)}`,
              imageUrl,
            };
          });

          // Fill up to 5 items if fewer categories
          while (mappedItems.length < 5) {
            mappedItems.push(DEFAULT_CURATED_IDEAS[mappedItems.length]);
          }

          setItems(mappedItems);
        }
      }
    } catch {
      // Keep DEFAULT_CURATED_IDEAS fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <AppContainer className="pt-8 sm:pt-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#111827]">Ideas for Your Next Upgrade</h2>
        <Link href="/products" className="text-sm font-semibold text-[#C8102E] hover:underline transition-colors">
          See more ideas
        </Link>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-72 min-w-[240px] sm:min-w-0 flex-1 rounded-[14px] bg-[#F3F4F6] p-4 flex flex-col justify-end animate-pulse border border-[#EAECEF]"
            >
              <Skeleton className="h-5 w-3/4 rounded-md mb-2" />
              <Skeleton className="h-3 w-1/3 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        /* 5 Tall Curated Photo Cards */
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative flex h-72 min-w-[240px] sm:min-w-0 flex-1 flex-col justify-end overflow-hidden rounded-[14px] bg-slate-950 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C8102E]/20"
              aria-label={`Browse ${item.title}`}
            >
              {/* Background Lifestyle Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-75 transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Dark bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* White circular ">" arrow — bottom-RIGHT corner */}
              <div className="absolute right-3.5 bottom-3.5 z-10 flex size-8 items-center justify-center rounded-full bg-white text-[#111827] shadow-md transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-[#C8102E] group-hover:text-white group-hover:shadow-lg">
                <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>

              {/* Bottom content — title + item count bottom-LEFT */}
              <div className="relative z-10 p-4 pr-12">
                <h3 className="text-sm font-bold text-white leading-tight transition-transform duration-200 group-hover:-translate-y-0.5">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-white/80 font-normal">{item.itemCountText}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppContainer>
  );
};
