import { clearToken, getToken } from '@/utils/tokenManager';
import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const onRequest = (config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const onRequestError = (error: AxiosError): Promise<never> => {
  console.error('[API Request Error]:', error.message);
  return Promise.reject(error);
};

export const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data;
};

export const onResponseError = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const { status } = error.response;
    const url = error.config?.url ?? 'unknown';

    switch (status) {
      case 401:
        clearToken();
        console.error(`[API 401 Unauthorized] ${url}`);
        break;
      case 403:
        console.error(`[API 403 Forbidden] ${url}`);
        break;
      case 404:
        console.error(`[API 404 Not Found] ${url}`);
        break;
      case 500:
        console.error(`[API 500 Server Error] ${url}`);
        break;
      default:
        console.error(`[API Error ${status}] ${url}`);
    }
  } else if (error.request) {
    console.error('[API Network Error]: Unable to reach server. Check your connection or API URL.');
  } else {
    console.error('[API Error]:', error.message);
  }

  return Promise.reject(error);
};
