'use client';
import React, { useRef } from 'react';
import { AppContainer } from './Container';
import { Home, LogOut, Menu, Phone, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContextProvider';
import { Button } from './ui/button';
import { CartDrawer } from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const navItems: Record<string, any>[] = [
  {
    id: 1,
    label: 'Home',
    href: '/',
    icon: <Home size={16} />,
  },
  {
    id: 2,
    label: 'Products',
    href: '/products',
    icon: <ShoppingBag size={16} />,
  },
  {
    id: 3,
    label: 'About',
    href: '/about',
    icon: <User size={16} />,
  },
  {
    id: 4,
    label: 'Contact',
    href: '/contact',
    icon: <Phone size={16} />,
  },
];

export const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { user, logout } = useAppContext();

  return (
    <header ref={navRef} className="sticky border-b z-50 top-0 left-0 overflow-x-hidden bg-white/90">
      <AppContainer className="flex h-15 items-center justify-between gap-8">
        {/* branding logo */}
        <div className="text-xl">
          <Link href="/">
            <span className="text-indigo-600 font-semibold">e</span>St4re
          </Link>
        </div>

        {/* center navigation */}
        <nav className="hidden items-center space-x-2 lg:flex">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                href={item.href}
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1 text-sm transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <p className="text-[12px] font-medium">{item.label}</p>
              </Link>
            );
          })}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(85vw,20rem)]">
            <SheetHeader>
              <SheetTitle>eSt4re</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-4">
              {navItems.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <SheetClose asChild key={item.id}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`inline-flex items-center gap-3 rounded-sm px-3 py-2 text-sm ${
                        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* nav actions */}
        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-4">
          <div className="flex items-center space-x-1 sm:space-x-2.5">
            {/* shopping badge */}
            <CartDrawer />
            {/* witlist products */}
            <WishlistDrawer />
          </div>
          {/* user profile */}
          <div className="flex items-center gap-1">
            <Link
              href="/profile"
              aria-label="Open your profile"
              className="flex max-w-24 items-center gap-1 rounded bg-gray-100 px-1 py-0.5 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 sm:max-w-none"
            >
              <User size={28} className="rounded-full p-1" />
              <span className="hidden truncate sm:inline">{user?.name || 'Profile'}</span>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => void logout()}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={17} />
            </Button>
          </div>
        </div>
      </AppContainer>
    </header>
  );
};
