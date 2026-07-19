const supabase = require('../config/database');
const TABLE = 'addresses';

async function create(addressData) {
  const { data, error } = await supabase.from(TABLE).insert(addressData).select().single();
  if (error) throw error;
  return data;
}

async function findByUser(userId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', userId).order('is_default', { ascending: false });
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

async function unsetDefaultForUser(userId) {
  const { error } = await supabase.from(TABLE).update({ is_default: false }).eq('user_id', userId);
  if (error) throw error;
  return true;
}

module.exports = { create, findByUser, findById, update, remove, unsetDefaultForUser };
