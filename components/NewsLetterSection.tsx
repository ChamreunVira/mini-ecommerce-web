'use client';

import React, { useState } from 'react';
import { AppContainer } from './Container';
import { Button } from './ui/button';
import {
  CreditCard,
  PackageCheck,
  SearchCheck,
  Send,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

const TRUST_FEATURES = [
  {
    icon: SearchCheck,
    title: 'Verified Specs & Images',
    description: 'Inspect exact technical specifications and transparent pricing before purchasing.',
  },
  {
    icon: PackageCheck,
    title: 'Real-Time Stock Availability',
    description: 'Up-to-the-minute inventory tracking so you never order out-of-stock items.',
  },
  {
    icon: CreditCard,
    title: 'Instant KHQR & COD Checkout',
    description: 'Scan and pay in seconds with Bakong KHQR or choose Cash on Delivery at your door.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Customer Support',
    description: 'Our Phnom Penh-based support team is here Monday through Friday to assist you.',
  },
];

export const NewsLetterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to vStore updates!');
  };

  return (
    <AppContainer className="my-16 sm:my-24 space-y-16">
      {/* 1. Trust & Features Strip */}
      <section aria-labelledby="shopping-benefits-title">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Why Shop with vStore
          </span>
          <h2
            id="shopping-benefits-title"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Built for clarity, speed, and trust.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            We focus on what matters: verified hardware, frictionless checkout, and reliable service.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-orange-100"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-500/20 shadow-xs">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Newsletter Signup Block */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-orange-600/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/20">
            Stay in the Loop
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-white">
            Subscribe for early arrivals & exclusive drops.
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            No spam, ever. Only product updates, new device announcements, and special store offers.
          </p>

          {subscribed ? (
            <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="size-5" />
              <span className="text-sm font-semibold">You’re subscribed! Welcome to the vStore community.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <Button
                type="submit"
                className="rounded-2xl px-6 py-3 font-semibold shadow-md gap-2"
              >
                <span>Subscribe</span>
                <Send className="size-4" />
              </Button>
            </form>
          )}

          <p className="mt-4 text-[11px] text-slate-500">
            By subscribing, you agree to our privacy policy and can unsubscribe at any time.
          </p>
        </div>
      </section>
    </AppContainer>
  );
};

export default NewsLetterSection;
