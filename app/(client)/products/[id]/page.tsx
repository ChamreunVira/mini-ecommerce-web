import { AppContainer } from '@/components/Container';
import { productService } from '@/services/product-service';
import Image from 'next/image';
import { Suspense } from 'react';
import ProductPurchaseActions from '@/components/ProductPurchaseActions';
import { getProductImageUrl } from '@/lib/product';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const { id } = await params;

  const response = await productService.getById(Number(id));
  const product = response.data;

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
      {/* product images slide */}
      <div className="flex min-h-72 w-full items-center justify-center rounded bg-gray-50 sm:min-h-96 lg:min-h-0 lg:w-1/2">
        <Image
          width={500}
          height={500}
          src={getProductImageUrl(product.image_url)}
          alt="product_detail_primary"
          className="h-auto max-h-[60vh] w-full object-contain"
          unoptimized
        />
      </div>
      {/* product info */}
      <div className="flex min-w-0 w-full flex-col space-y-6 p-1 sm:p-6 lg:w-1/2 lg:space-y-10 lg:p-8">
        <h1 className="wrap-break-word text-2xl sm:text-3xl">{product?.name}</h1>
        <p className="wrap-break-word text-[16px] text-gray-800">
          {product?.description ??
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit ut repellat accusamus similique maiores ea deserunt odio error vero accusantium!'}
        </p>
        <div>
          <p className="text-xl text-rose-500 font-medium">$ {product?.price}</p>
        </div>
        <table className="w-full max-w-full text-left text-sm sm:w-auto">
          <tbody>
            <tr className="*:border *:px-3 *:py-1.5">
              <td className="font-medium">Category</td>
              <td className="text-gray-800">{product.category}</td>
            </tr>
            <tr className="*:border *:px-3 *:py-1.5">
              <td className="font-medium">Quantity</td>
              <td className="text-gray-800">{product.quantity}</td>
            </tr>
          </tbody>
        </table>
        <ProductPurchaseActions product={product} />
      </div>
    </div>
  );
};

const page = ({ params }: ProductDetailProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppContainer className="my-6 w-full sm:my-12">
        <ProductDetail params={params} />
      </AppContainer>
    </Suspense>
  );
};

export default page;
