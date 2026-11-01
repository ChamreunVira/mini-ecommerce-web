import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import BANNER_IMG from '@/public/assets/banner_img_01.png';
import { AppContainer } from './Container';
import { Button } from './ui/button';

const HeroBanner = () => (
  <AppContainer>
    <section className="relative mt-6 overflow-hidden rounded-2xl bg-indigo-50 px-6 py-12 sm:mt-8 sm:px-10 lg:px-14 lg:py-16">
      <div className="absolute -right-16 -top-24 size-64 rounded-full bg-indigo-100/80" aria-hidden="true" />

      <div className="relative grid items-center gap-8 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-start gap-6">
          <div className="space-y-3">
            <h1 className="max-w-xl text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Everyday finds, all in one place.
            </h1>
            <p className="max-w-md text-sm text-slate-600 sm:text-base">Useful picks for work and home.</p>
          </div>

          <Button asChild className="h-11 px-5">
            <Link href="/products">
              Explore products <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center md:max-w-none">
          <div className="absolute size-[80%] rounded-full bg-white/70" aria-hidden="true" />
          <Image
            src={BANNER_IMG}
            alt="Featured products from the store collection"
            priority
            className="relative h-56 w-full object-contain sm:h-64 lg:h-72"
            sizes="(max-width: 768px) 90vw, 40vw"
          />
        </div>
      </div>
    </section>
  </AppContainer>
);

export default HeroBanner;
