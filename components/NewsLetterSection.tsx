import React from 'react';
import { AppContainer } from './Container';
import { CreditCard, PackageCheck, SearchCheck } from 'lucide-react';

const highlights = [
  {
    icon: SearchCheck,
    title: 'Helpful product details',
    description: 'Review descriptions and prices on each product before adding it to your cart.',
  },
  {
    icon: PackageCheck,
    title: 'Visible availability',
    description: 'Check the current stock status as you browse the catalog.',
  },
  {
    icon: CreditCard,
    title: 'KHQR at checkout',
    description: 'Choose KHQR or cash on delivery when you place an order.',
  },
];

export const NewsLetterSection = () => (
  <AppContainer>
    <section className="my-14 border-y py-10 sm:my-16 sm:py-12" aria-labelledby="shopping-info-title">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Shopping at vStore</p>
        <h2 id="shopping-info-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Know what to expect at every step.</h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl bg-slate-50 p-5 sm:p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  </AppContainer>
);
