const supabase = require('../config/database');
const TABLE = 'orders';

async function create(orderData) {
  const { data, error } = await supabase.from(TABLE).insert(orderData).select().single();
  if (error) throw error;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, order_items(*), addresses(*), payments(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function findByUser(userId, { from, to } = {}) {
  let query = supabase
    .from(TABLE)
    .select('id, order_number, status, total_amount, payment_status, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (from !== undefined && to !== undefined) query = query.range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

async function findAll({ from, to, status } = {}) {
  let query = supabase
    .from(TABLE)
    .select('id, order_number, status, total_amount, payment_status, user_id, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  if (from !== undefined && to !== undefined) query = query.range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

async function updateStatus(id, status) {
  const { data, error } = await supabase.from(TABLE).update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function updatePaymentStatus(id, payment_status) {
  const { data, error } = await supabase.from(TABLE).update({ payment_status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

module.exports = { create, findById, findByUser, findAll, updateStatus, updatePaymentStatus };
