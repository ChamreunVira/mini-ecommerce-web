import AppFooter from '@/components/AppFooter';
import { BannerHeading } from '@/components/BannerHeading';
import { Navbar } from '@/components/Navbar';
import React from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BannerHeading />
      <Navbar />
      {children}
      <AppFooter />
    </>
  );
}
