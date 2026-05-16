async function renderCartPage() {
  const app = document.getElementById('app');
  
  if (!currentUser) {
    app.innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Please sign in to view your cart</h2>
        <button class="btn btn-primary" data-link="/login">Sign In</button>
      </div>
    `;
    return;
  }

  await loadCart();

  if (cart.length === 0) {
    app.innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Your cart is empty</h2>
        <p style="color: var(--text-light); margin: 1rem 0;">Start shopping for eco-friendly products!</p>
        <button class="btn btn-primary" data-link="/products">Browse Products</button>
      </div>
    `;
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  app.innerHTML = `
    <section class="section">
      <div class="container">
        <h1 style="margin-bottom: 2rem;">Shopping Cart</h1>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
          <div>
            ${cart.map(item => `
              <div style="background: white; padding: 1.5rem; border-radius: var(--radius); margin-bottom: 1rem; box-shadow: var(--shadow-sm); display: flex; gap: 1.5rem;">
                <img src="${item.product.images[0]}" alt="${item.product.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-sm);" />
                <div style="flex: 1;">
                  <h3 style="margin-bottom: 0.5rem;">${item.product.name}</h3>
                  <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${formatCategory(item.product.category)}</p>
                  <p style="color: var(--success); font-size: 0.85rem; margin-bottom: 1rem;">🌿 Eco Score: ${item.product.sustainabilityScore}/10</p>
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.25rem;">
                      <button onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})" style="padding: 0.25rem 0.5rem; color: var(--text);">−</button>
                      <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                      <button onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})" style="padding: 0.25rem 0.5rem; color: var(--text);">+</button>
                    </div>
                    <button onclick="removeItem('${item.product._id}')" style="color: var(--error); font-size: 0.9rem;">Remove</button>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">$${(item.product.price * item.quantity).toFixed(2)}</div>
                  <div style="font-size: 0.9rem; color: var(--text-muted);">$${item.product.price.toFixed(2)} each</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); position: sticky; top: 6rem;">
              <h3 style="margin-bottom: 1rem;">Order Summary</h3>
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
              <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem;">
                <span>Total</span>
                <span style="color: var(--primary);">$${total.toFixed(2)}</span>
              </div>
              ${subtotal < 50 ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; text-align: center;">Add $${(50 - subtotal).toFixed(2)} more for free shipping!</p>` : ''}
              <button class="btn btn-primary" style="width: 100%;" data-link="/checkout">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;
  await updateCartItem(productId, newQuantity);
  renderCartPage();
}

async function removeItem(productId) {
  await removeFromCart(productId);
  renderCartPage();
}
