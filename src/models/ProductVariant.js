const supabase = require('../config/database');
const TABLE = 'product_variants';

async function findByProduct(productId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('product_id', productId);
  if (error) throw error;
  return data;
}

async function create(variantData) {
  const { data, error } = await supabase.from(TABLE).insert(variantData).select().single();
  if (error) throw error;
  return data;
}

async function update(id, updates) {
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function remove(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
  return true;
}

module.exports = { findByProduct, create, update, remove };
