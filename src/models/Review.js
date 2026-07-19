const supabase = require('../config/database');
const TABLE = 'reviews';

async function create(reviewData) {
  const { data, error } = await supabase.from(TABLE).insert(reviewData).select().single();
  if (error) throw error;
  return data;
}

async function findByProduct(productId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, users(name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function findOneByUserProduct(userId, productId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
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

async function getAverageRating(productId) {
  const { data, error } = await supabase.from(TABLE).select('rating').eq('product_id', productId);
  if (error) throw error;
  if (!data.length) return { avg: 0, count: 0 };
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  return { avg: Number(avg.toFixed(1)), count: data.length };
}

module.exports = { create, findByProduct, findOneByUserProduct, update, remove, getAverageRating };
