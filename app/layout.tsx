import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppContextProvider } from '@/context/AppContextProvider';
import { ToastContainer } from 'react-toastify';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'vSt4re — Discover. Shop. Upgrade.',
  description: 'Your premier destination for the latest tech gadgets, smart devices, and lifestyle accessories.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', plusJakarta.variable, geistMono.variable)}>
      <body className={cn('min-h-full flex flex-col bg-white font-sans text-[#111827]', plusJakarta.className)}>
        <AppContextProvider>{children}</AppContextProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
