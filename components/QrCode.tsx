'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodeProps {
  qrString: string;
  size?: number;
  className?: string;
}

export const QrCode = ({ qrString, size = 180, className }: QrCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!qrString) {
      canvas.getContext('2d')?.clearRect(0, 0, size, size);
      return;
    }

    QRCode.toCanvas(
      canvas,
      qrString,
      {
        width: size,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error('Error generating KHQR code:', error);
      },
    );
  }, [qrString, size]);

  return <canvas ref={canvasRef} width={size} height={size} className={`block aspect-square h-auto w-full ${className ?? ''}`} />;
};
