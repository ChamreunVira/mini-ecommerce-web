'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X } from 'lucide-react';

export const BannerHeading = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-[#C8102E] via-[#a50d26] to-[#8b0b20] py-2 px-4 text-white text-xs sm:text-sm font-medium shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="size-3 text-amber-200" />
          </span>
          <span>
            Special Launch Perks: Get free shipping on all orders over $50!{' '}
            <Link href="/products" className="underline font-bold hover:text-amber-100 ml-1">
              Shop now &rarr;
            </Link>
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
};
