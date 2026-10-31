import React, { Suspense } from 'react';
import EditCategoryContent from '@/components/EditCategoryContent';

const EditCategoryPage = () => (
  <Suspense fallback={<p>Loading category...</p>}>
    <EditCategoryContent />
  </Suspense>
);

export default EditCategoryPage;
