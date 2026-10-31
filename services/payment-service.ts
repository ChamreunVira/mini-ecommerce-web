import { http } from '@/lib/axios';
import { PaymentStatus } from '@/constant';
import {
  ApiResponse,
  CreatedPayment,
  Payment,
  PaymentListResponse,
  PaymentPayload,
  PaymentStatusResponse,
} from '@/types';

export const paymentService = {
  getAll: async (): Promise<PaymentListResponse> => {
    return await http.get('/payment');
  },

  check: async (transactionId: string): Promise<ApiResponse<PaymentStatusResponse>> => {
    return await http.get(`/payment/${transactionId}/status`);
  },

  updateStatus: async (id: number, status: PaymentStatus): Promise<ApiResponse<Payment>> => {
    return await http.patch(`/payment/${id}/status`, { status });
  },

  create: async (paylaod: PaymentPayload): Promise<ApiResponse<CreatedPayment>> => {
    return await http.post('/payment', paylaod);
  },
};
