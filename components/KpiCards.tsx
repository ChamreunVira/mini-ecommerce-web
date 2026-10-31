import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/format';
import type { KpiMetric } from '@/types';
import { cn } from '@/lib/utils';

interface KpiCardsProps {
  metrics: KpiMetric[];
}

export const KpiCards = ({ metrics }: KpiCardsProps) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {metrics.map((metric) => {
      const isPositiveChange = metric.changePercent >= 0;
      const TrendIcon = isPositiveChange ? ArrowUpRight : ArrowDownRight;

      return (
        <Card key={metric.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {metric.format === 'currency' ? formatCurrency(metric.value) : formatNumber(metric.value)}
            </div>
            <p
              className={cn(
                'mt-1 flex items-center gap-1 text-xs',
                isPositiveChange ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              <TrendIcon className="size-3.5" />
              {Math.abs(metric.changePercent)}% from last month
            </p>
          </CardContent>
        </Card>
      );
    })}
  </div>
);
