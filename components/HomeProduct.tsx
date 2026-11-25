'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, AlertCircle } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { productService } from '@/services/product-service';
import { AppContainer } from './Container';
import SectionHeading from './SectionHeading';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { EmptyState } from './EmptyState';

export const HomeProduct: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [newestResponse, bestSellingResponse] = await Promise.all([
        productService.getAll({ limit: 12 }),
        productService.getBestSelling(8),
      ]);

      if (newestResponse.success) {
        const sorted = [...newestResponse.data]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 8);
        setNewArrivals(sorted);
      }
      if (bestSellingResponse.success) {
        setBestSellers(bestSellingResponse.data);
      }
    } catch (error) {
      console.error('Failed to load products for homepage', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <AppContainer className="space-y-16 py-14 sm:py-20">
      {/* 1. Best Sellers / Trending Section */}
      <section>
        <SectionHeading
          badge="Trending Now"
          title="Best-Selling Gear"
          description="The most popular items our customers are loving right now."
        >
          <Button variant="ghost" className="rounded-xl text-xs font-semibold hover:text-orange-600 group" asChild>
            <Link href="/products" className="gap-1.5">
              View all products
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </SectionHeading>

        {isLoading && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <div className="mt-auto flex justify-between pt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && hasError && (
          <div className="mt-8">
            <EmptyState
              icon={AlertCircle}
              title="Could not load best-sellers"
              description="An error occurred while fetching the products. Please try again."
              onRetry={fetchProducts}
            />
          </div>
        )}

        {!isLoading && !hasError && bestSellers.length === 0 && (
          <div className="mt-8">
            <EmptyState
              icon={Flame}
              title="No featured items yet"
              description="Best sellers will be highlighted here as orders are placed."
              actionLabel="Browse Catalog"
              actionHref="/products"
            />
          </div>
        )}

        {!isLoading && !hasError && bestSellers.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={`best-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 2. New Arrivals Section */}
      <section>
        <SectionHeading
          badge="Fresh Picks"
          title="New Arrivals"
          description="The latest additions to the vStore collection, fresh off the shelf."
        >
          <Button variant="ghost" className="rounded-xl text-xs font-semibold hover:text-orange-600 group" asChild>
            <Link href="/products" className="gap-1.5">
              Explore collection
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </SectionHeading>

        {isLoading && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <div className="mt-auto flex justify-between pt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !hasError && newArrivals.length === 0 && (
          <div className="mt-8">
            <EmptyState
              icon={Sparkles}
              title="No new arrivals"
              description="Check back soon for new additions to the catalog."
              actionLabel="View all products"
              actionHref="/products"
            />
          </div>
        )}

        {!isLoading && !hasError && newArrivals.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={`new-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>
    </AppContainer>
  );
};

export default HomeProduct;
