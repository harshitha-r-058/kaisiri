async function renderCheckout() {
  const app = document.getElementById('app');
  
  if (!currentUser) {
    navigateTo('/login');
    return;
  }

  await loadCart();

  if (cart.length === 0) {
    navigateTo('/cart');
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  app.innerHTML = `
    <section class="section">
      <div class="container">
        <h1 style="margin-bottom: 2rem;">Checkout</h1>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
          <div>
            <form id="checkoutForm" onsubmit="placeOrder(event)">
              <div style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
                <h2 style="margin-bottom: 1.5rem;">Shipping Address</h2>
                <div class="form-group">
                  <label>Full Name *</label>
                  <input type="text" id="fullName" required />
                </div>
                <div class="form-group">
                  <label>Address *</label>
                  <input type="text" id="address" required />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label>City *</label>
                    <input type="text" id="city" required />
                  </div>
                  <div class="form-group">
                    <label>Postal Code *</label>
                    <input type="text" id="postalCode" required />
                  </div>
                </div>
                <div class="form-group">
                  <label>Country *</label>
                  <input type="text" id="country" value="United States" required />
                </div>
              </div>

              <div style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
                <h2 style="margin-bottom: 1.5rem;">Payment Method</h2>
                <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">
                  <p style="color: var(--text-light);">💳 Payment Simulation Mode</p>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">This is a demo. No real payment will be processed.</p>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="placeOrderBtn">Place Order</button>
            </form>
          </div>

          <div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); position: sticky; top: 6rem;">
              <h3 style="margin-bottom: 1rem;">Order Summary</h3>
              <div style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                ${cart.map(item => `
                  <div style="display: flex; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                    <img src="${item.product.images[0]}" alt="${item.product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
                    <div style="flex: 1;">
                      <div style="font-size: 0.9rem; font-weight: 500;">${item.product.name}</div>
                      <div style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.quantity}</div>
                    </div>
                    <div style="font-weight: 600;">$${(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                `).join('')}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Tax</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border);" />
              <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">
                <span>Total</span>
                <span style="color: var(--primary);">$${total.toFixed(2)}</span>
              </div>
              <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">
                <p style="color: var(--success); font-weight: 600;">🌱 You'll earn ${Math.floor(subtotal * 2)} eco points!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function placeOrder(event) {
  event.preventDefault();
  
  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  const shippingAddress = {
    fullName: document.getElementById('fullName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value,
    country: document.getElementById('country').value
  };

  try {
    const order = await api.post('/api/orders', { shippingAddress });
    showToast('Order placed successfully!', 'success');
    await clearCart();
    navigateTo(`/orders`);
  } catch (error) {
    showToast(error.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}
