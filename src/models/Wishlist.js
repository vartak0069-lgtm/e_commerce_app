const supabase = require('../config/database');
const TABLE = 'wishlist_items';

async function findByUser(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, products(id, name, slug, price, discount_price, images, stock_quantity)')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

async function add(userId, productId) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();
  if (error && error.code !== '23505') throw error; // ignore duplicate
  return data;
}

async function remove(userId, productId) {
  const { error } = await supabase.from(TABLE).delete().eq('user_id', userId).eq('product_id', productId);
  if (error) throw error;
  return true;
}

module.exports = { findByUser, add, remove };
