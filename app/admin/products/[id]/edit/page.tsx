import React, { Suspense } from 'react';
import EditProductContent from '@/components/EditProductContent';

export default function EditProductPage() {
  return (
    <Suspense fallback={<p>Loading product...</p>}>
      <EditProductContent />
    </Suspense>
  );
}
