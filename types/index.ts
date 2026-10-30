import { CategoryStatus, OrderStatus, PaymentMethod, PaymentStatus } from '@/constant';

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T;
  timestampt: string;
}

export interface PaginationMeta {
  current_page: number;
  limit: number;
  total: number;
  last_page: number;
  has_more_pages: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
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

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category_id: number;
  image: File;
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

export type CartItem = {
  id: number;
  product: Pick<Product, 'name' | 'price'> & { image: string };
  quantity: number;
};

export interface Address extends BaseEntity {
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  is_default: boolean;
}

export type AddressPayload = Omit<Address, 'id' | 'created_at' | 'updated_at'>;

export interface OrderAddress {
  id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order extends BaseEntity {
  order_number: string;
  status: OrderStatus;
  subtotal: string;
  total: string;
  created_at: string;
  items: OrderItem[];
  address: OrderAddress | null;
  payment: Payment | null;
}

export interface Payment extends BaseEntity {
  transaction_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;
  currency: 'USD';
}

export interface PaymentStatusResponse {
  id: number;
  transaction_id: string;
  status: PaymentStatus;
}

export interface PaymentPayload {
  order_id: number;
  method: PaymentMethod;
}

export type CreatedPayment = Omit<Payment, 'md5' | 'created_at' | 'updated_at'>;

export interface CategoryPayload {
  name: string;
  description?: string;
  status: boolean;
}

export interface OrderStatusPayload {
  status: OrderStatus;
}
