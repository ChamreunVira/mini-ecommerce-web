'use client';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Minus, Plus, ShoppingBasket, ShoppingCart, Trash } from 'lucide-react';
import { useAppContext } from '@/context/AppContextProvider';
import { Button } from './ui/button';
import Image from 'next/image';
import { CartItem } from '@/types';
import { useRouter } from 'next/navigation';
import { getProductImageUrl } from '@/lib/product';

export const CartDrawer = () => {
  const router = useRouter();

  const { cart, removeCartItem, adjustCartItem } = useAppContext();
  const calculate = (items: CartItem[]) => {
    const totalPrice = items.reduce((total, item) => (total += item.product.price * item.quantity), 0);
    return totalPrice;
  };
  return (
    <>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <div className="relative">
            <ShoppingCart size={28} className="cursor-pointer rounded-full p-1 hover:bg-gray-100" />
            <div className="absolute top-0 right-0 w-3 h-3 flex items-center justify-center rounded-full bg-rose-500">
              <p className="text-white text-xs">{cart?.items.length ?? 0}</p>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-2xl font-medium">
              <ShoppingCart size={24} /> Cart
            </DrawerTitle>
          </DrawerHeader>
          <div className="h-full p-4 flex flex-col">
            <h2 className="mb-4 text-[16px] font-medium">Items</h2>
            {cart && cart.items.length > 0 ? (
              <>
                <div className="flex-1 flex flex-col space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="px-3 py-2 border rounded flex justify-between items-center">
                      <div className="flex">
                        <Image
                          width={60}
                          height={60}
                          src={getProductImageUrl(item.product.image)}
                          alt={item.product.name}
                          unoptimized
                        />
                        <div className="flex flex-col justify-center gap-0.5 leading-loose">
                          <h2 className="font-medium">{item.product.name}</h2>
                          <div className="flex items-center gap-4">
                            <div className="flex justify-center items-center space-x-2 *:p-1 *:w-6 *:h-6">
                              <button
                                onClick={() => adjustCartItem(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="flex items-center justify-center rounded bg-gray-100 text-2xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Decrease ${item.product.name} quantity`}
                              >
                                <Minus size={14} />
                              </button>
                              <div className="flex items-center justify-center rounded bg-gray-100 text-xs">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() => adjustCartItem(item.id, 1)}
                                className="flex items-center justify-center rounded bg-gray-100 text-2xl cursor-pointer"
                                aria-label={`Increase ${item.product.name} quantity`}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="text-[14px] text-rose-500 font-medium">${item.product.price}</p>
                              <p className="text-xs text-gray-800 bg-gray-100 px-0.5">*{item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Trash
                        onClick={() => removeCartItem(item.id)}
                        size={24}
                        className="text-rose-500 p-1 bg-gray-100 rounded-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Sub Total:</h2>
                    <p>${calculate(cart.items)}</p>
                  </div>
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Fee:</h2>
                    <p>$0</p>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Total:</h2>
                    <p className="font-medium text-rose-500">${calculate(cart.items)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col space-y-4 items-center">
                  <ShoppingCart />
                  <h2 className="text-xl text-gray-800">Cart is Empty.</h2>
                </div>
              </div>
            )}
          </div>
          <DrawerFooter>
            <Button onClick={() => router.push('/checkout')}>
              <ShoppingBasket /> Checkout
            </Button>
            <DrawerClose asChild>
              <Button variant="destructive">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
