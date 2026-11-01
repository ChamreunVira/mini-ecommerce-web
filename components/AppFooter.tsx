import Link from 'next/link';

import { AppContainer } from './Container';
import { CurrentYear } from './CurrentYear';

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
      { label: 'All products', href: '/products' },
      { label: 'Home', href: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My profile', href: '/profile' },
      { label: 'My orders', href: '/profile' },
    ],
  },
];

const AppFooter = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-gray-900 text-white">
      <AppContainer className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2fr] lg:gap-16">
          {/* brand */}
          <div className="max-w-sm">
            <Link href="/" className="text-xl font-medium">
              <span className="font-semibold text-indigo-400">e</span>St4re
            </Link>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              Thoughtful technology and useful essentials for everyday life.
            </p>
            <p className="mt-4 text-sm text-gray-500">Phnom Penh, Cambodia</p>
          </div>

          {/* link columns */}
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-indigo-400">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; <CurrentYear /> eSt4re. All rights reserved.</p>
          <p>Designed for better everyday living.</p>
        </div>
      </AppContainer>
    </footer>
  );
};

export default AppFooter;
