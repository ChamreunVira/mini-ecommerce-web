import { AppContainer } from '@/components/Container';
import { productService } from '@/services/product-service';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ProductPurchaseActions from '@/components/ProductPurchaseActions';
import { getProductImageUrl } from '@/lib/product';
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const { id } = await params;
  const response = await productService.getById(Number(id));
  const product = response.data;
  const isAvailable = product.quantity > 0;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link href="/" className="hover:text-[#C8102E] transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-[#C8102E] transition-colors">
          Products
        </Link>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="font-medium text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Product Image */}
        <div className="lg:col-span-6">
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-slate-200/80 bg-slate-50 p-8">
            <span
              className={`absolute left-4 top-4 rounded-sm px-2.5 py-1 text-xs font-medium ${
                isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200/70 text-slate-600'
              }`}
            >
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>

            <Image
              width={600}
              height={600}
              src={getProductImageUrl(product.image_url)}
              alt={product.name}
              className="max-h-[75%] w-auto object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Right Column: Product Details & Actions */}
        <div className="flex flex-col lg:col-span-6 space-y-6">
          <div>
            <p className="text-xs font-medium text-[#C8102E]">{product.category || 'General Electronics'}</p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-2.5 border-y border-slate-200/80 py-4">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">VAT included</span>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {product.description ||
              'High-performance hardware engineered with precision. Designed to deliver reliable performance for your daily workflows, entertainment, and productivity.'}
          </p>

          <dl className="grid grid-cols-2 gap-4 rounded-md border border-slate-200/80 bg-slate-50/60 p-4 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{product.category || 'General Electronics'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Availability</dt>
              <dd className="mt-0.5 font-medium text-slate-900 tabular-nums">
                {isAvailable ? `${product.quantity} in stock` : 'Sold out'}
              </dd>
            </div>
          </dl>

          <ProductPurchaseActions product={product} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-slate-400 shrink-0" />
              <span>Fast local delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-slate-400 shrink-0" />
              <span>100% genuine product</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4 text-slate-400 shrink-0" />
              <span>7-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailPage = ({ params }: ProductDetailProps) => {
  return (
    <AppContainer className="my-8 sm:my-14">
      <Suspense
        fallback={
          <div className="grid gap-10 lg:grid-cols-12">
            <Skeleton className="h-96 lg:col-span-6 rounded-md" />
            <div className="lg:col-span-6 space-y-4">
              <Skeleton className="h-6 w-1/4 rounded-md" />
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-8 w-1/3 rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        }
      >
        <ProductDetail params={params} />
      </Suspense>
    </AppContainer>
  );
};

export default ProductDetailPage;
