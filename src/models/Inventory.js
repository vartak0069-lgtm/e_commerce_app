const supabase = require('../config/database');
const TABLE = 'inventory_logs';

async function logChange(productId, changeQuantity, reason) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ product_id: productId, change_quantity: changeQuantity, reason })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function findByProduct(productId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

module.exports = { logChange, findByProduct };
