import { http } from '@/lib/axios';
import { ApiResponse, Cart } from '@/types';

interface AddToCartPaylaod {
  product_id: number;
  quantity?: number;
}

export const cartService = {
  get: async (): Promise<ApiResponse<Cart>> => {
    return await http.get('/cart');
  },
  add: async (paylaod: AddToCartPaylaod): Promise<ApiResponse<Cart>> => {
    return await http.post('/cart/add', paylaod);
  },
};
