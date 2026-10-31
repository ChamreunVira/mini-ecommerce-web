'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { MonthlyRevenue } from '@/types';

const chartConfig = {
  revenue: { label: 'Revenue', color: 'oklch(0.623 0.188 259.815)' },
} satisfies ChartConfig;

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => (
  <Card className="lg:col-span-4">
    <CardHeader>
      <CardTitle>Revenue by Month</CardTitle>
      <CardDescription>Total sales for the current year</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <BarChart data={data} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(value: number) => `$${value / 1000}k`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
