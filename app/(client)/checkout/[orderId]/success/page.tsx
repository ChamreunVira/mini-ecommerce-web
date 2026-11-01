'use client';

import { AppContainer } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { orderService } from '@/services/order-service';
import type { Order } from '@/types';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import { CheckCircle2, FileText, Home, Package, Printer, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';

const OrderSuccessContent = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const parsedOrderId = Number(orderId);
  const isValidOrderId = Number.isInteger(parsedOrderId) && parsedOrderId > 0;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(isValidOrderId);
  const [hasError, setHasError] = useState(!isValidOrderId);

  const generateInvoice = () => {
    window.print();
  };

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
              <div className="mt-8 text-left">
                <div className="print-hidden mb-4 flex justify-center">
                  <Button type="button" variant="outline" onClick={generateInvoice}>
                    <Printer size={16} />
                    Generate invoice
                  </Button>
                </div>

                <article id="invoice-print-area" className="invoice-print-area rounded-lg border bg-white p-5 sm:p-8">
                  <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-950">
                        <FileText size={22} className="text-indigo-600" />
                        VSTORE
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Official order invoice</p>
                    </div>
                    <div className="text-left text-sm sm:text-right">
                      <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Invoice</p>
                      <p className="mt-1 font-semibold text-slate-950">{order.order_number}</p>
                      <p className="mt-1 text-slate-500">{formatOrderDate(order.created_at)}</p>
                    </div>
                  </header>

                  <div className="grid gap-5 border-b py-6 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Billed to</p>
                      {order.address ? (
                        <address className="mt-2 not-italic leading-6 text-slate-700">
                          <span className="font-semibold text-slate-950">{order.address.recipient_name}</span>
                          <br />
                          {order.address.address_line}
                          <br />
                          {order.address.city}
                          <br />
                          {order.address.phone}
                        </address>
                      ) : (
                        <p className="mt-2 text-slate-500">Address unavailable</p>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Payment</p>
                      <p className="mt-2 capitalize text-slate-700">{order.payment?.method ?? 'Order payment'}</p>
                      <p className="mt-1 capitalize text-emerald-600">{order.payment?.status ?? order.status}</p>
                    </div>
                  </div>

                  <div className="py-6">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b pb-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                      <span>Item</span>
                      <span>Qty</span>
                      <span className="text-right">Amount</span>
                    </div>
                    <div className="divide-y">
                      {order.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-4 py-3 text-sm text-slate-700">
                          <span>{item.product_name}</span>
                          <span>{item.quantity}</span>
                          <span className="text-right font-medium text-slate-950">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ml-auto max-w-xs border-t pt-4 text-sm">
                    <div className="flex justify-between gap-6 text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="mt-2 flex justify-between gap-6 text-lg font-bold text-slate-950">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <footer className="mt-8 border-t pt-5 text-center text-xs text-slate-500">
                    Thank you for shopping with VSTORE.
                  </footer>
                </article>

                <div className="print-hidden mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Package size={16} /> {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <p className="flex items-center gap-2 capitalize">
                    <ShoppingBag size={16} /> {order.status}
                  </p>
                </div>
              </div>
            )}

            <div className="print-hidden mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
    </main>
  );
};

const OrderSuccessPage = () => (
  <Suspense fallback={<main className="min-h-[70vh] bg-slate-50/60 py-10 sm:py-16" />}>
    <OrderSuccessContent />
  </Suspense>
);

export default OrderSuccessPage;
