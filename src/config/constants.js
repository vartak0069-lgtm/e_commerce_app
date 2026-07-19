module.exports = {
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  USER_ROLES: {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
  },
  SHIPPING_CHARGE: 49,
  FREE_SHIPPING_THRESHOLD: 999,
  TAX_RATE: 0.05, // 5% GST example
  DEFAULT_PAGE_SIZE: 12,
};
