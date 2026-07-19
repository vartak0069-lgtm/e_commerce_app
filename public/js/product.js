function renderProductCard(product) {
  const price = product.discount_price || product.price;
  const img = (product.images && product.images[0]) || '/images/products/placeholder.jpg';
  return `
    <a href="/product-detail.html?slug=${product.slug}" class="card product-card fade-in">
      <img src="${img}" alt="${product.name}">
      <div class="product-card-body">
        <div class="product-card-title">${product.name}</div>
        <div class="rating-stars">${starRating(product.avg_rating || 0)} <span class="text-muted">(${product.total_reviews || 0})</span></div>
        <div class="product-card-price">
          <span class="price-current">${formatPrice(price)}</span>
          ${product.discount_price ? `<span class="price-original">${formatPrice(product.price)}</span>` : ''}
        </div>
      </div>
    </a>
  `;
}

async function loadProductGrid(containerId, endpoint) {
  const container = qs(`#${containerId}`);
  if (!container) return;
  container.innerHTML = '<div class="spinner"></div>';
  try {
    const res = await api.get(endpoint, { auth: false });
    const products = res.data;
    container.innerHTML = products.length
      ? products.map(renderProductCard).join('')
      : '<p class="text-muted">No products found.</p>';
  } catch (err) {
    container.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

async function loadProductDetail() {
  const container = qs('#productDetail');
  if (!container) return;
  const slug = getQueryParam('slug');
  if (!slug) return;

  try {
    const res = await api.get(`/products/${slug}`, { auth: false });
    const p = res.data;
    const price = p.discount_price || p.price;
    const images = p.images && p.images.length ? p.images : ['/images/products/placeholder.jpg'];

    container.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-gallery">
          ${images.map((img) => `<img src="${img}" alt="${p.name}">`).join('')}
        </div>
        <div>
          <h1 class="product-detail-title">${p.name}</h1>
          <div class="rating-stars">${starRating(p.avg_rating || 0)} (${p.total_reviews || 0} reviews)</div>
          <div class="product-detail-price">
            <span class="price-current">${formatPrice(price)}</span>
            ${p.discount_price ? `<span class="price-original">${formatPrice(p.price)}</span>` : ''}
          </div>
          <p class="text-muted mb-2">${p.description || ''}</p>
          <p class="mb-2">${p.stock_quantity > 0 ? `<span class="badge badge-success">In Stock</span>` : `<span class="badge badge-danger">Out of Stock</span>`}</p>
          <div style="display:flex; gap:10px; align-items:center;">
            <input type="number" id="qtyInput" value="1" min="1" max="${p.stock_quantity}" style="width:70px; padding:8px; border-radius:8px; border:1px solid var(--color-border);">
            <button class="btn btn-primary" id="addToCartBtn" ${p.stock_quantity < 1 ? 'disabled' : ''}>Add to Cart</button>
            <button class="btn btn-secondary" id="wishlistBtn">♥ Wishlist</button>
          </div>
        </div>
      </div>
    `;

    qs('#addToCartBtn')?.addEventListener('click', () => {
      const qty = parseInt(qs('#qtyInput').value, 10) || 1;
      addToCart(p.id, qty);
    });

    qs('#wishlistBtn')?.addEventListener('click', async () => {
      if (!isLoggedIn()) return showToast('Please login first', 'error');
      try {
        await api.post(`/wishlist/${p.id}`);
        showToast('Added to wishlist!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });

    loadReviews(p.id);
  } catch (err) {
    container.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

async function loadReviews(productId) {
  const el = qs('#reviewsList');
  if (!el) return;
  try {
    const res = await api.get(`/products/${productId}/reviews`, { auth: false });
    el.innerHTML = res.data.length
      ? res.data.map((r) => `
          <div class="card" style="padding:12px; margin-bottom:10px;">
            <strong>${r.users?.name || 'Anonymous'}</strong> - ${starRating(r.rating)}
            <p class="text-muted">${r.comment || ''}</p>
          </div>
        `).join('')
      : '<p class="text-muted">No reviews yet.</p>';
  } catch (err) {
    el.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (qs('#productGrid')) loadProductGrid('productGrid', `/products${window.location.search}`);
  if (qs('#featuredGrid')) loadProductGrid('featuredGrid', '/products/featured');
  if (qs('#productDetail')) loadProductDetail();
});
