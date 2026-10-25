import { http } from '@/lib/axios';
import { ApiResponse, Order, OrderStatusPayload, PaginatedResponse } from '@/types';

export const orderService = {
  create: async (payload: { address_id: number }): Promise<ApiResponse<Order>> => {
    return await http.post('/order', payload);
  },
  /** Admin: list all orders paginated */
  getAll: async (page = 1): Promise<PaginatedResponse<Order>> => {
    return await http.get(`/order?page=${page}`);
  },
  /** Admin: get single order detail */
  getById: async (id: number): Promise<ApiResponse<Order>> => {
    return await http.get(`/order/${id}`);
  },
  /** Admin: update order status */
  updateStatus: async (id: number, payload: OrderStatusPayload): Promise<ApiResponse<Order>> => {
    return await http.patch(`/order/${id}/status`, payload);
  },
  /** Admin: delete an order */
  deleteOrder: async (id: number): Promise<ApiResponse<null>> => {
    return await http.delete(`/order/${id}`);
  },
};
