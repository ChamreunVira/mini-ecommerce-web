'use client';

import { useEffect, useState } from 'react';

import { KpiCards } from '@/components/KpiCards';
import { kpiMetrics, monthlyRevenue, orderStatusCounts } from '@/lib/mock/overview-stats';
import type { Order } from '@/types';
import { orderService } from '@/services/order-service';
import { RevenueChart } from '@/components/chart/RevenueChart';
import { OrderStatusChart } from '@/components/chart/OrderStatusChart';
import { QuickActions } from '@/components/QuickAction';
import { RecentOrders } from '@/components/RecentOrders';

const RECENT_ORDERS_LIMIT = 5;

export default function DashboardOverviewPage() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadRecentOrders = async () => {
      try {
        const response = await orderService.getAll(1);
        if (!isCancelled) {
          setRecentOrders(response.data.slice(0, RECENT_ORDERS_LIMIT));
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

    loadRecentOrders();

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

      <KpiCards metrics={kpiMetrics} />

      <div className="grid gap-4 lg:grid-cols-7">
        <RevenueChart data={monthlyRevenue} />
        <OrderStatusChart data={orderStatusCounts} />
      </div>

      <QuickActions />
      <RecentOrders orders={recentOrders} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  );
}
