async function renderWishlist() {
  const app = document.getElementById('app');
  
  if (!currentUser) {
    app.innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Please sign in to view your wishlist</h2>
        <button class="btn btn-primary" data-link="/login">Sign In</button>
      </div>
    `;
    return;
  }

  app.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;">Loading wishlist...</div>';

  try {
    const wishlist = await api.get('/api/wishlist');
    
    if (wishlist.length === 0) {
      app.innerHTML = `
        <div class="container" style="padding: 4rem 0; text-align: center;">
          <h2>Your wishlist is empty</h2>
          <p style="color: var(--text-light); margin: 1rem 0;">Save your favorite eco-friendly products here!</p>
          <button class="btn btn-primary" data-link="/products">Browse Products</button>
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <section class="section">
        <div class="container">
          <h1 style="margin-bottom: 2rem;">My Wishlist</h1>
          <div class="product-grid">
            ${wishlist.map(p => `
              <div class="product-card">
                <div class="product-image">
                  <img src="${p.images[0] || '/placeholder.jpg'}" alt="${p.name}" loading="lazy" />
                  <div class="eco-badge">🌿 ${p.sustainabilityScore}/10</div>
                  <button class="wishlist-btn active" onclick="toggleWishlist('${p._id}')" aria-label="Remove from wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div class="product-info">
                  <h3 class="product-name">${p.name}</h3>
                  <div class="product-price">
                    <span class="price-current">$${p.price.toFixed(2)}</span>
                  </div>
                  <div class="product-actions">
                    <button class="btn btn-primary btn-sm btn-add-cart" onclick="addToCart('${p._id}')">Add to Cart</button>
                    <button class="btn btn-outline btn-sm" data-link="/product/${p._id}">View</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  } catch (error) {
    app.innerHTML = `<div class="container" style="padding: 4rem 0; text-align: center;"><h2>Failed to load wishlist</h2></div>`;
  }
}
