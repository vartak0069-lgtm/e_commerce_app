const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { NotFoundError, ValidationError } = require('../utils/errors');

// GET /api/admin/inventory/:productId (admin)
const getProductInventory = asyncHandler(async (req, res) => {
  const logs = await Inventory.findByProduct(req.params.productId);
  res.json({ success: true, data: logs });
});

// POST /api/admin/inventory/:productId/restock (admin)
const restockProduct = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity <= 0) throw new ValidationError('Quantity must be positive');

  const product = await Product.findById(req.params.productId);
  if (!product) throw new NotFoundError('Product not found');

  const updated = await Product.update(req.params.productId, {
    stock_quantity: product.stock_quantity + Number(quantity),
  });
  await Inventory.logChange(req.params.productId, Number(quantity), 'restock');

  res.json({ success: true, data: updated });
});

module.exports = { getProductInventory, restockProduct };
