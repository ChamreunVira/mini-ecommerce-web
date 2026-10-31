'use client';

import { useParams } from 'next/navigation';

export default function EditCategoryContent() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2></h2>
      {id}
    </div>
  );
}
