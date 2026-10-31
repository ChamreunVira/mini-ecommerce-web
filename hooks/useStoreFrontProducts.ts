'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { productService } from '@/services/product-service';

type FetchStatus = 'loading' | 'success' | 'error';

export const useStorefrontProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const response = await productService.getAll({});
        if (!isActive) return;

        if (response.success) {
          const newestFirst = [...response.data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          );
          setProducts(newestFirst);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error: unknown) {
        if (!isActive) return;
        console.error('Failed to load storefront products.', error);
        setStatus('error');
      }
    };

    void loadProducts();
    return () => {
      isActive = false;
    };
  }, []);

  return { products, status };
};
