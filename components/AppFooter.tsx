import Link from 'next/link';
import React from 'react';
import { AppContainer } from './Container';

const AppFooter = () => {
  return (
    <footer className="mt-16 bg-gray-800 text-white">
      <AppContainer className="py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="text-lg font-medium">
              <span className="font-semibold text-indigo-400">v</span>St4re
            </Link>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Thoughtful technology and useful essentials for everyday life.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:flex sm:gap-8">
            <Link href="/products" className="text-gray-300 transition-colors hover:text-white">
              Products
            </Link>
            <Link href="/about" className="text-gray-300 transition-colors hover:text-white">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 transition-colors hover:text-white">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>2026 vSt4re. All rights reserved.</p>
          <p>Designed for better everyday living.</p>
        </div>
      </AppContainer>
    </footer>
  );
};

export default AppFooter;
