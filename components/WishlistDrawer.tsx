import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Heart, ShoppingBag, Trash } from 'lucide-react';
import { useAppContext } from '@/context/AppContextProvider';
import { Button } from './ui/button';
import { getProductImageUrl } from '@/lib/product';

const WishlistDrawer = () => {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <div className="relative">
          <Heart size={28} className="cursor-pointer rounded-full p-1 hover:bg-gray-100" />
          <div className="absolute top-0 right-0 flex h-3 min-w-3 items-center justify-center rounded-full bg-rose-500 px-0.5">
            <p className="text-xs text-white">{wishlist.length}</p>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Wishlist</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {wishlist.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
              <Heart />
              <p>Your wishlist is empty.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded border p-3">
                <Link href={`/products/${item.product.id}`} className="shrink-0">
                  <Image
                    width={56}
                    height={56}
                    src={getProductImageUrl(item.product.image_url)}
                    alt={item.product.name}
                    unoptimized
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="block truncate font-medium hover:text-indigo-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-rose-500">${Number(item.product.price).toFixed(2)}</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => void addToCart(item.product.id)}>
                    <ShoppingBag size={14} />
                    Add to cart
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-rose-500"
                  onClick={() => void toggleWishlist(item.product.id)}
                  aria-label={`Remove ${item.product.name} from wishlist`}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistDrawer;
