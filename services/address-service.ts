import { http } from '@/lib/axios';
import { Address, AddressPayload, ApiResponse } from '@/types';

export const addressService = {
  getAll: async (): Promise<ApiResponse<Address[]>> => {
    return await http.get('/addresses');
  },
  getById: async (id: number): Promise<ApiResponse<Address>> => {
    return await http.get(`/addresses/${id}`);
  },
  create: async (payload: AddressPayload): Promise<ApiResponse<Address>> => {
    return await http.post('/addresses', payload);
  },
  update: async (id: number, payload: Partial<AddressPayload>) => {
    return await http.patch(`/addresses/${id}`, payload);
  },
  delete: async (id: number) => {
    return await http.delete(`/addresses/${id}`);
  },
};
