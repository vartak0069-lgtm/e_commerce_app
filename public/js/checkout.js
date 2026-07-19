let selectedAddressId = null;
let appliedCoupon = null;

async function loadAddresses() {
  const container = qs('#addressList');
  if (!container) return;

  try {
    const res = await api.get('/addresses');
    const addresses = res.data;

    if (!addresses.length) {
      container.innerHTML = `<p class="text-muted">No saved addresses. <a href="/addresses.html">Add one →</a></p>`;
      return;
    }

    container.innerHTML = addresses.map((a) => `
      <div class="address-option ${a.is_default ? 'selected' : ''}" data-id="${a.id}">
        <strong>${a.full_name}</strong> - ${a.phone}<br>
        ${a.address_line1}, ${a.city}, ${a.state} - ${a.pincode}
      </div>
    `).join('');

    const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
    selectedAddressId = defaultAddr.id;

    qsa('.address-option', container).forEach((el) => {
      el.addEventListener('click', () => {
        qsa('.address-option', container).forEach((x) => x.classList.remove('selected'));
        el.classList.add('selected');
        selectedAddressId = el.dataset.id;
      });
    });
  } catch (err) {
    container.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

async function loadOrderSummary() {
  const container = qs('#orderSummary');
  if (!container) return;
  try {
    const res = await api.get('/cart');
    const { items, subtotal } = res.data;
    container.innerHTML = `
      ${items.map((i) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span>${i.products.name} × ${i.quantity}</span>
          <span>${formatPrice((i.products.discount_price || i.products.price) * i.quantity)}</span>
        </div>
      `).join('')}
      <hr class="mt-2 mb-2">
      <div style="display:flex; justify-content:space-between; font-weight:700;">
        <span>Subtotal</span><span id="checkoutSubtotal">${formatPrice(subtotal)}</span>
      </div>
    `;
    container.dataset.subtotal = subtotal;
  } catch (err) {
    container.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

async function applyCoupon() {
  const code = qs('#couponCode').value.trim();
  const subtotal = Number(qs('#orderSummary').dataset.subtotal);
  if (!code) return;

  try {
    const res = await api.post('/coupons/validate', { code, subtotal });
    appliedCoupon = res.data;
    showToast(`Coupon applied! You saved ${formatPrice(res.data.discount)}`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function placeOrder() {
  if (!selectedAddressId) return showToast('Please select a delivery address', 'error');

  try {
    const res = await api.post('/checkout/initiate', {
      addressId: selectedAddressId,
      couponCode: appliedCoupon?.code,
    });

    const { razorpayOrderId, amount, currency, razorpayKeyId, orderId, orderNumber } = res.data;

    // Razorpay Checkout - TEST MODE, completely free, no real transaction happens
    const options = {
      key: razorpayKeyId,
      amount,
      currency,
      name: 'MyStore',
      description: `Order ${orderNumber}`,
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          await api.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          });
          showToast('Order placed successfully!', 'success');
          setTimeout(() => (window.location.href = `/order-confirmation.html?orderId=${orderId}`), 800);
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
      modal: {
        ondismiss: async function () {
          await api.post('/payments/failed', { razorpay_order_id: razorpayOrderId, orderId });
          showToast('Payment cancelled', 'error');
        },
      },
      theme: { color: '#16a34a' },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAddresses();
  loadOrderSummary();
  qs('#applyCouponBtn')?.addEventListener('click', applyCoupon);
  qs('#placeOrderBtn')?.addEventListener('click', placeOrder);
});
