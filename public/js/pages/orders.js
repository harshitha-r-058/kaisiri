async function renderOrders() {
  const app = document.getElementById('app');
  
  if (!currentUser) {
    app.innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Please sign in to view your orders</h2>
        <button class="btn btn-primary" data-link="/login">Sign In</button>
      </div>
    `;
    return;
  }

  app.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;">Loading orders...</div>';

  try {
    const orders = await api.get('/api/orders/my');
    
    if (orders.length === 0) {
      app.innerHTML = `
        <div class="container" style="padding: 4rem 0; text-align: center;">
          <h2>No orders yet</h2>
          <p style="color: var(--text-light); margin: 1rem 0;">Start shopping for eco-friendly products!</p>
          <button class="btn btn-primary" data-link="/products">Browse Products</button>
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <section class="section">
        <div class="container">
          <h1 style="margin-bottom: 2rem;">My Orders</h1>
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${orders.map(order => `
              <div style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                  <div>
                    <h3 style="margin-bottom: 0.5rem;">Order ${order.orderNumber}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Placed on ${new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style="text-align: right;">
                    <div style="background: ${getStatusColor(order.status)}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">
                      ${order.status.toUpperCase()}
                    </div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">$${order.totalPrice.toFixed(2)}</div>
                  </div>
                </div>

                <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
                  ${order.items.map(item => `
                    <div style="display: flex; gap: 1rem; align-items: center;">
                      <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);" />
                      <div style="flex: 1;">
                        <div style="font-weight: 500;">${item.name}</div>
                        <div style="color: var(--text-muted); font-size: 0.9rem;">Quantity: ${item.quantity}</div>
                      </div>
                      <div style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  `).join('')}
                </div>

                <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>🌍 Environmental Impact</strong>
                      <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.25rem;">
                        ${order.ecoImpact.co2Saved} • ${order.ecoImpact.plasticAvoided}
                      </p>
                    </div>
                    <div style="background: var(--success); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600;">
                      +${order.ecoImpact.ecoPoints} 🌱 points
                    </div>
                  </div>
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                  <strong>Shipping Address:</strong>
                  <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.25rem;">
                    ${order.shippingAddress.fullName}<br/>
                    ${order.shippingAddress.address}<br/>
                    ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br/>
                    ${order.shippingAddress.country}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<div class="container" style="padding: 4rem 0; text-align: center;"><h2>Failed to load orders</h2></div>`;
  }
}

function getStatusColor(status) {
  const colors = {
    pending: '#d4a574',
    processing: '#4a7c2c',
    shipped: '#2d5016',
    delivered: '#1a3009',
    cancelled: '#c44536'
  };
  return colors[status] || '#666';
}
