'use client';
import { Product } from '@/types';
import { Heart, ShoppingBag } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContextProvider';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useAppContext();
  const isAvailable = product.quantity > 0;
  const isWishlisted = wishlist.some((item) => item.product_id === product.id);

  const imageUrl = process.env.NEXT_PUBLIC_STORAGE_URL + product.image_url;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border bg-white transition-shadow hover:shadow-sm">
      <button
        type="button"
        onClick={() => router.push(`/products/${product.id}`)}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"
        aria-label={`View ${product.name}`}
      >
        <img
          className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          src={imageUrl}
          alt={product.name}
        />
        <span
          className={`absolute left-3 top-3 rounded-sm px-2 py-1 text-[11px] font-medium ${
            isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isAvailable ? 'In stock' : 'Out of stock'}
        </span>
      </button>
      <button
        type="button"
        onClick={() => void toggleWishlist(product.id)}
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm hover:bg-white"
      >
        <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">{product.category}</p>
        <h2 className="mt-2 truncate text-base font-medium text-gray-900">{product.name}</h2>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-lg font-semibold text-gray-950">${Number(product.price).toFixed(2)}</p>
          <Button size="sm" disabled={!isAvailable} onClick={() => addToCart(product.id)}>
            <ShoppingBag size={16} />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
