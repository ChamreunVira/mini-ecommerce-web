import AppFooter from '@/components/AppFooter';
import { BannerHeading } from '@/components/BannerHeading';
import { Navbar } from '@/components/Navbar';
import React, { Suspense } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BannerHeading />
      <Suspense fallback={<div className="h-15 border-b bg-white/90" aria-hidden="true" />}>
        <Navbar />
      </Suspense>
      {children}
      <AppFooter />
    </>
  );
}
