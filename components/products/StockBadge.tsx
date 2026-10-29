import { Badge } from '@/components/ui/badge';
import { getStockStatus, STOCK_STATUS_LABELS, type StockStatus } from '@/lib/product';

const STOCK_BADGE_VARIANTS: Record<StockStatus, 'secondary' | 'outline' | 'destructive'> = {
  in_stock: 'secondary',
  low_stock: 'outline',
  out_of_stock: 'destructive',
};

export const StockBadge = ({ quantity }: { quantity: number }) => {
  const stockStatus = getStockStatus(quantity);

  return <Badge variant={STOCK_BADGE_VARIANTS[stockStatus]}>{STOCK_STATUS_LABELS[stockStatus]}</Badge>;
};
