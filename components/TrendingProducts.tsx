'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AppContainer } from './Container';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';
import { productService } from '@/services/product-service';
import { Product } from '@/types';

// Curated studio products matching reference showcase for reliable visual rendering
const FALLBACK_TRENDING_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'Smart Watch Series 9',
    description: 'Advanced health metrics, always-on Retina display, water resistant.',
    price: 299.99,
    quantity: 15,
    category: 'Wearables',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 102,
    name: 'Wireless Earbuds Pro',
    description: 'Active noise cancellation, transparency mode, spatial audio.',
    price: 129.99,
    quantity: 24,
    category: 'Audio',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 103,
    name: 'Portable Bluetooth Speaker',
    description: 'Deep bass, 24-hour battery life, waterproof IPX7 rating.',
    price: 59.99,
    quantity: 18,
    category: 'Audio',
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 104,
    name: '3-in-1 Wireless Charger',
    description: 'Fast charging station for smartphone, watch, and earbuds.',
    price: 49.99,
    quantity: 30,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 105,
    name: '4K Camera Drone',
    description: 'Ultra-clear 4K HDR camera, 3-axis gimbal, 35-min flight time.',
    price: 499.99,
    quantity: 8,
    category: 'Gadgets',
    image_url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 106,
    name: 'Smartphone Gimbal',
    description: '3-axis stabilization, active tracking, built-in extension rod.',
    price: 89.99,
    quantity: 12,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const TrendingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(FALLBACK_TRENDING_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productService.getBestSelling(6);
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        setProducts(response.data.slice(0, 6));
      } else {
        // Fallback to recent products if best-selling has no records
        const fallback = await productService.getAll({ limit: 6 });
        if (fallback && fallback.success && Array.isArray(fallback.data) && fallback.data.length > 0) {
          setProducts(fallback.data.slice(0, 6));
        } else {
          setProducts(FALLBACK_TRENDING_PRODUCTS);
        }
      }
    } catch {
      setProducts(FALLBACK_TRENDING_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return (
    <AppContainer className="pt-8 sm:pt-12">
      {/* Plain heading row matching reference design */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#111827]">Trending Products</h2>
        <Link
          href="/products"
          className="text-sm font-semibold text-[#C8102E] hover:underline transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-[200px] sm:min-w-0 flex-1 flex-col rounded-[12px] border border-[#EAECEF] bg-white p-3 shadow-xs space-y-2 animate-pulse"
            >
              <Skeleton className="aspect-square w-full rounded-[10px]" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-auto flex justify-between pt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="size-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 6-Column Responsive Product Grid */
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
          {products.map((product) => (
            <div key={product.id} className="min-w-[200px] sm:min-w-0 flex-1 flex flex-col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </AppContainer>
  );
};
