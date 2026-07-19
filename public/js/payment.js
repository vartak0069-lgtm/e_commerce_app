async function loadOrderConfirmation() {
  const container = qs('#orderConfirmation');
  if (!container) return;

  const orderId = getQueryParam('orderId');
  if (!orderId) return;

  try {
    const res = await api.get(`/orders/${orderId}`);
    const order = res.data;
    container.innerHTML = `
      <div class="card fade-in" style="padding:30px; text-align:center;">
        <h2>✅ Order Confirmed!</h2>
        <p class="text-muted mt-1">Order Number: <strong>${order.order_number}</strong></p>
        <p class="mt-1">Total Paid: <strong>${formatPrice(order.total_amount)}</strong></p>
        <p class="mt-1">Status: <span class="badge badge-success">${order.status}</span></p>
        <a href="/orders.html" class="btn btn-primary mt-3">View My Orders</a>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadOrderConfirmation);
