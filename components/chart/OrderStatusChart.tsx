'use client';

import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatNumber } from '@/lib/format';
import type { OrderStatusCount } from '@/types';

const chartConfig = {
  count: { label: 'Orders' },
  delivered: {
    label: 'Delivered',
    color: 'oklch(0.627 0.194 149.214)', // Green
  },
  completed: {
    label: 'Completed',
    color: 'oklch(0.606 0.154 163.225)', // Teal
  },
  shipped: {
    label: 'Shipped',
    color: 'oklch(0.623 0.188 259.815)', // Blue
  },
  paid: {
    label: 'Paid',
    color: 'oklch(0.606 0.154 163.225)', // Teal
  },
  processing: {
    label: 'Processing',
    color: 'oklch(0.623 0.188 259.815)', // Blue
  },
  comfirmed: {
    label: 'Confirmed',
    color: 'oklch(0.606 0.154 163.225)', // Teal
  },
  pending: {
    label: 'Pending',
    color: 'oklch(0.681 0.162 75.834)', // Amber
  },
  cancelled: {
    label: 'Cancelled',
    color: 'oklch(0.577 0.245 27.325)', // Red
  },
} satisfies ChartConfig;

interface OrderStatusChartProps {
  data: OrderStatusCount[];
}

export const OrderStatusChart = ({ data }: OrderStatusChartProps) => {
  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);
  const chartData = data.map((item) => ({
    ...item,
    fill: `var(--color-${item.status})`,
  }));

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
        <CardDescription>Distribution of all orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-72 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={65} outerRadius={95} strokeWidth={4}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !('cx' in viewBox)) return null;
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-semibold">
                        {formatNumber(totalOrders)}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 22} className="fill-muted-foreground text-xs">
                        Orders
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
