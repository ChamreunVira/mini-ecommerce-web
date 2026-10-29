'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronsUpDown,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from './ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppContext } from '@/context/AppContextProvider';
import { Avatar } from './ui/avatar';

interface SidebarNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Optional "create" shortcut rendered as a "+" action button. */
  createHref?: string;
}

interface SidebarNavigationGroup {
  label: string;
  items: SidebarNavigationItem[];
}

const sidebarNavigationGroups: SidebarNavigationGroup[] = [
  {
    label: 'Overview',
    items: [{ title: 'Overview', href: '/admin/overview', icon: LayoutDashboard }],
  },
  {
    label: 'Catalog',
    items: [
      {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
        createHref: '/admin/categories/new',
      },
      {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
        createHref: '/admin/products/new',
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      { title: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { title: 'Payments', href: '/admin/payments', icon: CreditCard },
    ],
  },
];

const isRouteActive = (pathname: string, item: SidebarNavigationItem) =>
  item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);

export const AppSidebar = () => {
  const pathname = usePathname();
  const { user } = useAppContext();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem className="py-2 px-3 font-medium text-xl">
            <span className="text-indigo-500">e</span>
            <span className="group-data-[collapsible=icon]:hidden">St4re</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sidebarNavigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isRouteActive(pathname, item)} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {item.createHref && (
                      <SidebarMenuAction asChild showOnHover>
                        <Link href={item.createHref} aria-label={`Create ${item.title}`}>
                          <Plus />
                        </Link>
                      </SidebarMenuAction>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="Account">
                  <Avatar className="flex items-center justify-center font-semibold text-indigo-500 bg-indigo-50">
                    CV
                  </Avatar>
                  <span>{user?.name}</span>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
