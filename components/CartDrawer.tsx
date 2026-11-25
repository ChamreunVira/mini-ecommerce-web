'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { useAppContext } from '@/context/AppContextProvider';
import { Button } from './ui/button';
import { CartItem } from '@/types';
import { getProductImageUrl } from '@/lib/product';

export const CartDrawer = () => {
  const router = useRouter();
  const { cart, removeCartItem, adjustCartItem } = useAppContext();

  const totalItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };
  const subtotal = cart?.items ? calculateTotal(cart.items) : 0;

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label={`Open shopping cart with ${totalItemCount} items`}
          className="relative flex size-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-red-50 hover:text-[#C8102E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] cursor-pointer"
        >
          <ShoppingCart className="size-5" />
          {totalItemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#C8102E] text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
              {totalItemCount > 99 ? '99+' : totalItemCount}
            </span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-[#C8102E]">
              <ShoppingCart className="size-4" />
            </span>
            Shopping Cart ({totalItemCount})
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cart && cart.items.length > 0 ? (
            <div className="flex flex-col divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 bg-white py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden bg-slate-50 p-2 flex items-center justify-center">
                    <Image
                      width={64}
                      height={64}
                      src={getProductImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="size-full object-contain"
                      unoptimized
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h4 className="truncate text-sm font-semibold text-slate-900">{item.product.name}</h4>
                    <p className="mt-0.5 text-xs font-bold text-[#C8102E]">
                      ${Number(item.product.price).toFixed(2)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 bg-slate-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => adjustCartItem(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="flex size-6 items-center justify-center text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                          aria-label={`Decrease ${item.product.name} quantity`}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-6 text-center text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustCartItem(item.id, 1)}
                          className="flex size-6 items-center justify-center text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                          aria-label={`Increase ${item.product.name} quantity`}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <span className="text-xs text-slate-500">
                        = ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCartItem(item.id)}
                    className="flex size-8 items-center justify-center text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-xl bg-red-50 text-[#C8102E]">
                <ShoppingBag className="size-7" />
              </div>
              <p className="text-base font-semibold text-slate-800">Your cart is empty</p>
              <p className="max-w-xs text-xs text-slate-500">
                Looks like you haven&apos;t added any items yet. Explore the catalog to find great picks!
              </p>
            </div>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-6 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="text-[#C8102E]">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <DrawerFooter className="p-0 pt-3 flex-col gap-2">
              <Button
                disabled={!cart?.items.length}
                onClick={() => router.push('/checkout')}
                className="w-full rounded-lg py-2.5 font-semibold shadow-md gap-2"
              >
                Proceed to Checkout <ArrowRight className="size-4" />
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" className="w-full rounded-lg text-xs text-slate-500">
                  Continue Shopping
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};