'use client';

import { createPortal } from 'react-dom';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Download, Home, Package, ShoppingBag } from 'lucide-react';

import { AppContainer } from '@/components/Container';
import { InvoiceDocument } from '@/components/InvoiceDocument';
import { Button } from '@/components/ui/button';
import { orderService } from '@/services/order-service';
import type { Order } from '@/types';

const OrderSuccessContent = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const parsedOrderId = Number(orderId);
  const isValidOrderId = Number.isInteger(parsedOrderId) && parsedOrderId > 0;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(isValidOrderId);
  const [hasError, setHasError] = useState(!isValidOrderId);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await orderService.getById(parsedOrderId);
        setOrder(response.data);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (isValidOrderId) void loadOrder();
  }, [isValidOrderId, orderId, parsedOrderId]);

  const handleDownloadInvoice = () => {
    if (!order) return;

    // The browser uses the page title as the default PDF file name.
    const originalTitle = document.title;
    document.title = `Invoice-${order.order_number}`;
    window.addEventListener(
      'afterprint',
      () => {
        document.title = originalTitle;
      },
      { once: true },
    );

    window.print();
  };

  return (
    <main className="min-h-[70vh] bg-slate-50/60 py-10 sm:py-16">
      <AppContainer>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border bg-white p-6 text-center shadow-sm sm:p-10">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={34} />
            </span>
            <p className="mt-5 text-sm font-medium uppercase tracking-[0.16em] text-emerald-600">Order confirmed</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Thank you for your order</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your order has been received. We will keep you updated as it moves through fulfillment.
            </p>

            {isLoading ? (
              <div className="mt-8 space-y-3" aria-label="Loading order details">
                <div className="mx-auto h-4 w-40 animate-pulse rounded bg-slate-100" />
                <div className="mx-auto h-4 w-28 animate-pulse rounded bg-slate-100" />
              </div>
            ) : hasError || !order ? (
              <p className="mt-8 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Your order was created, but its details are temporarily unavailable.
              </p>
            ) : (
              <div className="mt-8 space-y-5">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-950">{order.order_number}</p>
                  <p className="flex items-center gap-2">
                    <Package size={16} /> {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <p className="flex items-center gap-2 capitalize">
                    <ShoppingBag size={16} /> {order.status}
                  </p>
                </div>

                <Button type="button" variant="outline" onClick={handleDownloadInvoice}>
                  <Download size={16} />
                  Download invoice
                </Button>
              </div>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/profile">View my orders</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">
                  <Home size={16} /> Continue shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </AppContainer>

      {/* Print-only copy: hidden on screen, the only thing visible when printing. */}
      {order &&
        createPortal(
          <div id="invoice-print-root" className="hidden print:block">
            <InvoiceDocument order={order} />
          </div>,
          document.body,
        )}
    </main>
  );
};

const OrderSuccessPage = () => (
  <Suspense fallback={<main className="min-h-[70vh] bg-slate-50/60 py-10 sm:py-16" />}>
    <OrderSuccessContent />
  </Suspense>
);

export default OrderSuccessPage;
