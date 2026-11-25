'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { useAppContext } from '@/context/AppContextProvider';
import { Button } from './ui/button';
import { getProductImageUrl } from '@/lib/product';

const WishlistDrawer = () => {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label={`Open wishlist with ${wishlist.length} items`}
          className="relative flex size-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-red-50 hover:text-[#C8102E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] cursor-pointer"
        >
          <Heart className="size-5" />
          {wishlist.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
              {wishlist.length > 99 ? '99+' : wishlist.length}
            </span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Heart className="size-4" fill="currentColor" />
            </span>
            Saved Wishlist ({wishlist.length})
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {wishlist.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Heart className="size-7" />
              </div>
              <p className="text-base font-semibold text-slate-800">Your wishlist is empty</p>
              <p className="max-w-xs text-xs text-slate-500">
                Save items you like while browsing and review them anytime.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-50 p-2 flex items-center justify-center"
                  >
                    <Image
                      width={64}
                      height={64}
                      src={getProductImageUrl(item.product.image_url)}
                      alt={item.product.name}
                      className="size-full object-contain transition-transform duration-300 hover:scale-105"
                      unoptimized
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="truncate text-sm font-semibold text-slate-900 hover:text-[#C8102E] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-0.5 text-xs font-bold text-[#C8102E]">${Number(item.product.price).toFixed(2)}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="xs"
                        onClick={() => addToCart(item.product.id)}
                        className="rounded-lg gap-1.5 text-xs font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                      >
                        <ShoppingBag size={12} />
                        Add to cart
                      </Button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void toggleWishlist(item.product.id)}
                    className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:scale-110 active:scale-90 cursor-pointer"
                    aria-label={`Remove ${item.product.name} from wishlist`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistDrawer;
