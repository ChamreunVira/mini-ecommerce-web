import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { Order } from '@/types';

interface InvoiceDocumentProps {
  order: Order;
}

export function InvoiceDocument({ order }: InvoiceDocumentProps) {
  return (
    <article className="w-full bg-white p-8 text-sm text-black">
      <header className="flex items-start justify-between gap-6 border-b border-gray-300 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">INVOICE</h2>
          <p className="mt-1 text-gray-600">{order.order_number}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            <span className="text-indigo-500">Electronic</span> Store
          </p>
          <p className="text-gray-600">Phnom Penh, Cambodia</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6 border-b border-gray-300 py-6">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Billed to</h3>
          <p className="font-medium">{order.address?.recipient_name ?? 'Guest'}</p>
          <p className="text-gray-600">{order.address?.phone ?? 'N/A'}</p>
        </div>
        <div className="text-right">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Details</h3>
          <p>Date: {formatOrderDate(order.created_at)}</p>
          <p className="capitalize">Status: {order.status}</p>
          <p className="capitalize">Payment: {order.payment?.method ?? 'Pending'}</p>
        </div>
      </section>

      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-2 font-semibold">Item</th>
            <th className="py-2 text-center font-semibold">Qty</th>
            <th className="py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2">{item.product_name}</td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-right">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="ml-auto mt-6 w-full max-w-xs space-y-2">
        <div className="flex justify-between">
          <dt className="text-gray-600">Subtotal</dt>
          <dd>{formatCurrency(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
          <dt>Total</dt>
          <dd>{formatCurrency(order.total)}</dd>
        </div>
      </dl>

      <footer className="mt-10 border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
        Thank you for your purchase.
      </footer>
    </article>
  );
}
