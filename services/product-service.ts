import { http } from "@/lib/axios";
import { ApiResponse, Product } from "@/types";

export const productService = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    return await http.get("/products");
  },
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    return await http.get(`/products/${id}`);
  },
  /** Admin: create product with image upload */
  create: async (formData: FormData): Promise<ApiResponse<Product>> => {
    return await http.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  /** Admin: update product — Laravel needs _method=PUT for multipart PATCH/PUT */
  update: async (id: number, formData: FormData): Promise<ApiResponse<Product>> => {
    formData.append("_method", "PUT");
    return await http.post(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  /** Admin: delete product */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    return await http.delete(`/products/${id}`);
  },
};
