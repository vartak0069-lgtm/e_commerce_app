const supabase = require('../config/database');
const TABLE = 'cart_items';

async function findByCart(cartId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, products(id, name, slug, price, discount_price, images, stock_quantity)')
    .eq('cart_id', cartId);
  if (error) throw error;
  return data;
}

async function findOne(cartId, productId, variantId = null) {
  let query = supabase.from(TABLE).select('*').eq('cart_id', cartId).eq('product_id', productId);
  query = variantId ? query.eq('variant_id', variantId) : query.is('variant_id', null);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

async function add(cartId, productId, quantity, variantId = null) {
  const existing = await findOne(cartId, productId, variantId);
  if (existing) {
    return updateQuantity(existing.id, existing.quantity + quantity);
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ cart_id: cartId, product_id: productId, quantity, variant_id: variantId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateQuantity(itemId, quantity) {
  const { data, error } = await supabase.from(TABLE).update({ quantity }).eq('id', itemId).select().single();
  if (error) throw error;
  return data;
}

async function remove(itemId) {
  const { error } = await supabase.from(TABLE).delete().eq('id', itemId);
  if (error) throw error;
  return true;
}

async function clearCart(cartId) {
  const { error } = await supabase.from(TABLE).delete().eq('cart_id', cartId);
  if (error) throw error;
  return true;
}

module.exports = { findByCart, findOne, add, updateQuantity, remove, clearCart };
