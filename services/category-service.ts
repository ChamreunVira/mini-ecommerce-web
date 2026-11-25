import { http } from '@/lib/axios';
import { ApiResponse, Category, CategoryPayload } from '@/types';

const MULTIPART_CONFIG = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

const buildCategoryFormData = (payload: CategoryPayload): FormData => {
  const formData = new FormData();
  formData.append('name', payload.name);
  if (payload.description) {
    formData.append('description', payload.description);
  }
  formData.append('status', payload.status);
  if (payload.image) {
    formData.append('image', payload.image);
  }
  return formData;
};

export const categoryService = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return await http.get('/categories');
  },
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    return await http.get(`/categories/${id}`);
  },
  create: async (payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    return await http.post('/categories', buildCategoryFormData(payload), MULTIPART_CONFIG);
  },
  update: async (id: number, payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    const formData = buildCategoryFormData(payload);
    formData.append('_method', 'PUT');
    return await http.post(`/categories/${id}`, formData, MULTIPART_CONFIG);
  },
  toggleStatus: async (id: number): Promise<ApiResponse<Category>> => {
    return await http.delete(`/categories/${id}`);
  },
};
