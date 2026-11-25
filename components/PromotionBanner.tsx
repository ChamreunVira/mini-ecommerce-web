'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { AppContainer } from './Container';
import { Button } from './ui/button';

export const PromotionBanner = () => {
  return (
    <AppContainer>
      <section className="relative my-14 sm:my-20 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-8 py-12 sm:px-12 sm:py-16 text-white shadow-xl shadow-orange-500/20">
        {/* Background decorative elements */}
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-amber-400/20 blur-xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-md ring-1 ring-white/30">
              <Tag className="size-3.5" />
              <span>Verified Store Guarantee</span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl text-white">
              Transparent specs. Live inventory. Instant KHQR.
            </h2>
            <p className="text-sm sm:text-base text-orange-50 leading-relaxed max-w-xl">
              Every gadget in our catalog includes accurate descriptions, real-time stock levels, and seamless mobile payments powered by Bakong KHQR.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-2xl bg-white text-orange-700 hover:bg-orange-50 hover:text-orange-800 shadow-lg px-6 font-semibold"
            >
              <Link href="/products" className="gap-2">
                Explore Catalog <ArrowRight size={17} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </AppContainer>
  );
};

export default PromotionBanner;
