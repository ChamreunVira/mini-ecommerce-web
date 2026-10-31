import { AppNavbar } from '@/components/AppNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { Suspense } from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>
        <SidebarInset>
          <main>
            <Suspense fallback={<div className="h-14 border-b" aria-hidden="true" />}>
              <AppNavbar />
            </Suspense>
            <div className="px-12 py-8">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default layout;
