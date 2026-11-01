import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { AppContainer } from './Container';
import { Button } from './ui/button';

export const PromotionBanner = () => (
  <AppContainer>
    <section className="relative my-12 overflow-hidden rounded-2xl bg-indigo-50 px-6 py-10 sm:my-16 sm:px-10 lg:px-14 lg:py-12">
      <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-indigo-100/80" aria-hidden="true" />

      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl space-y-3">
          <h2 className="text-2xl font-medium tracking-tight text-slate-950 sm:text-3xl">
            See the details before you decide.
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">Prices, descriptions, and live stock in one place.</p>
        </div>

        <Button asChild className="h-11 px-5">
          <Link href="/products">
            Explore the catalog <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </section>
  </AppContainer>
);
