import { http } from '@/lib/axios';
import { ApiResponse, Cart, CartItem } from '@/types';

interface AddToCartPaylaod {
  product_id: number;
  quantity?: number;
}

export const cartService = {
  get: async (): Promise<ApiResponse<Cart>> => {
    return await http.get('/cart');
  },
  add: async (paylaod: AddToCartPaylaod): Promise<ApiResponse<Cart>> => {
    return await http.post('/cart/items', paylaod);
  },
  adjust: async (itemId: number, paylaod: { quantity: number }): Promise<ApiResponse<CartItem>> => {
    if (paylaod.quantity < 1) {
      throw Error('Quantity must be greater than zero.');
    }
    return await http.patch(`/cart/items/${itemId}`, paylaod);
  },
  remove: async (itemId: number): Promise<ApiResponse<Cart>> => {
    return await http.delete(`/cart/items/${itemId}`);
  },
};
