'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle2, CreditCard, PackageSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BANNER_IMG from '@/public/assets/banner_img_01.png';
import { AppContainer } from './Container';
import { Button } from './ui/button';

const HeroBanner = () => {
  const router = useRouter();

  return (
    <AppContainer>
      <section className="relative mt-6 overflow-hidden rounded-2xl bg-indigo-50 px-6 py-10 sm:mt-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-100/80" aria-hidden="true" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="flex flex-col items-start gap-5">
            <div className="space-y-3">
              <h1 className="max-w-xl text-2xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Everyday finds, all in one place.
              </h1>
              <p className="max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                Explore useful picks for work, home, and everything in between. Compare details, check availability, and
                find what fits your day.
              </p>
            </div>
            <Button onClick={() => router.push('/products')} className="h-11 px-5">
              Explore products <ArrowRight size={16} />
            </Button>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-600 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <PackageSearch size={15} className="text-indigo-600" /> Browse by category
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-indigo-600" /> See live stock status
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard size={15} className="text-indigo-600" /> KHQR checkout available
              </span>
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center md:max-w-none">
            <div className="absolute h-[80%] w-[80%] rounded-full bg-white/70" aria-hidden="true" />
            <Image
              src={BANNER_IMG}
              alt="A featured selection from the vStore collection"
              priority
              className="relative h-56 w-full object-contain sm:h-64 lg:h-72"
              sizes="(max-width: 768px) 90vw, 40vw"
            />
          </div>
        </div>
      </section>
    </AppContainer>
  );
};

export default HeroBanner;
