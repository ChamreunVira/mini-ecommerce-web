export interface KpiMetric {
  key: 'revenue' | 'orders' | 'customers' | 'averageOrderValue';
  title: string;
  value: number;
  format: 'currency' | 'number';
  /** Percentage change compared to the previous period. */
  changePercent: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface OrderStatusCount {
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  count: number;
}

export const kpiMetrics: KpiMetric[] = [
  { key: 'revenue', title: 'Total Revenue', value: 48250, format: 'currency', changePercent: 12.5 },
  { key: 'orders', title: 'Total Orders', value: 1284, format: 'number', changePercent: 8.2 },
  { key: 'customers', title: 'Customers', value: 862, format: 'number', changePercent: 4.1 },
  { key: 'averageOrderValue', title: 'Avg. Order Value', value: 37.58, format: 'currency', changePercent: -2.3 },
];

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Jan', revenue: 2800 },
  { month: 'Feb', revenue: 3200 },
  { month: 'Mar', revenue: 3900 },
  { month: 'Apr', revenue: 3600 },
  { month: 'May', revenue: 4300 },
  { month: 'Jun', revenue: 4700 },
  { month: 'Jul', revenue: 4100 },
  { month: 'Aug', revenue: 4900 },
  { month: 'Sep', revenue: 5200 },
  { month: 'Oct', revenue: 5600 },
  { month: 'Nov', revenue: 6100 },
  { month: 'Dec', revenue: 6850 },
];

export const orderStatusCounts: OrderStatusCount[] = [
  { status: 'delivered', count: 612 },
  { status: 'shipped', count: 214 },
  { status: 'paid', count: 186 },
  { status: 'pending', count: 148 },
  { status: 'cancelled', count: 124 },
];
