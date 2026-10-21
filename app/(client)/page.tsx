'use client';
import HeroBanner from '@/components/HeroBanner';
import { HomeCategory } from '@/components/HomeCategory';
import HomeProduct from '@/components/HomeProduct';
import { NewsLetterSection } from '@/components/NewsLetterSection';
import { PromotionBanner } from '@/components/PromotionBanner';
import React from 'react';

const IndexPage: React.FC = () => {
  return (
    <main className="min-h-full">
      <HeroBanner />
      <HomeCategory />
      <HomeProduct />
      <PromotionBanner />
      <NewsLetterSection />
    </main>
  );
};

export default IndexPage;
