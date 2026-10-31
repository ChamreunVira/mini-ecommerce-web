'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, LogOut, Search, Settings } from 'lucide-react';

import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import { useAppContext } from '@/context/AppContextProvider';

interface BreadcrumbSegment {
  label: string;
  href: string;
}

const formatSegmentLabel = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const buildBreadcrumbSegments = (pathname: string): BreadcrumbSegment[] => {
  const pathSegments = pathname.split('/').filter(Boolean);

  return pathSegments.map((segment, index) => ({
    label: formatSegmentLabel(segment),
    href: `/${pathSegments.slice(0, index + 1).join('/')}`,
  }));
};

export const AppNavbar = () => {
  const { user, logout } = useAppContext();
  const pathname = usePathname();
  const breadcrumbSegments = buildBreadcrumbSegments(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-2 h-4" />

      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          {breadcrumbSegments.map((segment, index) => {
            const isLastSegment = index === breadcrumbSegments.length - 1;

            return (
              <React.Fragment key={segment.href}>
                <BreadcrumbItem>
                  {isLastSegment ? (
                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={segment.href}>{segment.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLastSegment && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="h-9 w-64 pl-8" />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open account menu">
                <Avatar className="size-8">
                  <AvatarFallback className="flex items-center justify-center font-semibold text-indigo-500 bg-indigo-50">
                    CV
                    {/* <User2 className="size-4" /> */}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <div className="flex flex-col justify-center leading-tight">
                <h2 className="text-sm font-medium">{user?.name}</h2>
                <p className="text-xs">{user?.email}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void logout()}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
