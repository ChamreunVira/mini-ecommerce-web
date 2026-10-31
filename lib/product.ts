export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export const LOW_STOCK_THRESHOLD = 5;

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
};

export const getStockStatus = (quantity: number): StockStatus => {
  if (quantity <= 0) return 'out_of_stock';
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low_stock';
  return 'in_stock';
};

const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export const getProductImageUrl = (imagePath: string): string => `${STORAGE_BASE_URL}/${imagePath}`;
