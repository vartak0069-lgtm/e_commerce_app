-- Sample seed data

INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Phones, laptops, gadgets'),
('Fashion', 'fashion', 'Clothing and accessories'),
('Home & Kitchen', 'home-kitchen', 'Home essentials'),
('Books', 'books', 'Books and stationery')
ON CONFLICT (slug) DO NOTHING;

-- Sample admin user (password: Admin@123 -> bcrypt hash below, hash with your own script before real use)
-- Use scripts/hashPassword.js to generate real hash, this is just a placeholder
INSERT INTO users (name, email, password, role, is_verified) VALUES
('Admin User', 'admin@example.com', '$2a$10$placeholderHashReplaceThis', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Sample products
INSERT INTO products (name, slug, description, category_id, price, discount_price, sku, stock_quantity, is_active, is_featured)
SELECT
  'Wireless Bluetooth Earbuds', 'wireless-bluetooth-earbuds',
  'High quality wireless earbuds with noise cancellation',
  (SELECT id FROM categories WHERE slug='electronics'),
  1999.00, 1499.00, 'ELEC-001', 50, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug='wireless-bluetooth-earbuds');

INSERT INTO products (name, slug, description, category_id, price, discount_price, sku, stock_quantity, is_active, is_featured)
SELECT
  'Cotton Casual T-Shirt', 'cotton-casual-tshirt',
  'Comfortable 100% cotton t-shirt',
  (SELECT id FROM categories WHERE slug='fashion'),
  599.00, 399.00, 'FASH-001', 100, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug='cotton-casual-tshirt');

-- Sample coupon
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, usage_limit, valid_from, valid_until, is_active)
VALUES ('WELCOME10', 'percentage', 10, 500, 100, NOW(), NOW() + INTERVAL '90 days', TRUE)
ON CONFLICT (code) DO NOTHING;
