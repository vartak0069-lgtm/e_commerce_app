async function loadNavbar() {
  const el = qs('#navbar-placeholder');
  if (!el) return;
  const res = await fetch('/partials/header.html');
  el.innerHTML = await res.text();

  const user = getCurrentUser();
  const authLinks = qs('#navAuthLinks');
  if (authLinks) {
    const adminLink = user?.role === 'admin' ? `<a href="/admin/dashboard.html">Admin</a>` : '';
    authLinks.innerHTML = user
      ? `${adminLink}<a href="/profile.html">Hi, ${user.name.split(' ')[0]}</a><a href="#" id="logoutBtn">Logout</a>`
      : `<a href="/auth/login.html">Login</a><a href="/auth/register.html">Register</a>`;

    const logoutBtn = qs('#logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
  }

  if (isLoggedIn()) updateCartCount();
}

async function loadFooter() {
  const el = qs('#footer-placeholder');
  if (!el) return;
  const res = await fetch('/partials/footer.html');
  el.innerHTML = await res.text();
}

async function updateCartCount() {
  try {
    const res = await api.get('/cart');
    const count = res.data.items.reduce((sum, i) => sum + i.quantity, 0);
    const badge = qs('#cartCount');
    if (badge) badge.textContent = count;
  } catch (err) {
    // silent fail - user may not be logged in
  }
}

function logout() {
  clearTokens();
  showToast('Logged out successfully', 'success');
  setTimeout(() => (window.location.href = '/'), 800);
}

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();

  const mobileToggle = qs('#mobileMenuToggle');
  document.addEventListener('click', (e) => {
    if (e.target.id === 'mobileMenuToggle') {
      qs('.navbar-links')?.classList.toggle('open');
    }
  });
});