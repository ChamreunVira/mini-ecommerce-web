import { http } from '@/lib/axios';
import { ApiResponse, CreatedPayment, Payment, PaymentPayload, PaymentStatusResponse } from '@/types';

export const paymentService = {
  getAll: async (): Promise<ApiResponse<Payment[]>> => {
    return await http.get('/payment');
  },
  check: async (transactionId: string): Promise<ApiResponse<PaymentStatusResponse>> => {
    return await http.get(`/payment/${transactionId}/status`);
  },
  create: async (paylaod: PaymentPayload): Promise<ApiResponse<CreatedPayment>> => {
    return await http.post('/payment', paylaod);
  },
};
