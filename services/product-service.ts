import { http } from '@/lib/axios';
import { ApiResponse, PaginatedResponse, Product, ProductPayload } from '@/types';

const MULTIPART_CONFIG = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

const buildProductFormData = (payload: ProductPayload): FormData => {
  const formData = new FormData();

  formData.append('name', payload.name);
  formData.append('description', payload.description ?? '');
  formData.append('price', String(payload.price));
  formData.append('quantity', String(payload.quantity));
  formData.append('category_id', String(payload.category_id));

  if (payload.image) {
    formData.append('image', payload.image);
  }

  return formData;
};

export const productService = {
  getAll: async (params): Promise<PaginatedResponse<Product>> => {
    return await http.get('/products', {
      params,
    });
  },
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    return await http.get(`/products/${id}`);
  },
  create: async (payload: ProductPayload): Promise<ApiResponse<Product>> => {
    return await http.post('/product', buildProductFormData(payload), MULTIPART_CONFIG);
  },
  update: async (id: number, payload: ProductPayload): Promise<ApiResponse<Product>> => {
    const formData = buildProductFormData(payload);
    formData.append('_method', 'PUT');
    return await http.post(`/product/${id}`, formData, MULTIPART_CONFIG);
  },
  delete: async (id: number): Promise<ApiResponse<null>> => {
    return await http.delete(`/products/${id}`);
  },
};
