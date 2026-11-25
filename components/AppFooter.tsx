import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import KHQR from '@/public/assets/bakong.png';
import { AppContainer } from './Container';
import { CurrentYear } from './CurrentYear';
import { ShieldCheck, HeartHandshake, Star, CheckCircle2 } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products' },
      { label: 'Trending Gear', href: '/products' },
      { label: 'Categories', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About vSt4re', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Terms & Conditions', href: '/about' },
      { label: 'Privacy Policy', href: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Customer Care', href: '/contact' },
      { label: 'Order Tracking', href: '/profile' },
      { label: 'Shipping & Delivery', href: '/about' },
      { label: 'Returns & Refunds', href: '/about' },
    ],
  },
];

const TRUST_BADGES = [
  {
    icon: CheckCircle2,
    title: '100% Authentic',
    subtitle: 'Genuine products only',
  },
  {
    icon: HeartHandshake,
    title: 'Trusted by Thousands',
    subtitle: 'Loved by customers worldwide',
  },
  {
    icon: Star,
    title: 'Top Rated Store',
    subtitle: 'High-quality gadgets you can trust',
  },
  {
    icon: ShieldCheck,
    title: 'Price Match Guarantee',
    subtitle: 'Best prices, always',
  },
];

const PAYMENT_METHODS = [
  { id: 1, name: 'Bakong KHQR', badge: KHQR },
  // { id: 2, name: 'Cash on Delivery', badge: COD },
  // { name: 'Visa', badge: 'VISA' },
  // { name: 'Mastercard', badge: 'MC' },
];

const AppFooter: React.FC = () => {
  return (
    <footer className="mt-16 w-full border-t border-[#EAECEF] bg-white">
      {/* ── 1. Top Trust & Social Media Strip ── */}
      <div className="border-b border-[#EAECEF] bg-[#FAFAFA] py-6">
        <AppContainer className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {TRUST_BADGES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#C8102E]">
                    <Icon className="size-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-[#111827]">{item.title}</p>
                    <p className="text-[11px] text-[#6B7280]">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 lg:border-l lg:border-[#EAECEF] lg:pl-6">
            <span className="text-xs font-semibold text-[#111827]">Follow us</span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full bg-white text-[#6B7280] shadow-xs border border-[#EAECEF] transition-colors hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E]"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full bg-white text-[#6B7280] shadow-xs border border-[#EAECEF] transition-colors hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E]"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex size-8 items-center justify-center rounded-full bg-white text-[#6B7280] shadow-xs border border-[#EAECEF] transition-colors hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E]"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex size-8 items-center justify-center rounded-full bg-white text-[#6B7280] shadow-xs border border-[#EAECEF] transition-colors hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E]"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </AppContainer>
      </div>

      {/* ── 2. Main Footer Navigation ── */}
      <div className="bg-[#111827] text-white">
        <AppContainer className="py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-[1.5fr_2fr] lg:gap-16">
            {/* Brand Info */}
            <div className="max-w-sm">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/assets/estore.png"
                  alt="vSt4re Logo"
                  width={34}
                  height={34}
                  className="rounded-lg object-contain p-1"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-[#C8102E] leading-none">St4re</span>
                  <span className="text-[10px] tracking-wider uppercase font-medium text-slate-400 mt-1">
                    Discover. Shop. Upgrade.
                  </span>
                </div>
              </Link>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400">
                Thoughtful technology and useful essentials curated for modern everyday living. Simple, reliable, and
                authentic.eSt4re
              </p>

              <div className="mt-6 flex flex-col gap-1 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">Headquarters</p>
                <p>Phnom Penh, Kingdom of Cambodia</p>
                <p className="mt-1 text-[#C8102E]">virachamreun@gmail.com &bull; +855 97 3056 747</p>
              </div>
            </div>

            {/* Links navigation columns */}
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">{group.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-[#C8102E] hover:underline hover:underline-offset-4"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Payment & Trust Row */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-2">Accepted Payments:</span>
              {PAYMENT_METHODS.map((method) => (
                <div key={method.id} className="flex space-x-6">
                  <Image width={24} height={24} className="object-cover" src={method.badge} alt={method.name} />
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400">
              © <CurrentYear /> Chamreun Vira. All rights reserved.
            </p>
          </div>
        </AppContainer>
      </div>
    </footer>
  );
};

export default AppFooter;
