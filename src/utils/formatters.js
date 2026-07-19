function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

function generateOrderNumber() {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${ymd}-${rand}`;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function paginate(page = 1, limit = 12) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 12);
  const from = (p - 1) * l;
  const to = from + l - 1;
  return { from, to, page: p, limit: l };
}

module.exports = { formatCurrency, generateOrderNumber, generateSlug, paginate };
