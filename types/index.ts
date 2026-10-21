import { CategoryStatus } from '@/constant';

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T;
  timestampt: string;
}

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface UserResponse extends BaseEntity {
  name: string;
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type AuthPaylaod = Omit<RegisterPayload, 'name'>;

export interface AuthResponse {
  user: UserResponse;
  token: string;
  token_type: string;
}

export interface Product extends BaseEntity {
  name: string;
  description?: string;
  image_url: string;
  price: number;
  category: string;
  quantity: number;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  status: CategoryStatus;
}

export interface Cart extends BaseEntity {
  items: CartItem[];
}

type CartItem = {
  product: Pick<Product, 'name' | 'price'> & { image: string };
  quantity: number;
};
