import React from 'react';
import { AppContainer } from './Container';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const PromotionBanner = () => (
  <AppContainer>
    <section className="my-12 grid gap-6 overflow-hidden rounded-md bg-slate-900 px-6 py-8 text-white sm:my-16 sm:grid-cols-[1fr_auto] sm:items-center sm:px-10 sm:py-10">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Make a good choice</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">See the details before you decide.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Browse product descriptions, prices, and current stock, then choose a payment option at checkout.
        </p>
      </div>
      <Button className="h-11 w-fit bg-white px-5 text-slate-950 hover:bg-slate-100" asChild>
        <Link href="/products">
          Explore the catalog <ArrowRight size={16} />
        </Link>
      </Button>
    </section>
  </AppContainer>
);
