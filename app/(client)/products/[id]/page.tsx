import { AppContainer } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product-service";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const { id } = await params;

  const response = await productService.getById(Number(id));
  const product = response.data;

  return (
    <div className="w-full flex justify-between">
      {/* product images slide */}
      <div className="w-1/2 flex justify-center rounded bg-gray-50">
        <Image
          width={500}
          height={500}
          src={`http://localhost:8000/storage/${product?.image_url}`}
          alt="product_detail_primary"
          unoptimized
        />
      </div>
      {/* product info */}
      <div className="w-1/2 p-8 flex flex-col space-y-10">
        <h1 className="text-3xl">{product?.name}</h1>
        <p className="text-[16px] text-gray-800">
          {product?.description ??
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit ut repellat accusamus similique maiores ea deserunt odio error vero accusantium!"}
        </p>
        <div>
          <p className="text-xl text-rose-500 font-medium">
            $ {product?.price}
          </p>
        </div>
        <table>
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
        {/* stock control */}
        <div>
          <button className="w-10 h-10 bg-gray-100 cursor-pointer rounded text-2xl">
            -
          </button>
          <input
            type="text"
            defaultValue={1}
            width={2}
            className="w-10 h-10 text-xl text-center"
          />
          <button className="w-10 h-10 bg-gray-100 cursor-pointer rounded text-2xl">
            +
          </button>
        </div>
        <Button className="w-full h-12">
          <ShoppingBag />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

const page = ({ params }: ProductDetailProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppContainer className="my-12 w-full h-[90vh]">
        <ProductDetail params={params} />
      </AppContainer>
    </Suspense>
  );
};

export default page;
