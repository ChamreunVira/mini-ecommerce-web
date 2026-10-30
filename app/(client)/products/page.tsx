'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { AppContainer } from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { categoryService } from '@/services/category-service';
import { productService } from '@/services/product-service';
import { Category, Product } from '@/types';
import { CategoryStatus } from '@/constant';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All products');
  const [sort, setSort] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([productService.getAll({}), categoryService.getAll()])
      .then(([productResponse, categoryResponse]) => {
        if (!active) return;
        if (productResponse.success) setProducts(productResponse.data);
        if (categoryResponse.success) {
          const activeCategories = categoryResponse.data.filter((category) => category.status === CategoryStatus.ACTIVE);
          setCategories(activeCategories);
          const requestedSlug = new URLSearchParams(window.location.search).get('category');
          const requestedCategory = activeCategories.find((category) => category.slug === requestedSlug);
          if (requestedCategory) setSelectedCategory(requestedCategory.name);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Unable to load the product catalog.', error);
        setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products
      .filter((product) => selectedCategory === 'All products' || product.category.toLowerCase() === selectedCategory.toLowerCase())
      .filter((product) => !normalizedSearch || `${product.name} ${product.category} ${product.description ?? ''}`.toLowerCase().includes(normalizedSearch))
      .sort((a, b) => {
        if (sort === 'price-low') return Number(a.price) - Number(b.price);
        if (sort === 'price-high') return Number(b.price) - Number(a.price);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, search, selectedCategory, sort]);

  return (
    <AppContainer>
      <main className="py-10 sm:py-14">
        <div className="flex flex-col gap-6 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">The collection</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Explore products</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Search the catalog, browse by category, and compare product details before you choose.</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search products</span>
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="h-11 pl-9" />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
            {['All products', ...categories.map((category) => category.name)].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedCategory(name)}
                aria-pressed={selectedCategory === name}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${selectedCategory === name ? 'border-indigo-600 bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700'}`}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal size={15} aria-hidden="true" />
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="h-10 rounded-md border bg-white px-3 text-sm text-slate-700">
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        <p className="mt-5 text-sm text-slate-500" aria-live="polite">
          {loading ? 'Loading products…' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
        </p>

        {loading ? (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[0.78] animate-pulse rounded-xl border bg-slate-50" />)}
          </div>
        ) : failed ? (
          <div className="mt-6 rounded-xl border border-dashed px-5 py-12 text-center">
            <h2 className="font-medium text-slate-900">Catalog unavailable</h2>
            <p className="mt-2 text-sm text-slate-500">We couldn’t load products just now. Please refresh and try again.</p>
          </div>
        ) : filteredProducts.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed px-5 py-12 text-center">
            <h2 className="font-medium text-slate-900">No products found</h2>
            <p className="mt-2 text-sm text-slate-500">Try a different search or category.</p>
            <button type="button" onClick={() => { setSearch(''); setSelectedCategory('All products'); }} className="mt-4 text-sm font-medium text-indigo-700 hover:underline">Clear filters</button>
          </div>
        )}
      </main>
    </AppContainer>
  );
}
