'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Layers,
  X,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Gamepad2,
  Tv,
  Camera,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { AppContainer } from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { TrustStrip } from '@/components/TrustStrip';
import { categoryService } from '@/services/category-service';
import { productService } from '@/services/product-service';
import { Category, Product } from '@/types';
import { CategoryStatus } from '@/constant';

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('phone') || lower.includes('mobile')) return Smartphone;
  if (
    lower.includes('laptop') ||
    lower.includes('computer') ||
    lower.includes('pc') ||
    lower.includes('gadget') ||
    lower.includes('tech')
  ) {
    return Laptop;
  }
  if (lower.includes('audio') || lower.includes('sound') || lower.includes('headphone')) return Headphones;
  if (lower.includes('watch') || lower.includes('wearable')) return Watch;
  if (lower.includes('game') || lower.includes('gaming')) return Gamepad2;
  if (lower.includes('tv') || lower.includes('display') || lower.includes('home')) return Tv;
  if (lower.includes('camera') || lower.includes('photo')) return Camera;
  if (lower.includes('sale') || lower.includes('deal') || lower.includes('discount')) return Tag;
  return Layers;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sort, setSort] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        productService.getAll({}),
        categoryService.getAll(),
      ]);

      setProducts(productResponse.success && Array.isArray(productResponse.data) ? productResponse.data : []);

      let activeCategories: Category[] = [];
      if (categoryResponse.success && Array.isArray(categoryResponse.data)) {
        activeCategories = categoryResponse.data.filter((category) => category.status === CategoryStatus.ACTIVE);
        setCategories(activeCategories);
      } else {
        setCategories([]);
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const requestedSlug = params.get('category');
        const searchParam = params.get('search');

        if (requestedSlug) {
          const matched = activeCategories.find(
            (c) =>
              c.slug.toLowerCase() === requestedSlug.toLowerCase() ||
              c.name.toLowerCase() === requestedSlug.toLowerCase(),
          );
          setSelectedCategory(matched ? matched.name : requestedSlug);
        }
        if (searchParam) {
          setSearch(searchParam);
        }
      }
    } catch (error) {
      console.error('Unable to load catalog data', error);
      setProducts([]);
      setCategories([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products
      .filter((product) => {
        if (selectedCategory === 'All') return true;
        const prodCat = (product.category ?? '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        return prodCat === selCat || prodCat.includes(selCat) || selCat.includes(prodCat);
      })
      .filter((product) => {
        if (!onlyInStock) return true;
        return product.quantity > 0;
      })
      .filter((product) => {
        if (!normalizedSearch) return true;
        return `${product.name} ${product.category ?? ''} ${product.description ?? ''}`
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (sort === 'price-low') return Number(a.price) - Number(b.price);
        if (sort === 'price-high') return Number(b.price) - Number(a.price);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, search, selectedCategory, sort, onlyInStock]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setOnlyInStock(false);
  };

  return (
    <div className="min-h-full pb-16 space-y-8">
      <AppContainer className="pt-6 sm:pt-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <Link href="/" className="hover:text-[#C8102E] transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-medium text-slate-900">Products</span>
          {selectedCategory !== 'All' && (
            <>
              <ChevronRight className="size-3.5 text-slate-400" />
              <span className="font-medium text-[#C8102E]">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Page Header + Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">All Products</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Browse electronics, audio gear, wearables, and everyday accessories.
            </p>
          </div>

          <div className="relative w-full sm:w-72 md:w-80">
            <div className="relative flex items-center rounded-full bg-slate-100/80 border border-slate-200/80 overflow-hidden focus-within:border-[#C8102E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C8102E]/20 transition-colors">
              <Search className="absolute left-3.5 size-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent py-2 pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none border-0 ring-0"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-900 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            aria-pressed={selectedCategory === 'All'}
            className={`flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shadow-xs ${
              selectedCategory === 'All'
                ? 'bg-[#C8102E] text-white shadow-[#C8102E]/20'
                : 'border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <Layers className="size-3.5" />
            <span>All Products</span>
          </button>

          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const isActive = selectedCategory.toLowerCase() === category.name.toLowerCase();
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                aria-pressed={isActive}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#C8102E] text-white shadow-[#C8102E]/20'
                    : 'border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md bg-slate-50/80 border border-slate-200/80 p-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">Filters:</span>

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800">
                <span>{selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="text-slate-400 hover:text-[#C8102E] cursor-pointer"
                  aria-label="Remove category filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800">
                <span>&quot;{search}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-slate-400 hover:text-[#C8102E] cursor-pointer"
                  aria-label="Remove search filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800">
                <span>In Stock</span>
                <button
                  type="button"
                  onClick={() => setOnlyInStock(false)}
                  className="text-slate-400 hover:text-[#C8102E] cursor-pointer"
                  aria-label="Remove in stock filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {selectedCategory === 'All' && !search && !onlyInStock && (
              <span className="text-xs text-slate-400">None</span>
            )}

            {(selectedCategory !== 'All' || search || onlyInStock) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-[#C8102E] hover:underline ml-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 tabular-nums">
            <span className="text-xs text-slate-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>

            <button
              type="button"
              onClick={() => setOnlyInStock((prev) => !prev)}
              aria-pressed={onlyInStock}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer ${
                onlyInStock
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              In Stock Only
            </button>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-slate-500" aria-hidden="true" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <section aria-label="Catalog Products" className="mt-7 w-full">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 w-full">
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-md border border-slate-200/80 bg-white p-3.5 space-y-3"
                >
                  <Skeleton className="aspect-square w-full rounded-sm" />
                  <Skeleton className="h-4 w-3/4 rounded-sm" />
                  <div className="mt-auto flex justify-between pt-2">
                    <Skeleton className="h-5 w-16 rounded-sm" />
                    <Skeleton className="size-6 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasError ? (
            <div className="mt-8">
              <EmptyState
                title="Catalog temporarily unavailable"
                description="We could not load the product list. Please check your network and try again."
                onRetry={loadData}
              />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 w-full">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="No matching products found"
                description={
                  search
                    ? `No items matched "${search}". Try another keyword or clear your active filters.`
                    : 'There are no products in this category right now.'
                }
                actionLabel="Clear Filters"
                onAction={handleClearFilters}
              />
            </div>
          )}
        </section>
      </AppContainer>

      {/* <TrustStrip /> */}
    </div>
  );
}
