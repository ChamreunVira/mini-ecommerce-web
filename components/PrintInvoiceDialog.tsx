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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl rounded-sm shadow-none border-border">
          <DialogHeader>
            <DialogTitle>Invoice {order?.order_number}</DialogTitle>
            <DialogDescription>Preview the invoice before printing.</DialogDescription>
          </DialogHeader>

          {order && (
            <div className="overflow-hidden rounded-sm border border-slate-200 shadow-none">
              <InvoiceDocument order={order} />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose} className="rounded-sm shadow-none">
              Close
            </Button>
            <Button onClick={() => window.print()} className="rounded-sm shadow-none">
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
