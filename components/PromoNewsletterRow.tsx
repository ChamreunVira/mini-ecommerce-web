'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Mail, CheckCircle2 } from 'lucide-react';
import { AppContainer } from './Container';
import { toast } from 'sonner';

export const PromoNewsletterRow: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please provide a valid email address.');
      return;
    }

    setIsSubscribed(true);
    toast.success('Thank you for subscribing to vSt4re updates!');
  };

  return (
    <AppContainer className="pt-8 sm:pt-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
        {/* ── Left Card: Solid Crimson (#C8102E) ── */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-[#C8102E] p-7 sm:p-9 text-white shadow-xl shadow-[#C8102E]/20">
          {/* Subtle curved decorative background shapes */}
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full bg-white/10 blur-xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-black/10 blur-lg"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-start gap-4">
            {/* White circular gift icon */}
            <div className="flex shrink-0 size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white ring-1 ring-white/30 shadow-md">
              <Gift className="size-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white leading-tight">
                Exclusive Deals for You!
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-sm">
                Save more on top-rated gadgets handpicked just for you.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#C8102E] shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-slate-50 hover:shadow-xl"
            >
              Shop Deals <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ── Right Card: Soft Gray (#F3F4F6) Newsletter ── */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-[#F3F4F6] p-7 sm:p-9 shadow-sm border border-[#EAECEF]">
          {/* Decorative Envelope Background on Right */}
          <div
            className="pointer-events-none absolute -right-6 -bottom-6 opacity-10 text-[#C8102E]"
            aria-hidden="true"
          >
            <Mail className="size-48" strokeWidth={1} />
          </div>

          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-[#111827]">
              Get the Latest Tech & Deals
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Join our newsletter and never miss an update.
            </p>
          </div>

          <div className="relative z-10 mt-6">
            {isSubscribed ? (
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-3 text-emerald-700 ring-1 ring-emerald-600/20">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                <span className="text-sm font-semibold">
                  You’re subscribed! Thanks for joining the vSt4re circle.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-full border border-[#EAECEF] bg-white px-5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#C8102E] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppContainer>
  );
};
