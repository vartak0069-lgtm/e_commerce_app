const supabase = require('../config/database');

const TABLE = 'users';

async function create(userData) {
  const { data, error } = await supabase.from(TABLE).insert(userData).select().single();
  if (error) throw error;
  return data;
}

async function findByEmail(email) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('email', email).maybeSingle();
  if (error) throw error;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
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

async function findAll({ from, to } = {}) {
  let query = supabase.from(TABLE).select('id, name, email, phone, role, is_verified, created_at', { count: 'exact' });
  if (from !== undefined && to !== undefined) query = query.range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

module.exports = { create, findByEmail, findById, update, remove, findAll };
