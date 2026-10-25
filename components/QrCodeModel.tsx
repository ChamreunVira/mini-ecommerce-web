'use client';

import { Clock3, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useId } from 'react';
import { QrCode } from './QrCode';
import { QrCountdown } from './QrCoundown';

interface QrCodeModelProps {
  qrString: string;
  qrExpry: string;
  onClose: () => void;
  merchantName?: string;
  amount?: number | string;
  currency?: string;
}

const QrCodeModel = ({
  qrString,
  qrExpry,
  onClose,
  merchantName = 'CHAMREUN VIRA',
  amount,
  currency = 'USD',
}: QrCodeModelProps) => {
  const titleId = useId();
  const qrSize = 180;
  const formattedAmount = typeof amount === 'number' ? amount.toFixed(2) : amount;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-165 overflow-y-auto rounded-md border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
        role="dialog"
      >
        <button
          aria-label="Close payment instructions"
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          onClick={onClose}
          type="button"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="grid gap-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center sm:gap-8">
          {/* KHQR ID Card following official 20:29 aspect ratio and guidelines styling */}
          <section className="mx-auto flex aspect-20:29 w-full max-w-55 flex-col overflow-hidden rounded-[8px] border border-[#e1e1e1] bg-white shadow-[0_0_16px_rgba(0,0,0,0.1)]">
            <div className="flex py-2 h-[12%] shrink-0 items-center justify-center bg-[#E1232E]">
              <Image
                src="/assets/khqr/KHQR Logo.svg"
                alt="KHQR"
                width={166}
                height={40}
                priority
                className="h-4 w-auto"
              />
            </div>

            <div className="shrink-0 px-5 pb-2 pt-3 text-left">
              <p className="truncate text-[10px] font-medium uppercase leading-none text-[#000000]">{merchantName}</p>
              <p className="mt-1 text-[20px] font-bold leading-none text-[#000000]">
                {formattedAmount ? `$${formattedAmount}` : currency}{' '}
                {formattedAmount && <span className="text-[11px] font-semibold">{currency}</span>}
              </p>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center border-t border-[#e1e1e1] px-4 py-2">
              <div className="relative w-full max-w-45">
                <QrCode qrString={qrString} size={qrSize} />
                {qrString && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-black text-[20px] font-bold leading-none text-white shadow-sm"
                  >
                    $
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-center gap-1.5 px-2 pb-3 text-[10px] font-medium text-slate-600">
              <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-sky-500" />
              <span>Waiting for payment</span>
              <QrCountdown expiry={qrExpry} />
            </div>
          </section>

          {/* Payment Instructions Section */}
          <section className="flex min-w-0 flex-col py-1 sm:py-0">
            <h2 id={titleId} className="text-[21px] font-bold leading-tight text-slate-800">
              How to make payment?
            </h2>

            <ol className="mt-4 space-y-1.5 text-[12px] leading-[1.35] text-slate-700 list-decimal list-inside">
              <li>Open Bakong App</li>
              <li>Tap &quot;QR PAY&quot;</li>
              <li>Scan the KHQR code</li>
              <li>Confirm and Done</li>
            </ol>

            <div className="my-3.5 flex items-center gap-3 text-[12px] text-slate-400">
              <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
              <span>or</span>
              <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
            </div>

            <ol className="space-y-1.5 text-[12px] leading-[1.35] text-slate-700 list-decimal list-inside">
              <li>Open any Mobile Banking App that supports KHQR</li>
              <li>Scan QR Code</li>
              <li>Confirm and Done</li>
            </ol>

            <div aria-label="Payment progress" className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[90%] rounded-full bg-sky-500" />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-slate-500">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3.5 py-1.5 shadow-sm bg-slate-50">
                <Clock3 aria-hidden="true" size={13} strokeWidth={1.8} className="text-slate-600" />
                <QrCountdown expiry={qrExpry} />
              </div>
              <p className="font-medium text-slate-600">KHQR | Scan, Pay, Done</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModel;
