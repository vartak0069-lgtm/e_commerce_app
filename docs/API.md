# API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <accessToken>`

## Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and get tokens |
| POST | /auth/refresh | Get a new access token |
| POST | /auth/forgot-password | Request password reset email |
| POST | /auth/reset-password | Reset password with token |
| GET | /auth/verify-email/:token | Verify email address |
| GET | /auth/me | Get current logged-in user |

## Products
| Method | Endpoint | Description |
|---|---|---|
| GET | /products | List products (supports ?page, limit, category, search, minPrice, maxPrice) |
| GET | /products/featured | Get featured products |
| GET | /products/:slug | Get single product by slug |
| POST | /products | Create product (admin) |
| PUT | /products/:id | Update product (admin) |
| DELETE | /products/:id | Delete product (admin) |

## Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | /categories | List all categories |
| GET | /categories/:slug | Get category by slug |
| POST/PUT/DELETE | /categories | Admin management |

## Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | /cart | Get current user's cart |
| POST | /cart/items | Add item to cart |
| PUT | /cart/items/:itemId | Update item quantity |
| DELETE | /cart/items/:itemId | Remove item |
| DELETE | /cart | Clear cart |

## Checkout & Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | /checkout/initiate | Create order + Razorpay order (test mode) |
| POST | /payments/verify | Verify Razorpay payment signature |
| POST | /payments/failed | Mark payment as failed |

## Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | /orders | Get logged-in user's orders |
| GET | /orders/:id | Get order details |
| PATCH | /orders/:id/cancel | Cancel an order |

## Reviews / Wishlist / Addresses / Coupons / Search
See routes in `src/routes/` for full list - all follow standard REST conventions.

## Admin (all require admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | /admin/orders | List all orders |
| PATCH | /admin/orders/:id/status | Update order status |
| GET | /admin/users | List all users |
| PATCH | /admin/users/:id/role | Change user role |
| GET/POST/PUT/DELETE | /admin/coupons | Manage coupons |
| GET/POST | /admin/inventory/:productId | View/restock inventory |
| GET | /admin/analytics/sales | Sales summary |
| GET | /admin/analytics/top-products | Top-selling products |
