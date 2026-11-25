import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Product } from '@/types';

interface DeleteProductDialogProps {
  product: Product | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteProductDialog = ({ product, isDeleting, onConfirm, onClose }: DeleteProductDialogProps) => (
  <AlertDialog open={product !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <AlertDialogContent className="rounded-sm shadow-none border-border">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete product?</AlertDialogTitle>
        <AlertDialogDescription>
          {product ? `"${product.name}" will be permanently removed. This action cannot be undone.` : ''}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting} className="rounded-sm shadow-none">Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isDeleting}
          className="rounded-sm shadow-none"
          onClick={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
