async function renderHome() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <section class="hero">
      <div class="container hero-content">
        <h1>Live Sustainably, Shop Consciously</h1>
        <p>Discover eco-friendly products that are good for you and the planet. Every purchase makes a difference.</p>
        <div class="hero-cta">
          <button class="btn btn-primary btn-lg" data-link="/products">Shop Now</button>
          <button class="btn btn-outline btn-lg" onclick="scrollToSection('featured')">Explore Featured</button>
        </div>
      </div>
    </section>

    <section class="eco-facts">
      <div class="container">
        <div class="eco-facts-grid">
          <div class="eco-fact">
            <div class="eco-fact-icon">💧</div>
            <h3>Water Conservation</h3>
            <p>Our products save millions of litres of water annually</p>
          </div>
          <div class="eco-fact">
            <div class="eco-fact-icon">🌍</div>
            <h3>Carbon Neutral</h3>
            <p>Every order is carbon-offset through verified programs</p>
          </div>
          <div class="eco-fact">
            <div class="eco-fact-icon">♻️</div>
            <h3>Zero Waste</h3>
            <p>Plastic-free packaging and compostable materials</p>
          </div>
          <div class="eco-fact">
            <div class="eco-fact-icon">🌱</div>
            <h3>Ethical Sourcing</h3>
            <p>Fair trade certified and sustainably harvested</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="featured">
      <div class="container">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked sustainable essentials for conscious living</p>
        </div>
        <div class="product-grid" id="featuredProducts">
          <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading...</div>
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--bg-alt);">
      <div class="container">
        <div class="section-header">
          <h2>Recommended For You</h2>
          <p>Personalized eco-friendly picks based on your preferences</p>
        </div>
        <div class="product-grid" id="recommendedProducts">
          <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading...</div>
        </div>
      </div>
    </section>
  `;

  loadFeaturedProducts();
  loadRecommendations();
}

async function loadFeaturedProducts() {
  try {
    const products = await api.get('/api/products/featured');
    renderProductGrid(products, 'featuredProducts');
  } catch (error) {
    document.getElementById('featuredProducts').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Failed to load products</p>';
  }
}

async function loadRecommendations() {
  try {
    const endpoint = currentUser ? '/api/recommendations' : '/api/recommendations/guest';
    const data = await api.get(endpoint);
    renderProductGrid(data.recommendations, 'recommendedProducts');
  } catch (error) {
    document.getElementById('recommendedProducts').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Failed to load recommendations</p>';
  }
}

function renderProductGrid(products, containerId) {
  const container = document.getElementById(containerId);
  if (!products || products.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found</p>';
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.images[0] || '/placeholder.jpg'}" alt="${p.name}" loading="lazy" />
        <div class="eco-badge">🌿 ${p.sustainabilityScore}/10</div>
        <button class="wishlist-btn" onclick="toggleWishlist('${p._id}')" aria-label="Add to wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${formatCategory(p.category)}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${renderStars(p.averageRating)}</span>
          <span class="text-muted">(${p.numReviews})</span>
        </div>
        <div class="product-impact">🌍 ${p.environmentalImpact.summary}</div>
        <div class="product-price">
          <span class="price-current">$${p.price.toFixed(2)}</span>
          ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm btn-add-cart" onclick="addToCart('${p._id}')">Add to Cart</button>
          <button class="btn btn-outline btn-sm" data-link="/product/${p._id}">View</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

function formatCategory(cat) {
  return cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

async function toggleWishlist(productId) {
  if (!currentUser) {
    showToast('Please sign in to use wishlist', 'info');
    navigateTo('/login');
    return;
  }

  try {
    const result = await api.post(`/api/wishlist/${productId}`);
    showToast(result.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}
