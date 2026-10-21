import { clearToken, getToken } from '@/utils/tokenManager';
import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const onRequest = (config: InternalAxiosRequestConfig) => {
  // console.log(`[request] [${JSON.stringify(config)}]`);
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const onRequestError = (error: AxiosError): AxiosError => {
  console.log(`[error] [${JSON.stringify(error)}]`);
  return error;
};

export const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.log(`[response] [${JSON.stringify(response)}]`);
  return response.data;
};

export const onResponseError = (error: AxiosError): AxiosError => {
  console.log(`[response error] [${JSON.stringify(error)}]`);
  if (error.response) {
    const { status } = error.response;

    switch (status) {
      case 401:
        clearToken();
        console.error('Unauthorized! Redirecting to login...');
        break;
      case 403:
        console.error('Forbidden! You do not have access.');
        break;
      case 500:
        console.error('Internal Server Error. Please try again later.');
        break;
      default:
        console.error(`API Error: ${status}`);
    }
  } else if (error.request) {
    console.error('Network error. Please check your connection.');
  } else {
    console.error('Request Error:', error.message);
  }

  return error;
};

// export function setupInterceptorsTo(
//   axiosInstance: AxiosInstance,
// ): AxiosInstance {
//   axiosInstance.interceptors.request.use(onRequest, onRequestError);
//   axiosInstance.interceptors.response.use(onResponse, onResponseError);
//   return axiosInstance;
// }
