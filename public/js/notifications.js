function showToast(message, type = 'info') {
  const existing = qs('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') toast.style.background = '#dc2626';
  if (type === 'success') toast.style.background = '#16a34a';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
