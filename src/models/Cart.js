const supabase = require('../config/database');
const TABLE = 'carts';

async function findOrCreateByUser(userId) {
  let { data, error } = await supabase.from(TABLE).select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (data) return data;

  const { data: created, error: createError } = await supabase
    .from(TABLE)
    .insert({ user_id: userId })
    .select()
    .single();
  if (createError) throw createError;
  return created;
}

module.exports = { findOrCreateByUser };
