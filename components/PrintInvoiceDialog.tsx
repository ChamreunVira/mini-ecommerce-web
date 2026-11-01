'use client';

import { createPortal } from 'react-dom';
import { Printer } from 'lucide-react';

import { InvoiceDocument } from '@/components/InvoiceDocument';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Order } from '@/types';

interface PrintInvoiceDialogProps {
  order: Order | null;
  onClose: () => void;
}

export function PrintInvoiceDialog({ order, onClose }: PrintInvoiceDialogProps) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <>
      <Dialog open={order !== null} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice {order?.order_number}</DialogTitle>
            <DialogDescription>Preview the invoice before printing.</DialogDescription>
          </DialogHeader>

          {order && (
            <div className="overflow-hidden rounded-md border">
              <InvoiceDocument order={order} />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Printer />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print-only copy: hidden on screen, the only visible element when printing. */}
      {order &&
        createPortal(
          <div id="invoice-print-root" className="hidden print:block">
            <InvoiceDocument order={order} />
          </div>,
          document.body,
        )}
    </>
  );
}
