const supabase = require('../config/database');

const TABLE = 'products';

async function create(productData) {
  const { data, error } = await supabase.from(TABLE).insert(productData).select().single();
  if (error) throw error;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase.from(TABLE).select('*, categories(name, slug)').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

async function findBySlug(slug) {
  const { data, error } = await supabase.from(TABLE).select('*, categories(name, slug)').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}

async function findAll({ from, to, categoryId, search, minPrice, maxPrice, sortBy = 'created_at', sortOrder = 'desc' } = {}) {
  let query = supabase.from(TABLE).select('*, categories(name, slug)', { count: 'exact' }).eq('is_active', true);

  if (categoryId) query = query.eq('category_id', categoryId);
  if (search) query = query.ilike('name', `%${search}%`);
  if (minPrice) query = query.gte('price', minPrice);
  if (maxPrice) query = query.lte('price', maxPrice);

  query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  if (from !== undefined && to !== undefined) query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

async function findFeatured(limit = 8) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(limit);
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

async function decrementStock(id, quantity) {
  const { data, error } = await supabase.rpc('decrement_stock', { p_id: id, qty: quantity });
  if (error) {
    // fallback if RPC not created: manual read-then-write (not fully atomic, fine for small projects)
    const product = await findById(id);
    if (!product) throw new Error('Product not found');
    const newStock = Math.max(0, product.stock_quantity - quantity);
    return update(id, { stock_quantity: newStock });
  }
  return data;
}

module.exports = { create, findById, findBySlug, findAll, findFeatured, update, remove, decrementStock };
