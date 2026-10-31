'use client';

import { useAppContext } from '@/context/AppContextProvider';
import type { Product } from '@/types';
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

    if (added && goToCheckout) router.push('/checkout');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => changeQuantity(-1)}
          disabled={!isAvailable || quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </Button>
        <span
          className="flex h-10 w-12 items-center justify-center rounded border text-sm font-medium"
          aria-live="polite"
        >
          {quantity}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => changeQuantity(1)}
          disabled={!isAvailable || quantity >= product.quantity}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </Button>
        <span className="ml-2 text-sm text-gray-500">
          {isAvailable ? `${product.quantity} available` : 'Out of stock'}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          className="h-12"
          disabled={!isAvailable || isAdding}
          onClick={() => void handleAddToCart()}
        >
          <ShoppingBag />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12"
          disabled={!isAvailable || isAdding}
          onClick={() => void handleAddToCart(true)}
        >
          Buy Now
        </Button>
      </div>
      <Button type="button" variant="ghost" className="w-full" onClick={() => void toggleWishlist(product.id)}>
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      </Button>
    </div>
  );
}
