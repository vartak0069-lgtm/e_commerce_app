const supabase = require('../config/database');
const TABLE = 'coupons';

async function findByCode(code) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('code', code.toUpperCase()).maybeSingle();
  if (error) throw error;
  return data;
}

async function findAll() {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function create(couponData) {
  const { data, error } = await supabase.from(TABLE).insert(couponData).select().single();
  if (error) throw error;
  return data;
}

async function incrementUsage(id) {
  const { data: coupon, error: fetchErr } = await supabase.from(TABLE).select('used_count').eq('id', id).single();
  if (fetchErr) throw fetchErr;
  const { data, error } = await supabase
    .from(TABLE)
    .update({ used_count: (coupon.used_count || 0) + 1 })
    .eq('id', id)
    .select()
    .single();
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

module.exports = { findByCode, findAll, create, incrementUsage, update, remove };
