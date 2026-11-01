'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, User } from 'lucide-react';

import { useAppContext } from '@/context/AppContextProvider';
import { AppContainer } from './Container';
import { CartDrawer } from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import { Button } from './ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const isActivePath = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

const DesktopNavLink = ({ item, isActive }: NavLinkProps) => (
  <Link
    href={item.href}
    aria-current={isActive ? 'page' : undefined}
    className={`relative px-3 py-5 text-sm font-medium transition-colors ${
      isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-950'
    }`}
  >
    {item.label}
    <span
      aria-hidden="true"
      className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-indigo-600 transition-opacity ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    />
  </Link>
);

const MobileNavLink = ({ item, isActive }: NavLinkProps) => (
  <SheetClose asChild>
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {item.label}
    </Link>
  </SheetClose>
);

export const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAppContext();

  const userInitial = user?.name?.trim().charAt(0).toUpperCase();

  return (
    <header className="sticky left-0 top-0 z-50 border-b bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/75">
      <AppContainer className="flex h-15 items-center justify-between gap-3 md:gap-8">
        {/* left: mobile menu + brand */}
        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(85vw,20rem)]">
              <SheetHeader>
                <SheetTitle>
                  <span className="font-semibold text-indigo-600">e</span>St4re
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <MobileNavLink key={item.href} item={item} isActive={isActivePath(pathname, item.href)} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-xl">
            <span className="font-semibold text-indigo-600">e</span>St4re
          </Link>
        </div>

        {/* center: desktop navigation */}
        <nav className="hidden items-center lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <DesktopNavLink key={item.href} item={item} isActive={isActivePath(pathname, item.href)} />
          ))}
        </nav>

        {/* right: actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          <CartDrawer />
          <WishlistDrawer />

          <div className="ml-1 flex items-center gap-1 border-l pl-2 sm:pl-3">
            <Link
              href="/profile"
              aria-label="Open your profile"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:pr-3"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                {userInitial ?? <User size={14} />}
              </span>
              <span className="hidden max-w-28 truncate sm:inline">{user?.name || 'Profile'}</span>
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
