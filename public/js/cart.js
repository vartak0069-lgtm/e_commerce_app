async function renderCart() {
  const container = qs('#cartItems');
  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = `<p>Please <a href="/auth/login.html">login</a> to view your cart.</p>`;
    return;
  }

  try {
    const res = await api.get('/cart');
    const { items, subtotal } = res.data;

    if (!items.length) {
      container.innerHTML = `<p class="text-muted">Your cart is empty. <a href="/products.html">Start shopping →</a></p>`;
      qs('#cartSummary').style.display = 'none';
      return;
    }

    container.innerHTML = items.map((item) => {
      const price = item.products.discount_price || item.products.price;
      const img = (item.products.images && item.products.images[0]) || '/images/products/placeholder.jpg';
      return `
        <div class="cart-item" data-item-id="${item.id}">
          <img src="${img}" alt="${item.products.name}">
          <div class="cart-item-info">
            <div>${item.products.name}</div>
            <div class="text-muted">${formatPrice(price)}</div>
          </div>
          <div class="qty-control">
            <button class="qty-decrease">-</button>
            <span>${item.quantity}</span>
            <button class="qty-increase">+</button>
          </div>
          <button class="btn btn-secondary remove-item">Remove</button>
        </div>
      `;
    }).join('');

    qs('#subtotalAmount').textContent = formatPrice(subtotal);

    qsa('.qty-increase', container).forEach((btn) =>
      btn.addEventListener('click', (e) => changeQuantity(e, 1))
    );
    qsa('.qty-decrease', container).forEach((btn) =>
      btn.addEventListener('click', (e) => changeQuantity(e, -1))
    );
    qsa('.remove-item', container).forEach((btn) =>
      btn.addEventListener('click', async (e) => {
        const itemId = e.target.closest('.cart-item').dataset.itemId;
        await api.delete(`/cart/items/${itemId}`);
        showToast('Item removed', 'success');
        renderCart();
        updateCartCount();
      })
    );
  } catch (err) {
    container.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

async function changeQuantity(e, delta) {
  const itemEl = e.target.closest('.cart-item');
  const itemId = itemEl.dataset.itemId;
  const qtySpan = itemEl.querySelector('.qty-control span');
  const newQty = parseInt(qtySpan.textContent, 10) + delta;

  if (newQty < 1) return;
  try {
    await api.put(`/cart/items/${itemId}`, { quantity: newQty });
    renderCart();
    updateCartCount();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function addToCart(productId, quantity = 1) {
  if (!isLoggedIn()) {
    showToast('Please login to add items to cart', 'error');
    setTimeout(() => (window.location.href = '/auth/login.html'), 1000);
    return;
  }
  try {
    await api.post('/cart/items', { productId, quantity });
    showToast('Added to cart!', 'success');
    updateCartCount();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', renderCart);
