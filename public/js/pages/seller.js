async function renderSellerDashboard() {
  const app = document.getElementById('app');
  
  if (!currentUser || (currentUser.role !== 'seller' && currentUser.role !== 'admin')) {
    app.innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Seller Access Required</h2>
        <p style="color: var(--text-light); margin: 1rem 0;">Want to sell on Kaisiri?</p>
        <button class="btn btn-primary" onclick="navigateTo('/seller/register')">Become a Seller</button>
      </div>
    `;
    return;
  }

  // Check verification status first
  try {
    const status = await api.get('/api/seller/status');
    
    if (status.verificationStatus !== 'approved') {
      navigateTo('/seller/verify');
      return;
    }
  } catch (error) {
    console.error('Error checking status:', error);
  }

  app.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;">Loading dashboard...</div>';

  try {
   const dashboard = await api.get('/api/seller/dashboard') || {};
    
    app.innerHTML = `
      <section class="section">
        <div class="container">
          <h1 style="margin-bottom: 2rem;">Seller Dashboard</h1>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${dashboard.totalProducts || 0}</div>
              <div style="color: var(--text-muted);">Total Products</div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">${dashboard.activeProducts || 0}</div>
              <div style="color: var(--text-muted);">Active Products</div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${dashboard.totalOrders || 0}</div>
              <div style="color: var(--text-muted);">Total Orders</div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">$${dashboard.revenue || 0}</div>
              <div style="color: var(--text-muted);">Total Revenue</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2>My Products</h2>
            <button class="btn btn-primary" onclick="showAddProductForm()">+ Add New Product</button>
          </div>

          <div id="sellerProducts">Loading products...</div>
        </div>
      </section>
    `;

    loadSellerProducts();
  } catch (error) {
  console.error("Seller Dashboard Error:", error);

  app.innerHTML = `
    <div class="container" style="padding: 4rem 0; text-align: center;">
      <h2>Failed to load dashboard</h2>
      <p>${error.message}</p>
    </div>
  `;
}
}

async function loadSellerProducts() {
  try {
    const products = await api.get('/api/seller/products');
    const container = document.getElementById('sellerProducts');
    
    if (products.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No products yet. Add your first product!</p>';
      return;
    }

    container.innerHTML = `
      <div style="background: white; border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: var(--bg-alt);">
            <tr>
              <th style="padding: 1rem; text-align: left;">Product</th>
              <th style="padding: 1rem; text-align: left;">Price</th>
              <th style="padding: 1rem; text-align: left;">Stock</th>
              <th style="padding: 1rem; text-align: left;">Status</th>
              <th style="padding: 1rem; text-align: left;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${p.images?.[0] || '/placeholder.jpg'}"" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);" />
                    <div>
                      <div style="font-weight: 500;">${p.name}</div>
                      <div style="font-size: 0.85rem; color: var(--text-muted);">${formatCategory(p.category)}</div>
                    </div>
                  </div>
                </td>
                <td style="padding: 1rem;">$${p.price ? p.price.toFixed(2) : '0.00'}</td>
                <td style="padding: 1rem;">${p.stock}</td>
                <td style="padding: 1rem;">
                  <span style="background: ${p.approved ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                    ${p.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td style="padding: 1rem;">
                  <button class="btn btn-sm btn-outline" onclick="editSellerProduct('${p._id}')">Edit</button>
                  <button class="btn btn-sm" style="color: var(--error);" onclick="deleteSellerProduct('${p._id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    document.getElementById('sellerProducts').innerHTML = '<p style="text-align: center; color: var(--error);">Failed to load products</p>';
  }
}

function showAddProductForm() {
  showModal(`
    <div style="padding: 2rem; max-height: 80vh; overflow-y: auto;">
      <h2 style="margin-bottom: 1.5rem;">Add New Product</h2>
      <form id="addProductForm" onsubmit="submitProduct(event)" enctype="multipart/form-data">
        <div class="form-group">
          <label>Product Name *</label>
          <input type="text" name="name" required />
        </div>
        
        <div class="form-group">
          <label>Description *</label>
          <textarea name="description" rows="4" required></textarea>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Price *</label>
            <input type="number" name="price" step="0.01" min="0" required />
          </div>
          <div class="form-group">
            <label>Stock *</label>
            <input type="number" name="stock" min="0" required />
          </div>
        </div>
        
        <div class="form-group">
          <label>Category *</label>
          <select name="category" required>
            <option value="sustainable-clothing">Sustainable Clothing</option>
            <option value="eco-home">Eco-Friendly Home</option>
            <option value="reusable-essentials">Reusable Essentials</option>
            <option value="organic-food">Organic Food</option>
            <option value="natural-beauty">Natural Beauty</option>
            <option value="green-tech">Green Tech</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Sustainability Score (1-10) *</label>
          <input type="number" name="sustainabilityScore" min="1" max="10" required />
        </div>
        
        <div class="form-group">
          <label>Environmental Impact Summary *</label>
          <input type="text" name="impactSummary" placeholder="e.g., Saves 100L water, reduces CO₂" required />
        </div>
        
        <div class="form-group">
          <label>Materials (comma-separated)</label>
          <input type="text" name="materials" placeholder="e.g., Organic Cotton, Recycled Polyester" />
        </div>
        
        <div class="form-group">
          <label>Product Images (up to 5)</label>
          <input type="file" name="images" accept="image/*" multiple />
          <small style="color: var(--text-muted);">Max 5 images, 5MB each</small>
        </div>
        
        <button type="submit" class="btn btn-primary" style="width: 100%;">Add Product</button>
      </form>
    </div>
  `);
}

async function submitProduct(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/api/seller/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    showToast('Product added successfully!', 'success');
    hideModal();
    renderSellerDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteSellerProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await api.delete(`/api/seller/products/${id}`);
    showToast('Product deleted', 'success');
    loadSellerProducts();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function editSellerProduct(id) {
  showToast('Edit functionality coming soon!', 'info');
}

// Seller registration page
function renderSellerRegister() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <section class="section">
      <div class="container" style="max-width: 800px;">
        <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md);">
          <h1 style="text-align: center; margin-bottom: 1rem;">Become a Seller</h1>
          <p style="text-align: center; color: var(--text-light); margin-bottom: 2rem;">
            Join Kaisiri and start selling eco-friendly products today.
          </p>
          
          <form id="sellerRegisterForm" onsubmit="handleSellerRegister(event)" enctype="multipart/form-data">
            <input type="hidden" name="role" value="seller">

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group"><label>Your Name *</label><input type="text" name="name" required /></div>
                <div class="form-group"><label>Email *</label><input type="email" name="email" required /></div>
                <div class="form-group"><label>Password *</label><input type="password" name="password" required minlength="6" /></div>
                <div class="form-group"><label>Store Name *</label><input type="text" name="storeName" required /></div>
            </div>

            <div class="form-group">
              <label>Store Description</label>
              <textarea name="storeDescription" rows="2" placeholder="Tell customers about your eco-mission..."></textarea>
            </div>

            <hr style="margin: 2rem 0; border: 0; border-top: 1px solid var(--border);">

            <h3 style="margin-bottom: 1rem;">Business & Tax Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group"><label>Legal Business Name *</label><input type="text" name="businessName" required /></div>
                <div class="form-group"><label>Tax ID / GSTIN *</label><input type="text" name="taxId" required /></div>
            </div>

            <h3 style="margin-bottom: 1rem;">Warehouse Address</h3>
            <div class="form-group"><label>Street Address *</label><input type="text" name="warehouseStreet" required /></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                <div class="form-group"><label>City</label><input type="text" name="warehouseCity" required /></div>
                <div class="form-group"><label>State</label><input type="text" name="warehouseState" required /></div>
                <div class="form-group"><label>Postal Code</label><input type="text" name="warehousePostalCode" required /></div>
            </div>

            <h3 style="margin-bottom: 1rem;">Bank Details (For Payouts)</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="form-group"><label>Account Number</label><input type="text" name="accountNumber" required /></div>
                <div class="form-group"><label>Bank Name</label><input type="text" name="bankName" required /></div>
            </div>

            <div class="form-group">
                <label>Verification Documents (ID/Business License) *</label>
                <input type="file" name="documents" multiple required />
                <small style="color: var(--text-muted);">Upload up to 5 documents (PDF or Images)</small>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" id="sellerRegisterBtn">
                Submit Application & Create Account
            </button>
          </form>
          
          <p style="text-align: center; color: var(--text-muted);">
            Already have an account? <a href="/login" data-link="/login" style="color: var(--primary); font-weight: 600;">Sign in</a>
          </p>
        </div>
      </div>
    </section>
  `;
}

async function handleSellerRegister(event) {
  event.preventDefault();
  const btn = document.getElementById('sellerRegisterBtn');
  const formData = new FormData(event.target); // Captures ALL fields including files

  btn.disabled = true;
  btn.textContent = 'Processing Application...';

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: formData // Browser sets Content-Type to multipart/form-data automatically
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Success logic
    localStorage.setItem('token', data.token);
    currentUser = data.user;
    
    showToast('Registration successful! Your account is pending verification.', 'success');
    
    // Redirect to the seller status page so they can see it's "pending"
    navigateTo('/seller/status'); 
    
  } catch (error) {
    showToast(error.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Create Seller Account';
  }
}