import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { AppContainer } from '@/components/Container';
import { Button } from '@/components/ui/button';

const values = ['Thoughtful design', 'Reliable quality', 'Simple experiences'];

export default function AboutPage() {
  return (
    <main>
      <AppContainer className="py-16 md:py-24">
        <section className="grid items-center gap-12 md:grid-cols-[1fr_0.9fr] md:gap-16">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">About vSt4re</p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
              Useful technology, made beautifully simple.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
              vSt4re is a considered collection of everyday technology for people who care about how their tools work
              and how they fit into their lives.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/products">
                  Explore products <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-md bg-slate-50 px-6 py-8">
            <Image
              src="/assets/banner_img_01.png"
              alt="Laptop with an abstract blue display"
              width={720}
              height={720}
              className="h-auto w-full max-w-md object-contain"
              priority
            />
          </div>
        </section>

        <section className="mt-20 border-t pt-12 md:mt-28 md:pt-16">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">What guides us</p>
              <h2 className="mt-3 text-2xl font-semibold text-gray-950">Less noise. More useful things.</h2>
            </div>
            <div>
              <p className="text-base leading-7 text-gray-600">
                From the products we choose to the way we serve you, every detail is shaped around clarity, utility, and
                a little bit of delight. We believe good technology should feel natural from the first touch.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                {values.map((value) => (
                  <li key={value} className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <Check size={16} className="text-indigo-600" />
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </AppContainer>
    </main>
  );
}
