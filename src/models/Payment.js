const supabase = require('../config/database');
const TABLE = 'payments';

async function create(paymentData) {
  const { data, error } = await supabase.from(TABLE).insert(paymentData).select().single();
  if (error) throw error;
  return data;
}

async function findByOrderId(orderId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('order_id', orderId).maybeSingle();
  if (error) throw error;
  return data;
}

async function updateByRazorpayOrderId(razorpayOrderId, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('razorpay_order_id', razorpayOrderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

module.exports = { create, findByOrderId, updateByRazorpayOrderId };
