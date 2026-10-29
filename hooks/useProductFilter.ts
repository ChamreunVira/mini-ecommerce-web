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

const PAGE_SIZE = 10;

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

// export const useProductFilters = (products: Product[]) => {
//   const [filters, setFilters] = useState<ProductFilterState>(DEFAULT_FILTERS);
//   const [requestedPage, setRequestedPage] = useState(1);

//   const filteredProducts = useMemo(() => {
//     const normalizedQuery = filters.searchQuery.trim().toLowerCase();

//     const matchingProducts = products.filter((product) => {
//       const matchesSearch =
//         normalizedQuery === '' ||
//         product.name.toLowerCase().includes(normalizedQuery) ||
//         product.category.toLowerCase().includes(normalizedQuery);
//       const matchesCategory = filters.category === 'all' || product.category === filters.category;
//       const matchesStock = filters.stock === 'all' || getStockStatus(product.quantity) === filters.stock;

//       return matchesSearch && matchesCategory && matchesStock;
//     });

//     return sortProducts(matchingProducts, filters.sort);
//   }, [products, filters]);

//   const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
//   const currentPage = Math.min(requestedPage, totalPages);
//   const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

//   const updateFilters = (changes: Partial<ProductFilterState>) => {
//     setFilters((previousFilters) => ({ ...previousFilters, ...changes }));
//     setRequestedPage(1);
//   };

//   const resetFilters = () => {
//     setFilters(DEFAULT_FILTERS);
//     setRequestedPage(1);
//   };

//   const hasActiveFilters =
//     filters.searchQuery !== '' || filters.category !== 'all' || filters.stock !== 'all' || filters.sort !== 'newest';

//   return {
//     filters,
//     updateFilters,
//     resetFilters,
//     hasActiveFilters,
//     paginatedProducts,
//     filteredCount: filteredProducts.length,
//     currentPage,
//     totalPages,
//     setCurrentPage: setRequestedPage,
//   };
// };
