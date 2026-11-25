'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { AppContainer } from './Container';

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Worldwide Shipping',
    description: 'Fast delivery to US, UK & UAE',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: '100% safe & secure checkout',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    description: 'Hassle-free returns guaranteed',
  },
  {
    icon: Headphones,
    title: 'Premium Support',
    description: '24/7 customer support',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <AppContainer className="pt-8 sm:pt-12">
      <section
        aria-label="Store Trust and Guarantees"
        className="bg-[#F6F7F9] rounded-[16px] p-6 border border-[#EAECEF]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === TRUST_ITEMS.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-row items-center gap-4 ${
                  !isLast ? 'lg:border-r lg:border-[#EAECEF] lg:pr-6' : ''
                }`}
              >
                {/* Red outline icon */}
                <div className="flex shrink-0 size-10 items-center justify-center rounded-full border border-[#C8102E] text-[#C8102E] p-2">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-sm font-semibold text-[#111827]">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppContainer>
  );
};
