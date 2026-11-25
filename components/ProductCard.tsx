'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useAppContext } from '@/context/AppContextProvider';
import { getProductImageUrl } from '@/lib/product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart, wishlist, toggleWishlist } = useAppContext();
  const [imgSrc, setImgSrc] = useState<string>(() => getProductImageUrl(product.image_url));
  const isAvailable = product.quantity > 0;
  const isWishlisted = wishlist.some((item) => item.product_id === product.id);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/80 bg-white transition-colors hover:border-slate-300 ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-3 sm:p-4">
        <Link
          href={`/products/${product.id}`}
          className="flex size-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
          aria-label={`View ${product.name}`}
        >
          <img
            className="size-full object-contain"
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            onError={() => setImgSrc(FALLBACK_IMG)}
          />
        </Link>

        {!isAvailable && (
          <span className="absolute left-2.5 top-2.5 rounded-sm bg-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            Sold out
          </span>
        )}

        {/* Top-Right Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          title={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-sm border border-slate-200/80 bg-white/90 text-slate-600 transition-colors hover:border-slate-300 hover:text-[#C8102E] cursor-pointer"
        >
          <Heart
            size={13}
            className={isWishlisted ? 'text-[#C8102E]' : undefined}
            fill={isWishlisted ? '#C8102E' : 'none'}
          />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <h3 className="truncate text-xs sm:text-sm font-medium text-slate-900 group-hover:text-[#C8102E] transition-colors">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-slate-100">
          <p className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
            ${Number(product.price).toFixed(2)}
          </p>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product.id);
            }}
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
            className="flex size-7 items-center justify-center rounded-sm bg-[#C8102E] text-white transition-colors hover:bg-[#a50d26] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
