export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMFIRMED = 'comfirmed',
  SHIPPED = 'shipped',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  KHQR = 'khqr',
  COD = 'cod',
}

export enum PaymentStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  PAID = 'paid',
  REFUNDED = 'refunded',
}
