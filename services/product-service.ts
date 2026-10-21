import { http } from "@/lib/axios";
import { ApiResponse, Product } from "@/types";

export const productService = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    return await http.get("/products");
  },
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    return await http.get(`/products/${id}`);
  },
};
