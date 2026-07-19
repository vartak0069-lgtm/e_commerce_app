const supabase = require('../config/database');
const TABLE = 'order_items';

async function bulkCreate(items) {
  const { data, error } = await supabase.from(TABLE).insert(items).select();
  if (error) throw error;
  return data;
}

async function findByOrder(orderId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('order_id', orderId);
  if (error) throw error;
  return data;
}

module.exports = { bulkCreate, findByOrder };
