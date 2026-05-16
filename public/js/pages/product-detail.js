async function renderProductDetail({ id }) {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;">Loading...</div>';

  try {
    const product = await api.get(`/api/products/${id}`);
    
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 3rem;">
            <div>
              <img src="${product.images[0] || '/placeholder.jpg'}" alt="${product.name}" style="width: 100%; border-radius: var(--radius); box-shadow: var(--shadow-md);" />
            </div>
            <div>
              <div style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">${formatCategory(product.category)}</div>
              <h1 style="margin-bottom: 1rem;">${product.name}</h1>
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #ffa500; font-size: 1.2rem;">${renderStars(product.averageRating)}</span>
                  <span style="color: var(--text-muted);">(${product.numReviews} reviews)</span>
                </div>
                <div style="background: var(--success); color: white; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                  🌿 Eco Score: ${product.sustainabilityScore}/10
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <span style="font-size: 2.5rem; font-weight: 700; color: var(--primary);">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span style="font-size: 1.5rem; color: var(--text-muted); text-decoration: line-through;">$${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <p style="color: var(--text-light); margin-bottom: 1.5rem; line-height: 1.8;">${product.description}</p>
              
              <div style="background: var(--bg-alt); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 1rem; font-size: 1.1rem;">🌍 Environmental Impact</h3>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                  ${product.environmentalImpact.waterSaved ? `<li>💧 ${product.environmentalImpact.waterSaved}</li>` : ''}
                  ${product.environmentalImpact.co2Reduced ? `<li>🌱 ${product.environmentalImpact.co2Reduced}</li>` : ''}
                  ${product.environmentalImpact.plasticAvoided ? `<li>♻️ ${product.environmentalImpact.plasticAvoided}</li>` : ''}
                  ${product.environmentalImpact.treesPlanted ? `<li>🌳 ${product.environmentalImpact.treesPlanted}</li>` : ''}
                </ul>
              </div>

              <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                <button class="btn btn-primary btn-lg" onclick="addToCart('${product._id}')" style="flex: 1;">Add to Cart</button>
                <button class="btn btn-outline btn-lg" onclick="toggleWishlist('${product._id}')">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                <div><strong>Materials:</strong> ${product.materials.join(', ')}</div>
                <div><strong>Origin:</strong> ${product.origin}</div>
                <div><strong>Stock:</strong> ${product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</div>
                <div><strong>Certifications:</strong> ${product.certifications.join(', ')}</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 3rem;">
            <h2 style="margin-bottom: 1.5rem;">Customer Reviews</h2>
            <div id="reviewsSection">
              ${currentUser ? `
                <div style="background: white; padding: 1.5rem; border-radius: var(--radius); margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
                  <h3 style="margin-bottom: 1rem;">Write a Review</h3>
                  <form id="reviewForm" onsubmit="submitReview(event, '${product._id}')">
                    <div class="form-group">
                      <label>Rating</label>
                      <select id="reviewRating" required>
                        <option value="">Select rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Terrible</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Comment</label>
                      <textarea id="reviewComment" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Review</button>
                  </form>
                </div>
              ` : ''}
              <div id="reviewsList">
                ${product.reviews.length === 0 ? '<p style="text-align: center; color: var(--text-muted);">No reviews yet. Be the first to review!</p>' : product.reviews.map(r => `
                  <div style="background: white; padding: 1.5rem; border-radius: var(--radius); margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                      <div>
                        <strong>${r.userName}</strong>
                        <div style="color: #ffa500; margin-top: 0.25rem;">${renderStars(r.rating)}</div>
                      </div>
                      <span style="color: var(--text-muted); font-size: 0.85rem;">${new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style="color: var(--text-light);">${r.comment}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div>
            <h2 style="margin-bottom: 1.5rem;">Similar Products</h2>
            <div class="product-grid" id="similarProducts">Loading...</div>
          </div>
        </div>
      </section>
    `;

    loadSimilarProducts(id);
  } catch (error) {
    app.innerHTML = `<div class="container" style="padding: 4rem 0; text-align: center;"><h2>Product not found</h2><button class="btn btn-primary" onclick="navigateTo('/products')">Browse Products</button></div>`;
  }
}

async function loadSimilarProducts(productId) {
  try {
    const products = await api.get(`/api/recommendations/similar/${productId}`);
    renderProductGrid(products, 'similarProducts');
  } catch (error) {
    document.getElementById('similarProducts').innerHTML = '<p>Failed to load similar products</p>';
  }
}

async function submitReview(event, productId) {
  event.preventDefault();
  const rating = document.getElementById('reviewRating').value;
  const comment = document.getElementById('reviewComment').value;

  try {
    await api.post(`/api/reviews/${productId}`, { rating, comment });
    showToast('Review submitted successfully!', 'success');
    renderProductDetail({ id: productId });
  } catch (error) {
    showToast(error.message, 'error');
  }
}
