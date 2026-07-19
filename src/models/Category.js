const supabase = require('../config/database');
const TABLE = 'categories';

async function create(data) {
  const { data: row, error } = await supabase.from(TABLE).insert(data).select().single();
  if (error) throw error;
  return row;
}

async function findAll() {
  const { data, error } = await supabase.from(TABLE).select('*').order('name');
  if (error) throw error;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

async function findBySlug(slug) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('slug', slug).maybeSingle();
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

module.exports = { create, findAll, findById, findBySlug, update, remove };
