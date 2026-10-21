import { http } from "@/lib/axios";
import { ApiResponse, Category } from "@/types";

export const categoryService = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return await http.get("/categories");
  },
};
