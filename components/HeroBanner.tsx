'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import BANNER_IMG from '@/public/assets/banner_img_01.png';
import { AppContainer } from './Container';
import { productService } from '@/services/product-service';
import { Product } from '@/types';
import { getProductImageUrl } from '@/lib/product';

const HeroBanner: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchHeroProducts = async () => {
      try {
        const response = await productService.getBestSelling(3);
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          if (isMounted) {
            setFeaturedProducts(response.data);
            setActiveIndex(0);
          }
          return;
        }

        const fallback = await productService.getAll({ limit: 3 });
        if (fallback.success && Array.isArray(fallback.data) && fallback.data.length > 0 && isMounted) {
          setFeaturedProducts(fallback.data);
          setActiveIndex(0);
        }
      } catch {
        // Fall back to static banner image
      }
    };

    void fetchHeroProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = featuredProducts.length > 0 ? featuredProducts.length : 1;
  const currentProduct = featuredProducts[activeIndex] ?? null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <AppContainer>
      <section className="relative mt-4 overflow-hidden rounded-md border border-slate-200/80 bg-slate-100 p-6 sm:p-10 lg:p-12">
        {/* Crimson accent shape */}
        <div
          className="pointer-events-none absolute -right-24 -top-28 size-[420px] sm:size-[500px] lg:size-[560px] rounded-full bg-[#C8102E] z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 grid items-center gap-8 md:grid-cols-2 lg:gap-14">
          {/* Left Column */}
          <div className="flex flex-col items-start gap-4 sm:gap-5">
            <p className="text-xs sm:text-sm font-semibold text-[#C8102E] tracking-wide">Discover. Shop. Upgrade.</p>

            <div className="space-y-0.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-none">
                Latest Tech
              </h1>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#C8102E] leading-tight">
                Gadgets
              </span>
            </div>

            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-slate-600">
              {currentProduct
                ? `${currentProduct.name} — $${Number(currentProduct.price).toFixed(2)}`
                : 'Explore cutting-edge gadgets that upgrade your lifestyle.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={currentProduct ? `/products/${currentProduct.id}` : '/products'}
                className="group inline-flex items-center gap-2 rounded-sm bg-[#C8102E] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#a50d26]"
              >
                Shop Now
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-sm border border-slate-900 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Browse Collection
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                🇰🇭 <span>CAM</span>
              </span>
              <span className="h-3 w-px bg-slate-300" aria-hidden="true" />
              <span className="flex items-center gap-1.5 font-medium">
                <Truck size={14} className="text-slate-500" />
                Fast Shipping
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center md:max-w-none">
            <div className="relative z-10 p-2 sm:p-4">
              {currentProduct && currentProduct.image_url ? (
                <Link
                  href={`/products/${currentProduct.id}`}
                  className="group block relative focus:outline-none"
                  aria-label={`View featured product: ${currentProduct.name}`}
                >
                  <img
                    src={getProductImageUrl(currentProduct.image_url)}
                    alt={currentProduct.name}
                    className="h-60 w-full object-contain sm:h-72 lg:h-80 transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              ) : (
                <Image
                  src={BANNER_IMG}
                  alt="Featured tech gadgets showcase"
                  priority
                  className="h-60 w-full object-contain sm:h-72 lg:h-80"
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
              )}
            </div>

            {/* New Arrivals badge */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex flex-col items-center justify-center rounded-sm bg-white px-3 py-2 border border-slate-200/80 text-center">
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">New</span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Arrivals</span>
              <span className="w-3 h-0.5 bg-[#C8102E] mt-1" />
            </div>

            {/* Prev / Next Arrow Buttons */}
            <div className="absolute bottom-1 right-2 sm:bottom-2 sm:right-4 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous featured product"
                className="flex size-8 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="px-1.5 text-xs font-semibold text-white tabular-nums">
                {activeIndex + 1}/{totalSlides}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next featured product"
                className="flex size-8 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-50 cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppContainer>
  );
};

export default HeroBanner;
