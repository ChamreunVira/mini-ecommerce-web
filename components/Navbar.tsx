'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  LogOut,
  Menu,
  Search,
  User,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Gamepad2,
  Tv,
  Camera,
  ChevronDown,
  Tag,
  Tags,
} from 'lucide-react';

import { useAppContext } from '@/context/AppContextProvider';
import { AppContainer } from './Container';
import { CartDrawer } from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import { Button } from './ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { categoryService } from '@/services/category-service';
import { Category } from '@/types';
import { CategoryStatus } from '@/constant';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Today', href: '/products?tab=today' },
  { label: 'Following', href: '/products?tab=following' },
  { label: 'Shop', href: '/products' },
];

// const CURRENCY_OPTIONS = ['US', 'UK', 'UAE'];

const DEFAULT_NAV_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Gadgets',
    slug: 'gadgets',
    status: CategoryStatus.ACTIVE,
    description: 'Cutting edge electronics',
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    name: 'Smart Home',
    slug: 'smart-home',
    status: CategoryStatus.ACTIVE,
    description: 'Connected lifestyle',
    created_at: '',
    updated_at: '',
  },
  {
    id: 3,
    name: 'Audio',
    slug: 'audio',
    status: CategoryStatus.ACTIVE,
    description: 'Headphones and speakers',
    created_at: '',
    updated_at: '',
  },
  {
    id: 4,
    name: 'Wearables',
    slug: 'wearables',
    status: CategoryStatus.ACTIVE,
    description: 'Smartwatches and trackers',
    created_at: '',
    updated_at: '',
  },
  {
    id: 5,
    name: 'Accessories',
    slug: 'accessories',
    status: CategoryStatus.ACTIVE,
    description: 'Cables, cases and chargers',
    created_at: '',
    updated_at: '',
  },
  {
    id: 6,
    name: 'Sale',
    slug: 'sale',
    status: CategoryStatus.ACTIVE,
    description: 'Special promotions and deals',
    created_at: '',
    updated_at: '',
  },
];

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('phone') || lower.includes('mobile')) return Smartphone;
  if (lower.includes('laptop') || lower.includes('computer') || lower.includes('pc')) return Laptop;
  if (lower.includes('audio') || lower.includes('sound') || lower.includes('headphone')) return Headphones;
  if (lower.includes('watch') || lower.includes('wearable')) return Watch;
  if (lower.includes('game') || lower.includes('gaming')) return Gamepad2;
  if (lower.includes('tv') || lower.includes('display')) return Tv;
  if (lower.includes('camera') || lower.includes('photo')) return Camera;
  if (lower.includes('sale') || lower.includes('deal') || lower.includes('discount')) return Tag;
  if (lower.includes('gadget') || lower.includes('tech')) return Laptop;
  return Tags;
};

export const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout } = useAppContext();

  const [categories, setCategories] = useState<Category[]>(DEFAULT_NAV_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [currency, setCurrency] = useState('US');
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const activeCategoryParam = searchParams?.get('category');
  const userInitial = user?.name?.trim().charAt(0).toUpperCase();

  useEffect(() => {
    let isMounted = true;
    categoryService
      .getAll()
      .then((res) => {
        if (isMounted && res.success) {
          setCategories(res.data.filter((cat) => cat.status === CategoryStatus.ACTIVE));
        }
      })
      .catch(() => {
        // Silently keep empty list if categories endpoint fails
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const isActiveLink = (item: NavItem) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    const tabParam = searchParams?.get('tab');
    if (item.href.includes('tab=today')) {
      return pathname.startsWith('/products') && tabParam === 'today';
    }
    if (item.href.includes('tab=following')) {
      return pathname.startsWith('/products') && tabParam === 'following';
    }
    if (item.href === '/products') {
      return pathname.startsWith('/products') && !tabParam;
    }
    return pathname === item.href;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EAECEF]">
      {/* ── Top Row ── */}
      <AppContainer className="flex h-16 items-center justify-between gap-4 py-2">
        {/* Left: Hamburger (mobile) + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl text-gray-700 hover:text-[#C8102E]"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            {/* ── Mobile Drawer ── */}
            <SheetContent side="left" className="w-[min(85vw,22rem)] p-6 bg-white">
              <SheetHeader className="pb-4 border-b border-[#EAECEF]">
                <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                  <Image
                    src="/assets/estore.png"
                    alt="eStore logo"
                    width={32}
                    height={32}
                    className="rounded-xl object-contain"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="text-gray-900 font-bold tracking-tight">eStore</span>
                    <span className="text-[10px] font-normal text-gray-400 tracking-wide">
                      Discover. Shop. Upgrade.
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-5">
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, ideas and more"
                    className="w-full rounded-full border border-[#EAECEF] bg-[#F3F4F6] py-2.5 pl-4 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C8102E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-[#C8102E] transition-colors"
                    aria-label="Search"
                  >
                    <Search className="size-3.5" />
                  </button>
                </div>
              </form>

              {/* Mobile Nav Links */}
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => {
                  const active = isActiveLink(item);
                  return (
                    <SheetClose asChild key={`${item.label}-${item.href}`}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                          active ? 'bg-red-50 text-[#C8102E]' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {item.label}
                        {active && <span className="size-2 rounded-full bg-[#C8102E]" />}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

              {/* Mobile Categories */}
              {categories.length > 0 && (
                <div className="mt-6 border-t border-[#EAECEF] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">Categories</p>
                  <div className="flex flex-col gap-1">
                    {categories.slice(0, 6).map((cat) => {
                      const Icon = getCategoryIcon(cat.name);
                      return (
                        <SheetClose asChild key={cat.id}>
                          <Link
                            href={`/products?category=${encodeURIComponent(cat.slug)}`}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-[#C8102E] transition-colors"
                          >
                            <Icon className="size-4 shrink-0" />
                            {cat.name}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Desktop Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/assets/estore.png"
              alt="eStore logo"
              width={40}
              height={40}
              unoptimized
              className="object-contain bg-transparent"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tight text-[#C8102E] transition-colors">St4re</span>
              <span className="text-[10px] tracking-wide font-medium text-gray-400">Discover. Shop. Upgrade.</span>
            </div>
          </Link>
        </div>

        {/* Center: Pill Search Bar (desktop/tablet) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full flex items-center rounded-full bg-[#F3F4F6] border border-[#EAECEF] overflow-hidden focus-within:border-[#C8102E] focus-within:ring-2 focus-within:ring-[#C8102E]/20 transition-all">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, ideas and more"
              className="flex-1 bg-transparent py-2.5 pl-4 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none border-0 ring-0"
            />
            <button
              type="submit"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white m-1 hover:bg-[#C8102E] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
          </div>
        </form>

        {/* Right: Nav Links + Icon Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center mr-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active = isActiveLink(item);
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-semibold transition-colors ${
                    active ? 'text-[#C8102E]' : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  {item.label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#C8102E]" />}
                </Link>
              );
            })}
          </nav>

          {/* Wishlist Drawer */}
          <WishlistDrawer />

          {/* Cart Drawer */}
          <CartDrawer />

          {/* User Account */}
          <div className="flex items-center gap-1 pl-1 border-l border-[#EAECEF] ml-1">
            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/profile"
                  aria-label="Open your profile"
                  className="flex items-center gap-2 rounded-full p-1 sm:pr-3 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-[#C8102E]"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#C8102E] shadow-sm">
                    {userInitial ?? <User size={14} />}
                  </span>
                  <span className="hidden md:inline max-w-28 truncate font-medium text-gray-800">{user.name}</span>
                </Link>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void logout()}
                  aria-label="Sign out"
                  title="Sign out"
                  className="rounded-full text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                className="rounded-full px-4 text-xs font-semibold shadow-sm bg-[#C8102E] text-white hover:bg-[#a50d26]"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </AppContainer>

      {/* ── Secondary Category Bar ── */}
      <div className="border-t border-[#EAECEF] bg-white overflow-x-auto no-scrollbar">
        <AppContainer className="flex items-center gap-1 py-0 text-xs sm:text-sm">
          {categories.map((category, idx) => {
            const Icon = getCategoryIcon(category.name);
            const isActive = activeCategoryParam
              ? activeCategoryParam.toLowerCase() === category.slug.toLowerCase() ||
                activeCategoryParam.toLowerCase() === category.name.toLowerCase()
              : idx === 0 && pathname === '/';
            return (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className={`relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 font-medium transition-all duration-200 ${
                  isActive ? 'text-[#C8102E]' : 'text-gray-600 hover:text-[#C8102E]'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{category.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E] rounded-t-full transition-all duration-200" />
                )}
              </Link>
            );
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side: Currency selector + heart */}
          <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-[#EAECEF]">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen((o) => !o)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#C8102E] transition-colors py-1 px-2 rounded-lg hover:bg-red-50"
              >
                {currency}
                <ChevronDown className={`size-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* {currencyOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-20 rounded-xl border border-[#EAECEF] bg-white shadow-sm py-1">
                  {CURRENCY_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-red-50 hover:text-[#C8102E] ${
                        currency === c ? 'text-[#C8102E]' : 'text-gray-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )} */}
            </div>

            {/* Wishlist heart icon */}
            {/* <button
              type="button"
              className="flex items-center justify-center p-1.5 rounded-lg text-gray-500 hover:text-[#C8102E] hover:bg-red-50 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="size-4" />
            </button> */}
          </div>
        </AppContainer>
      </div>
    </header>
  );
};
