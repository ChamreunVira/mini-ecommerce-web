import { CartItem } from '@/types';

export const calculate = (items: CartItem[]) => {
  const totalPrice = items.reduce((total, item) => (total += item.product.price * item.quantity), 0);
  return totalPrice;
};
