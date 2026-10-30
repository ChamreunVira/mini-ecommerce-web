import { useMemo, useState } from 'react';

import { getStockStatus, type StockStatus } from '@/lib/product';
import type { Product } from '@/types';

export type StockFilter = 'all' | StockStatus;
export type SortOption = 'newest' | 'oldest' | 'name_asc' | 'price_asc' | 'price_desc' | 'quantity_asc';

export interface ProductFilterState {
  searchQuery: string;
  category: string;
  stock: StockFilter;
  sort: SortOption;
}

const DEFAULT_FILTERS: ProductFilterState = {
  searchQuery: '',
  category: 'all',
  stock: 'all',
  sort: 'newest',
};

const sortProducts = (products: Product[], sort: SortOption): Product[] => {
  const sortedProducts = [...products];

  switch (sort) {
    case 'oldest':
      return sortedProducts.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
    case 'name_asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'price_asc':
      return sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price_desc':
      return sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
    case 'quantity_asc':
      return sortedProducts.sort((a, b) => a.quantity - b.quantity);
    case 'newest':
    default:
      return sortedProducts.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }
};

export const useProductFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<ProductFilterState>(DEFAULT_FILTERS);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = filters.searchQuery.trim().toLocaleLowerCase();
    const matchingProducts = products.filter((product) => {
      const matchesSearch =
        normalizedQuery === '' ||
        product.name.toLocaleLowerCase().includes(normalizedQuery) ||
        product.category.toLocaleLowerCase().includes(normalizedQuery);
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesStock = filters.stock === 'all' || getStockStatus(product.quantity) === filters.stock;
      return matchesSearch && matchesCategory && matchesStock;
    });

    return sortProducts(matchingProducts, filters.sort);
  }, [products, filters]);

  const updateFilters = (changes: Partial<ProductFilterState>) => {
    setFilters((previousFilters) => ({ ...previousFilters, ...changes }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const hasActiveFilters =
    filters.searchQuery.trim() !== '' || filters.category !== 'all' || filters.stock !== 'all' || filters.sort !== 'newest';

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    filteredProducts,
    filteredCount: filteredProducts.length,
  };
};
