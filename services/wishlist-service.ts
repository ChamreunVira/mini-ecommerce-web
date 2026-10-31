import { http } from '@/lib/axios';
import type { ApiResponse, WishlistItem } from '@/types';

export const wishlistService = {
  getAll: async (): Promise<ApiResponse<WishlistItem[]>> => http.get('/wishlist'),
  add: async (productId: number): Promise<ApiResponse<WishlistItem>> =>
    http.post('/wishlist', { product_id: productId }),
  remove: async (wishlistId: number): Promise<ApiResponse<null>> => http.delete(`/wishlist/${wishlistId}`),
};
