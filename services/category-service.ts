import { http } from "@/lib/axios";
import { ApiResponse, Category, CategoryPayload, CategoryUpdatePayload } from "@/types";

export const categoryService = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return await http.get("/categories");
  },
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    return await http.get(`/categories/${id}`);
  },
  /** Admin: create category */
  create: async (payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    return await http.post("/categories", payload);
  },
  /** Admin: update category */
  update: async (id: number, payload: CategoryUpdatePayload): Promise<ApiResponse<Category>> => {
    return await http.put(`/categories/${id}`, payload);
  },
  /** Admin: toggle status (backend DELETE endpoint toggles active ↔ inactive) */
  toggleStatus: async (id: number): Promise<ApiResponse<Category>> => {
    return await http.delete(`/categories/${id}`);
  },
};
