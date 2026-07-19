function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function isLoggedIn() {
  return !!localStorage.getItem('accessToken');
}

function getCurrentUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function starRating(avg) {
  const full = Math.round(avg);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}
