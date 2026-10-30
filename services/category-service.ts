import { http } from '@/lib/axios';
import { ApiResponse, Category, CategoryPayload } from '@/types';

export const categoryService = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return await http.get('/categories');
  },
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    return await http.get(`/categories/${id}`);
  },
  create: async (payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    return await http.post('/categories', payload);
  },
  update: async (id: number, payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    return await http.put(`/categories/${id}`, payload);
  },
  toggleStatus: async (id: number): Promise<ApiResponse<Category>> => {
    return await http.delete(`/categories/${id}`);
  },
};
