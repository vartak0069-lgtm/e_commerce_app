async function performSearch(query) {
  const container = qs('#productGrid') || qs('#searchResults');
  if (!container) return;
  if (!query) return;

  container.innerHTML = '<div class="spinner"></div>';
  try {
    const res = await api.get(`/search?q=${encodeURIComponent(query)}`, { auth: false });
    container.innerHTML = res.data.length
      ? res.data.map(renderProductCard).join('')
      : `<p class="text-muted">No results for "${query}"</p>`;
  } catch (err) {
    container.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = qs('#searchInput');
  if (!searchInput) return;

  const debouncedSearch = debounce((val) => performSearch(val), 400);
  searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value.trim()));

  const urlQuery = getQueryParam('q');
  if (urlQuery) {
    searchInput.value = urlQuery;
    performSearch(urlQuery);
  }
});
