'use client';

import { useEffect, useState } from 'react';

type QrCountdownProps = {
  expiry: string;
  onExpire?: () => void;
};

export function QrCountdown({ expiry, onExpire }: QrCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, new Date(expiry).getTime() - Date.now()));

  useEffect(() => {
    const expiryTime = new Date(expiry).getTime();

    if (Number.isNaN(expiryTime)) {
      setTimeLeft(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, expiryTime - Date.now());

      setTimeLeft(remaining);

      if (remaining === 0) {
        onExpire?.();
      }
    };

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiry, onExpire]);

  const totalSeconds = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (timeLeft <= 0) {
    return <p className="text-sm text-red-600">QR code expired</p>;
  }

  return (
    <span className="font-semibold tabular-nums">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}
