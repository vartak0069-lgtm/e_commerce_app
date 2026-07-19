// Simple in-memory cache - a FREE alternative to Redis for small projects.
// Note: resets on server restart and won't work across multiple server instances,
// which is fine for a college/internship-scale deployment.

const store = new Map();

function set(key, value, ttlSeconds = 300) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  store.set(key, { value, expiresAt });
}

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

function del(key) {
  store.delete(key);
}

module.exports = { set, get, del };
