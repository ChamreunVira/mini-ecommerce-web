'use client';
import React, { useRef } from 'react';
import { AppContainer } from './Container';
import { Home, Phone, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContextProvider';
import { CartDrawer } from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';

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
  const { user } = useAppContext();

  return (
    <header ref={navRef} className="sticky border-b z-50 top-0 left-0 overflow-x-hidden bg-white/90">
      <AppContainer className="h-15 flex items-center justify-between">
        {/* branding logo */}
        <div className="text-xl">
          <Link href="/">
            <span className="text-indigo-600 font-semibold">e</span>St4re
          </Link>
        </div>

        {/* center navigation */}
        <nav className="flex items-center space-x-6">
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

        {/* nav actions */}
        <div className="flex gap-4">
          <div className="flex items-center space-x-2.5">
            {/* shopping badge */}
            <CartDrawer />
            {/* witlist products */}
            <WishlistDrawer />
          </div>
          {/* user profile */}
          <div className="bg-gray-100 rounded px-1 py-0.5 flex items-center font-medium text-sm">
            <User size={28} className="cursor-pointer rounded-full p-1 hover:bg-gray-100" />
            {user?.name}
          </div>
        </div>
      </AppContainer>
    </header>
  );
};
