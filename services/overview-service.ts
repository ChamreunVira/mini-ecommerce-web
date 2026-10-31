import { http } from '@/lib/axios';
import type { ApiResponse, OverviewResponse } from '@/types';

export const overviewService = {
  get: async (): Promise<ApiResponse<OverviewResponse>> => {
    return await http.get('/overview');
  },
};
