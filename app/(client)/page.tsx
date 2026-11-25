'use client';

import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import { HomeCategory } from '@/components/HomeCategory';
import { TrendingProducts } from '@/components/TrendingProducts';
import { TrustStrip } from '@/components/TrustStrip';
import { CuratedCollections } from '@/components/CuratedCollections';
import { PromoNewsletterRow } from '@/components/PromoNewsletterRow';

const IndexPage: React.FC = () => {
  return (
    <main className="min-h-full space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero with real featured product image fallback */}
      <HeroBanner />

      {/* 2. Quick category cards with circular orange arrow button */}
      <HomeCategory />

      {/* 3. Trending Products (6 items, mobile horizontal scroll) */}
      <TrendingProducts />

      {/* 4. Trust Strip (4 items: delivery, KHQR, warranty, support) */}
      <TrustStrip />

      {/* 5. Curated Collections ('Ideas for Your Next Upgrade' style) */}
      <CuratedCollections />

      {/* 6. Promo + Newsletter row (side-by-side cards) */}
      <PromoNewsletterRow />
    </main>
  );
};

export default IndexPage;
