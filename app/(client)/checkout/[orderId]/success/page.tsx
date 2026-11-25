'use client';

import { createPortal } from 'react-dom';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Download, Home, Package, ArrowRight } from 'lucide-react';

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
    <main className="min-h-[75vh] bg-slate-50/50 py-12 sm:py-20">
      <AppContainer>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-xl sm:p-12 transition-all">
            <span className="mx-auto flex size-20 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 shadow-sm transition-transform duration-300 hover:scale-105">
              <CheckCircle2 size={42} />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Payment & Order Confirmed
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">Thank You for Your Order!</h1>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-500 max-w-lg mx-auto">
              Your order has been recorded successfully. Our fulfillment team is already preparing your package.
            </p>

            {isLoading ? (
              <div className="mt-8 space-y-3" aria-label="Loading order details">
                <div className="mx-auto h-5 w-48 animate-pulse rounded-lg bg-slate-100" />
                <div className="mx-auto h-4 w-32 animate-pulse rounded-lg bg-slate-100" />
              </div>
            ) : hasError || !order ? (
              <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                Your order was created, but details could not be loaded at this second.
              </p>
            ) : (
              <div className="mt-8 space-y-6">
                <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-lg border border-slate-100 bg-slate-50/80 px-6 py-3.5 text-sm">
                  <span className="font-bold text-slate-950">#{order.order_number}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Package size={15} /> {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 capitalize">
                    {order.status}
                  </span>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadInvoice}
                    className="rounded-lg border-slate-300 text-slate-700 hover:text-[#C8102E] hover:border-[#C8102E]/30 gap-2 cursor-pointer shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                  >
                    <Download size={16} />
                    Download PDF Invoice
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-lg font-semibold shadow-md gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <Link href="/profile">
                  View My Orders <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-lg border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <Link href="/products" className="gap-2">
                  <Home size={16} /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </AppContainer>

      {/* Print-only copy for browser print dialog */}
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
  <Suspense fallback={<main className="min-h-[75vh] bg-slate-50/50 py-12 sm:py-20" />}>
    <OrderSuccessContent />
  </Suspense>
);

export default OrderSuccessPage;
