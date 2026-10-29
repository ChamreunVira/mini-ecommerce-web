import Image from 'next/image';
import { ImageOff } from 'lucide-react';

import { getProductImageUrl } from '@/lib/product';
import { cn } from '@/lib/utils';

interface ProductThumbnailProps {
  imagePath: string | null;
  productName: string;
  className?: string;
}

export const ProductThumbnail = ({ imagePath, productName, className }: ProductThumbnailProps) => {
  const imageUrl = getProductImageUrl(imagePath);

  return (
    <div
      className={cn(
        'relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted',
        className,
      )}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={productName} fill unoptimized sizes="128px" className="object-cover" />
      ) : (
        <ImageOff className="size-5 text-muted-foreground" />
      )}
    </div>
  );
};
