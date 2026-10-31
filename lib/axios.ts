import axios from 'axios';
import { isAxiosError } from 'axios';
import { onRequest, onRequestError, onResponse, onResponseError } from './interceptors';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api';

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 3000,
});

http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);

export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }
  return fallbackMessage;
};
