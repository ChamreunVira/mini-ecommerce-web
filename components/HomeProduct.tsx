'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { productService } from '@/services/product-service';
import { AppContainer } from './Container';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

const HomeProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const handleFetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error: unknown) {
        console.log('Error: failed to fetch product.', error);
      } finally {
        setLoading(false);
      }
    };
    void handleFetchProduct();
    return () => controller.abort();
  }, []);

  if (loading) return <div>Loading....</div>;

  return (
    <AppContainer>
      <div>
        <h1 className="font-medium text-xl">🔥 Best Selling</h1>
      </div>
      <Carousel className="mt-8">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* <div className="mt-8 grid grid-cols-4 gap-x-8 gap-y-4">
        {products.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div> */}
    </AppContainer>
  );
};

export default HomeProduct;
