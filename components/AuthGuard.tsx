'use client';

import { useAppContext } from '@/context/AppContextProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoading } = useAppContext();
  const router = useRouter();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace('/login');
    } else if (!isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, isAuthLoading, router, user]);

  if (isAuthLoading || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking access...</div>;
  }

  return children;
}