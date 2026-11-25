'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Minus, Plus, ShoppingBag, Zap, Check } from 'lucide-react';
import { useAppContext } from '@/context/AppContextProvider';
import type { Product } from '@/types';
import { Button } from './ui/button';

type ProductPurchaseActionsProps = {
  product: Product;
};

export default function ProductPurchaseActions({ product }: ProductPurchaseActionsProps) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const isAvailable = product.quantity > 0;
  const isWishlisted = wishlist.some((item) => item.product_id === product.id);

  const changeQuantity = (delta: number) => {
    setQuantity((current) => Math.min(product.quantity, Math.max(1, current + delta)));
  };

  const handleAddToCart = async (goToCheckout = false) => {
    setIsAdding(true);
    const added = await addToCart(product.id, quantity);
    setIsAdding(false);

    if (added && goToCheckout) {
      router.push('/checkout');
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</span>
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1 shadow-xs">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => changeQuantity(-1)}
            disabled={!isAvailable || quantity <= 1}
            aria-label="Decrease quantity"
            className="rounded-lg hover:bg-white text-slate-700"
          >
            <Minus size={14} />
          </Button>
          <span
            className="min-w-10 text-center text-sm font-bold text-slate-900"
            aria-live="polite"
          >
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => changeQuantity(1)}
            disabled={!isAvailable || quantity >= product.quantity}
            aria-label="Increase quantity"
            className="rounded-lg hover:bg-white text-slate-700"
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          disabled={!isAvailable || isAdding}
          onClick={() => void handleAddToCart(false)}
          className="rounded-xl font-semibold shadow-md hover:shadow-lg gap-2 cursor-pointer"
        >
          <ShoppingBag size={18} />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={!isAvailable || isAdding}
          onClick={() => void handleAddToCart(true)}
          className="rounded-xl font-semibold border-slate-300 hover:border-[#C8102E] hover:text-[#C8102E] hover:bg-red-50/50 shadow-xs gap-2 cursor-pointer"
        >
          <Zap size={18} />
          Buy Now
        </Button>
      </div>

      {/* Wishlist Button */}
      <Button
        type="button"
        variant="ghost"
        className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
          isWishlisted
            ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
            : 'text-slate-600 hover:bg-red-50 hover:text-[#C8102E]'
        }`}
        onClick={() => void toggleWishlist(product.id)}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} className="mr-2" />
        {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
      </Button>
    </div>
  );
}
