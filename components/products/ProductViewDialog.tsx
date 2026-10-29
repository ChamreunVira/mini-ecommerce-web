import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { Product } from '@/types';

import { ProductThumbnail } from './ProductThumbnail';
import { StockBadge } from './StockBadge';

interface ProductViewDialogProps {
  product: Product | null;
  onClose: () => void;
}

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-b-0">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="text-right font-medium">{children}</dd>
  </div>
);

export const ProductViewDialog = ({ product, onClose }: ProductViewDialogProps) => (
  <Dialog open={product !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <DialogContent className="sm:max-w-md">
      {product && (
        <>
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>{product.description ?? 'No description provided.'}</DialogDescription>
          </DialogHeader>

          <ProductThumbnail
            imagePath={product.image_url}
            productName={product.name}
            className="aspect-square size-auto w-full"
          />

          <dl>
            <DetailRow label="Category">{product.category}</DetailRow>
            <DetailRow label="Price">{formatCurrency(product.price)}</DetailRow>
            <DetailRow label="Quantity">
              <span className="flex items-center gap-2">
                {product.quantity}
                <StockBadge quantity={product.quantity} />
              </span>
            </DetailRow>
            <DetailRow label="Created">{formatOrderDate(product.created_at)}</DetailRow>
            <DetailRow label="Updated">{formatOrderDate(product.updated_at)}</DetailRow>
          </dl>
        </>
      )}
    </DialogContent>
  </Dialog>
);
