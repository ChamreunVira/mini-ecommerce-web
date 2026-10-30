'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { productService } from '@/services/product-service';
import { AppContainer } from './Container';
import SectionHeading from './SectionHeading';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

const HomeProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const handleFetchProduct = async () => {
      try {
        const response = await productService.getAll({});
        if (active && response.success) {
          const newest = [...response.data]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 8);
          setProducts(newest);
        }
      } catch (error: unknown) {
        if (active) {
          setFailed(true);
          console.error('Unable to load new arrivals.', error);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void handleFetchProduct();
    return () => { active = false; };
  }, []);

  return (
    <AppContainer>
      <section className="my-14 sm:my-16">
        <SectionHeading title="New arrivals" description="The latest additions to the vStore collection.">
          <Button variant="ghost" className="group text-xs" asChild>
            <Link href="/products">
              Browse all <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </SectionHeading>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-label="Loading products">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border">
                <div className="aspect-square animate-pulse bg-slate-100" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : failed ? (
          <p className="mt-6 rounded-xl border border-dashed px-5 py-8 text-center text-sm text-slate-500">
            Products are temporarily unavailable. Please try again in a little while.
          </p>
        ) : products.length ? (
          <Carousel className="mt-6 px-1">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 hidden sm:flex" />
            <CarouselNext className="-right-3 hidden sm:flex" />
          </Carousel>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed px-5 py-8 text-center text-sm text-slate-500">
            New products are on the way. Browse categories to explore the store.
          </p>
        )}
      </section>
    </AppContainer>
  );
};

export default HomeProduct;
