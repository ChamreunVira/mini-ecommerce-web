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

export const getProductImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  }
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('/')
  ) {
    return imagePath;
  }
  return `${STORAGE_BASE_URL}/${imagePath}`;
};
