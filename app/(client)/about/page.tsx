import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap, Heart } from 'lucide-react';
import { AppContainer } from '@/components/Container';
import { Button } from '@/components/ui/button';

const VALUES = [
  {
    title: 'Considered Curation',
    description: 'We don’t stock everything—only dependable, verified hardware that improves your daily workflows.',
  },
  {
    title: 'Honest Transparency',
    description: 'Accurate stock levels, honest specs, and clear pricing with no hidden checkout fees.',
  },
  {
    title: 'Customer-First Support',
    description: 'Local assistance right here in Phnom Penh, with straightforward return policies and real human replies.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-[75vh] py-12 sm:py-20">
      <AppContainer>
        {/* Hero Section */}
        <section className="grid items-center gap-12 md:grid-cols-12 lg:gap-16">
          <div className="max-w-xl md:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
              <Sparkles className="size-3.5" />
              About vStore
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl/tight">
              Thoughtful technology, curated for everyday clarity.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-slate-600">
              vStore was created out of a desire for a cleaner, more reliable shopping experience. We offer a tight,
              considered collection of gear for creators, engineers, and everyday tech enthusiasts across Cambodia.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="rounded-2xl font-semibold shadow-md">
                <Link href="/products" className="gap-2">
                  Browse Catalog <ArrowRight size={16} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-2xl border-slate-300 hover:bg-red-50 hover:text-[#C8102E]">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-amber-50/40 to-white p-8 shadow-xl md:col-span-5">
            <div className="absolute size-64 rounded-full bg-gradient-to-tr from-red-500/20 to-amber-300/20 blur-2xl" />
            <Image
              src="/assets/banner_img_01.png"
              alt="vStore featured showcase"
              width={600}
              height={600}
              className="relative z-10 h-auto w-full max-w-sm object-contain drop-shadow-xl"
              priority
            />
          </div>
        </section>

        {/* Guiding Principles */}
        <section className="mt-20 border-t border-slate-200/80 pt-16 sm:mt-28">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
              Our Principles
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Less noise. More dependable essentials.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-500">
              Technology should seamlessly support you. Here is the promise we stand by every time you place an order.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map((val) => (
              <div
                key={val.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl hover:border-red-100"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-[#C8102E] shadow-xs">
                  <CheckCircle2 className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{val.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{val.description}</p>
              </div>
            ))}
          </div>
        </section>
      </AppContainer>
    </main>
  );
}
