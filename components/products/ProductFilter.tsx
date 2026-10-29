import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProductFilterState, SortOption, StockFilter } from '@/hooks/useProductFilter';

interface ProductFiltersProps {
  filters: ProductFilterState;
  categoryNames: string[];
  hasActiveFilters: boolean;
  onChange: (changes: Partial<ProductFilterState>) => void;
  onReset: () => void;
}

export const ProductFilters = ({
  filters,
  categoryNames,
  hasActiveFilters,
  onChange,
  onReset,
}: ProductFiltersProps) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={filters.searchQuery}
        onChange={(event) => onChange({ searchQuery: event.target.value })}
        placeholder="Search by name or category..."
        className="pl-8"
      />
    </div>

    <Select value={filters.category} onValueChange={(category) => onChange({ category })}>
      <SelectTrigger className="w-full lg:w-44">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        {categoryNames.map((categoryName) => (
          <SelectItem key={categoryName} value={categoryName}>
            {categoryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={filters.stock} onValueChange={(stock) => onChange({ stock: stock as StockFilter })}>
      <SelectTrigger className="w-full lg:w-40">
        <SelectValue placeholder="Stock" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All stock</SelectItem>
        <SelectItem value="in_stock">In stock</SelectItem>
        <SelectItem value="low_stock">Low stock</SelectItem>
        <SelectItem value="out_of_stock">Out of stock</SelectItem>
      </SelectContent>
    </Select>

    <Select value={filters.sort} onValueChange={(sort) => onChange({ sort: sort as SortOption })}>
      <SelectTrigger className="w-full lg:w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="oldest">Oldest first</SelectItem>
        <SelectItem value="name_asc">Name (A-Z)</SelectItem>
        <SelectItem value="price_asc">Price: low to high</SelectItem>
        <SelectItem value="price_desc">Price: high to low</SelectItem>
        <SelectItem value="quantity_asc">Quantity: low to high</SelectItem>
      </SelectContent>
    </Select>

    {hasActiveFilters && (
      <Button variant="ghost" onClick={onReset}>
        <X />
        Reset
      </Button>
    )}
  </div>
);
