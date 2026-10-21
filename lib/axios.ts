import axios from 'axios';
import { onRequest, onRequestError, onResponse, onResponseError } from './interceptors';

const BASE_URL = 'http://localhost:8000/api';

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
