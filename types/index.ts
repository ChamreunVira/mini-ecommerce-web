import { CategoryStatus, OrderStatus, PaymentMethod, PaymentStatus } from '@/constant';

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T;
  timestampt: string;
}

/** Laravel paginator wrapped in ApiResponse */
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

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
  /** Category name string (from ProductResource) */
  category: string;
  quantity: number;
}

/** Used in admin forms where we need the category_id integer */
export interface ProductWithCategoryId extends Product {
  category_id?: number;
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

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: string;
  total: string;
  created_at: string;
  items: OrderItem[];
  address: OrderAddress | null;
  payment: Payment | null;
}

export interface Payment {
  id: number;
  transaction_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;
  currency: 'USD';
  qr_string: string;
  qr_expiry: string;
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

// ── Admin payload types ──────────────────────────────────────────────────────

export interface ProductPayload {
  name: string;
  price: string | number;
  quantity: string | number;
  category_id: string | number;
  description?: string;
}

export interface CategoryPayload {
  name: string;
}

export interface CategoryUpdatePayload extends CategoryPayload {
  description?: string;
  status?: CategoryStatus;
}

export interface OrderStatusPayload {
  status: OrderStatus;
}
