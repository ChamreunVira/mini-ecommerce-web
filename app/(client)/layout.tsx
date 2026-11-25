import AppFooter from '@/components/AppFooter';
import { BannerHeading } from '@/components/BannerHeading';
import { Navbar } from '@/components/Navbar';
import React, { Suspense } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <BannerHeading />
      <Suspense fallback={<div className="h-24 border-b border-[#EAECEF] bg-white" aria-hidden="true" />}>
        <Navbar />
      </Suspense>
      <div className="flex-1 flex flex-col">{children}</div>
      <AppFooter />
    </div>
  );
}
