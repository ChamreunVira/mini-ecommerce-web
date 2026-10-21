import React from 'react';
import { AppContainer } from './Container';
import { Button } from './ui/button';
import Link from 'next/link';

export const PromotionBanner = () => {
  return (
    <AppContainer>
      <div className="w-full my-24 px-8 py-4 grid grid-cols-2 place-items-center h-60 rounded-md bg-gray-800">
        <div className="flex flex-col gap-4 *:text-white">
          <h5 className="text-[16px]">First Order Promotion</h5>
          <h2 className="text-3xl font-medium">Minimalist Design, Maximum Utility. Get 10% Off.</h2>
          <p className="text-sm">
            Use promo code <span className="bg-white/20 px-2 py-0.5 rounded">VST4RE10</span> at checkout to enjoy 10%
            off your initial order.
          </p>
        </div>
        <div className="w-full flex justify-end">
          <Button className="h-10 px-3" asChild>
            <Link href="/products">Claim Discount & Shop</Link>
          </Button>
        </div>
      </div>
    </AppContainer>
  );
};
