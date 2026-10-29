import { http } from '@/lib/axios';
import { ApiResponse, Order, OrderStatusPayload, PaginatedResponse } from '@/types';

export const orderService = {
  create: async (payload: { address_id: number }): Promise<ApiResponse<Order>> => {
    return await http.post('/order', payload);
  },
  getAll: async (params): Promise<PaginatedResponse<Order>> => {
    return await http.get(`/order`, {
      params,
    });
  },
  getById: async (id: number): Promise<ApiResponse<Order>> => {
    return await http.get(`/order/${id}`);
  },
  updateStatus: async (id: number, payload: OrderStatusPayload): Promise<ApiResponse<Order>> => {
    return await http.patch(`/order/${id}/status`, payload);
  },
  deleteOrder: async (id: number): Promise<ApiResponse<null>> => {
    return await http.delete(`/order/${id}`);
  },
};
