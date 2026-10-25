'use client';
import { useParams } from 'next/navigation';
import React from 'react';

const OrderSuccessPage = () => {
  const params = useParams();
  const orderId = params.orderId;
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="rounded border px-8 py-4">
        <h1>Payment successfully.</h1>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
