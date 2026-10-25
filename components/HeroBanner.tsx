'use client';
import React from 'react';
import { AppContainer } from './Container';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import BANNER_IMG from '@/public/assets/banner_img_01.png';
import Image from 'next/image';

const HeroBanner: React.FC = () => {
  const router = useRouter();
  return (
    <AppContainer className="h-1/3">
      <div className="w-full mt-12 grid grid-cols-2 rounded-md bg-indigo-50 px-8 py-6">
        {/* right message */}
        <div className="flex flex-col space-y-4 justify-center text-start">
          <h2 className="font-medium text-2xl">Shop Smarter with vSt4re — Up to 50% Off</h2>
          <p className="text-[16px] text-gray-800 line-clamp-2">
            Discover everyday essentials, trending products, and your favorite picks at prices you'll love. Shop quality
            products, enjoy exclusive deals, and find something special for less.
          </p>
          <Button onClick={() => router.push('/products')} className="w-30 h-10 px-6">
            Shop Now <ArrowRight size={16} />
          </Button>
        </div>
        {/* show case image */}
        <div className="flex items-center justify-center">
          <Image src={BANNER_IMG} alt="computer-hero-banner-image" className="w-60 h-60 object-cover" />
        </div>
      </div>
      {/* dots slice */}
      <div className="mt-4 mb-12 flex justify-center gap-1.5 *:cursor-pointer">
        {Array.from([1, 2, 3]).map((item) => {
          const activeIndex = 1;
          const isActive = item === activeIndex;
          return <div key={item} className={`rounded-full w-3 h-3 bg-gray-400 ${isActive && 'bg-indigo-600'}`}></div>;
        })}
      </div>
    </AppContainer>
  );
};

export default HeroBanner;
