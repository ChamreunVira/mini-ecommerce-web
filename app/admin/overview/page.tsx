'use client';

import { useEffect, useState } from 'react';

import { KpiCards } from '@/components/KpiCards';
import type { Order } from '@/types';
import type { OverviewResponse } from '@/types';
import { overviewService } from '@/services/overview-service';
import { RevenueChart } from '@/components/chart/RevenueChart';
import { OrderStatusChart } from '@/components/chart/OrderStatusChart';
import { QuickActions } from '@/components/QuickAction';
import { RecentOrders } from '@/components/RecentOrders';

const RECENT_ORDERS_LIMIT = 5;

export default function DashboardOverviewPage() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadOverview = async () => {
      try {
        const response = await overviewService.get();
        if (!isCancelled) {
          setOverview(response.data);
          setRecentOrders(response.data.recent_orders.slice(0, RECENT_ORDERS_LIMIT));
        }
      } catch {
        if (!isCancelled) {
          setErrorMessage('Failed to load recent orders.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadOverview();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">A summary of your store performance.</p>
      </div>

      <KpiCards metrics={overview?.metrics ?? []} />

      <div className="grid gap-4 lg:grid-cols-7">
        <RevenueChart data={overview?.monthly_revenue ?? []} />
        <OrderStatusChart data={overview?.order_status_counts ?? []} />
      </div>

      <QuickActions />
      <RecentOrders orders={recentOrders} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  );
}
