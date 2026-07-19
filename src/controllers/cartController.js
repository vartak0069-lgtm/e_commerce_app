const asyncHandler = require('../middleware/asyncHandler');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../utils/errors');

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOrCreateByUser(req.user.id);
  const items = await CartItem.findByCart(cart.id);

  const subtotal = items.reduce((sum, item) => {
    const price = item.products.discount_price || item.products.price;
    return sum + price * item.quantity;
  }, 0);

  res.json({ success: true, data: { cartId: cart.id, items, subtotal: Number(subtotal.toFixed(2)) } });
});

// POST /api/cart/items
const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variantId } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new NotFoundError('Product not found');
  if (product.stock_quantity < quantity) throw new ValidationError('Not enough stock available');

  const cart = await Cart.findOrCreateByUser(req.user.id);
  const item = await CartItem.add(cart.id, productId, quantity, variantId);

  res.status(201).json({ success: true, data: item });
});

// PUT /api/cart/items/:itemId
const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) throw new ValidationError('Quantity must be at least 1');
  const item = await CartItem.updateQuantity(req.params.itemId, quantity);
  res.json({ success: true, data: item });
});

// DELETE /api/cart/items/:itemId
const removeItem = asyncHandler(async (req, res) => {
  await CartItem.remove(req.params.itemId);
  res.json({ success: true, message: 'Item removed from cart' });
});

// DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOrCreateByUser(req.user.id);
  await CartItem.clearCart(cart.id);
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
