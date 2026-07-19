function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const themeBtn = qs('#themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
});
