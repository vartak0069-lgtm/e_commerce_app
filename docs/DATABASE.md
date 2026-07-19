# Database Schema

Database: PostgreSQL via Supabase (free tier)

Run `database/schema.sql` in one shot in the Supabase SQL Editor, OR run the
files in `database/migrations/` in numeric order (001, 002, 003...) if you
prefer step-by-step migrations. Then run `database/seeds/seed.sql` for sample data.

## Tables
- **users** - accounts, roles (customer/admin), email verification, password reset
- **addresses** - saved delivery addresses per user
- **categories** - product categories (supports parent_id for subcategories)
- **products** - catalog items, price, discount price, stock, images (JSONB array)
- **product_variants** - size/color variants per product
- **inventory_logs** - audit trail of stock changes
- **carts / cart_items** - one cart per user, line items reference products
- **coupons** - percentage/flat discount codes with usage limits
- **orders / order_items** - order header + line items snapshot
- **payments** - Razorpay order/payment IDs and status
- **reviews** - one review per user per product, 1-5 rating
- **wishlist_items** - saved-for-later products per user

## Notes
- All primary keys are UUIDs (`uuid_generate_v4()`)
- `updated_at` columns auto-update via triggers
- Stock is decremented only after successful payment verification (see `paymentController.js`)
