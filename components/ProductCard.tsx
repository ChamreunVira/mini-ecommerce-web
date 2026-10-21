'use client';
import { Product } from '@/types';
import { ShoppingBag } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { cartService } from '@/services/cart-service';
import { useAppContext } from '@/context/AppContextProvider';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useAppContext();
  return (
    <div className="group border rounded overflow-hidden">
      <img
        onClick={() => router.push(`/products/${product.id}`)}
        className="object-cover w-full h-60 aspect-square group-hover:scale-105 transition-transform duration-300"
        src={`http://localhost:8000/storage/${product.image_url}`}
        alt={product.name}
      />
      <div className="p-2">
        <h1 className="font-medium group-hover:underline text-xl py-1 truncate">{product.name}</h1>
        <div className="bg-emerald-100 inline-flex px-2 rounded-sm">
          <p className="text-xs text-emerald-600">{product.quantity > 0 ? 'Available' : 'Out of Stock'}</p>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-xl text-rose-600">${product.price}</h3>
          <Button size="sm" onClick={() => addToCart(product.id)}>
            <ShoppingBag size={16} />
            Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
