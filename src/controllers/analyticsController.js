const asyncHandler = require('../middleware/asyncHandler');
const analyticsService = require('../services/analyticsService');

// GET /api/admin/analytics/sales (admin)
const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const summary = await analyticsService.getSalesSummary(startDate, endDate);
  res.json({ success: true, data: summary });
});

// GET /api/admin/analytics/top-products (admin)
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await analyticsService.getTopProducts(Number(req.query.limit) || 5);
  res.json({ success: true, data: products });
});

module.exports = { getSalesReport, getTopProducts };
