async function renderProducts() {
  const app = document.getElementById('app');
  const params = new URLSearchParams(window.location.search);
  
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Shop Sustainable Products</h2>
          <p>Browse our curated collection of eco-friendly essentials</p>
        </div>

        <div class="filters">
          <div class="filters-row">
            <div class="filter-group">
              <label>Category</label>
              <select id="filterCategory">
                <option value="">All Categories</option>
                <option value="sustainable-clothing">Sustainable Clothing</option>
                <option value="eco-home">Eco-Friendly Home</option>
                <option value="reusable-essentials">Reusable Essentials</option>
                <option value="organic-food">Organic Food</option>
                <option value="natural-beauty">Natural Beauty</option>
                <option value="green-tech">Green Tech</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Sort By</label>
              <select id="filterSort">
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="eco-score">Eco Score</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Min Eco Score</label>
              <select id="filterEcoScore">
                <option value="">Any</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
                <option value="9">9+</option>
                <option value="10">10</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Price Range</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="filterMinPrice" placeholder="Min" min="0" />
                <input type="number" id="filterMaxPrice" placeholder="Max" min="0" />
              </div>
            </div>
          </div>
        </div>

        <div class="product-grid" id="productsGrid">
          <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Loading...</div>
        </div>

        <div class="pagination" id="pagination"></div>
      </div>
    </section>
  `;

  // Set initial filter values from URL
  document.getElementById('filterCategory').value = params.get('category') || '';
  document.getElementById('filterSort').value = params.get('sort') || 'newest';
  document.getElementById('filterEcoScore').value = params.get('minScore') || '';
  document.getElementById('filterMinPrice').value = params.get('minPrice') || '';
  document.getElementById('filterMaxPrice').value = params.get('maxPrice') || '';

  // Add filter listeners
  ['filterCategory', 'filterSort', 'filterEcoScore'].forEach(id => {
    document.getElementById(id).addEventListener('change', applyFilters);
  });
  ['filterMinPrice', 'filterMaxPrice'].forEach(id => {
    document.getElementById(id).addEventListener('blur', applyFilters);
  });

  loadProducts();
}

async function loadProducts(page = 1) {
  const params = new URLSearchParams(window.location.search);
  params.set('page', page);
  params.set('limit', 12);

  try {
    const data = await api.get(`/api/products?${params.toString()}`);
    renderProductGrid(data.products, 'productsGrid');
    renderPagination(data.page, data.pages);
  } catch (error) {
    document.getElementById('productsGrid').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Failed to load products</p>';
  }
}

function applyFilters() {
  const params = new URLSearchParams(window.location.search);
  
  const category = document.getElementById('filterCategory').value;
  const sort = document.getElementById('filterSort').value;
  const minScore = document.getElementById('filterEcoScore').value;
  const minPrice = document.getElementById('filterMinPrice').value;
  const maxPrice = document.getElementById('filterMaxPrice').value;

  if (category) params.set('category', category);
  else params.delete('category');
  
  if (sort) params.set('sort', sort);
  else params.delete('sort');
  
  if (minScore) params.set('minScore', minScore);
  else params.delete('minScore');
  
  if (minPrice) params.set('minPrice', minPrice);
  else params.delete('minPrice');
  
  if (maxPrice) params.set('maxPrice', maxPrice);
  else params.delete('maxPrice');

  params.delete('page');
  
  const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
  window.history.pushState({}, '', newUrl);
  loadProducts(1);
}

function renderPagination(currentPage, totalPages) {
  const container = document.getElementById('pagination');
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `<button onclick="loadProducts(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `<button onclick="loadProducts(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += '<span>...</span>';
    }
  }
  
  html += `<button onclick="loadProducts(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;
  
  container.innerHTML = html;
}
