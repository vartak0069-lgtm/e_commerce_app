const supabase = require('../config/database');

// Basic in-house analytics using Supabase queries - no paid analytics service needed.
async function getSalesSummary(startDate, endDate) {
  let query = supabase.from('orders').select('total_amount, status, created_at').eq('payment_status', 'paid');
  if (startDate) query = query.gte('created_at', startDate);
  if (endDate) query = query.lte('created_at', endDate);

  const { data, error } = await query;
  if (error) throw error;

  const totalRevenue = data.reduce((sum, o) => sum + Number(o.total_amount), 0);
  return { totalOrders: data.length, totalRevenue: Number(totalRevenue.toFixed(2)) };
}

async function getTopProducts(limit = 5) {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity');
  if (error) throw error;

  const grouped = {};
  for (const item of data) {
    if (!grouped[item.product_id]) grouped[item.product_id] = { name: item.product_name, totalSold: 0 };
    grouped[item.product_id].totalSold += item.quantity;
  }
  return Object.values(grouped).sort((a, b) => b.totalSold - a.totalSold).slice(0, limit);
}

module.exports = { getSalesSummary, getTopProducts };
