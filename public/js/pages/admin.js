let currentPendingSellers = [];
async function renderAdmin() {
  const app = document.getElementById('app');
  
  if (!currentUser || currentUser.role !== 'admin') {
    app.innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Access Denied</h2>
        <p style="color: var(--text-light);">You need admin privileges to access this page.</p>
        <button class="btn btn-primary" data-link="/">Go Home</button>
      </div>
    `;
    return;
  }
  

  app.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;">Loading admin panel...</div>';

  try {
    const [stats, products, orders] = await Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/products'),
      api.get('/api/admin/orders')
    ]);

    app.innerHTML = `
      <section class="section">
        <div class="container">
          <h1 style="margin-bottom: 2rem;">Admin Dashboard</h1>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${stats.totalProducts}</div>
              <div style="color: var(--text-muted);">Total Products</div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${stats.totalOrders}</div>
              <div style="color: var(--text-muted);">Total Orders</div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${stats.totalUsers}</div>
              <div style="color: var(--text-muted);">Total Users</div>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">$${stats.revenue}</div>
              <div style="color: var(--text-muted);">Total Revenue</div>
            </div>
          </div>

          <!-- Seller Verification Section -->
          <div style="margin-bottom: 3rem;">
            <h2 style="margin-bottom: 1.5rem;">Pending Seller Verifications</h2>
            <div id="pendingSellers">Loading...</div>
          </div>

          <div style="margin-bottom: 3rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h2>Products</h2>
              <button class="btn btn-primary" onclick="showAddProductModal()">Add Product</button>
            </div>
            <div style="background: white; border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: var(--bg-alt);">
                  <tr>
                    <th style="padding: 1rem; text-align: left;">Name</th>
                    <th style="padding: 1rem; text-align: left;">Category</th>
                    <th style="padding: 1rem; text-align: left;">Price</th>
                    <th style="padding: 1rem; text-align: left;">Stock</th>
                    <th style="padding: 1rem; text-align: left;">Eco Score</th>
                    <th style="padding: 1rem; text-align: left;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${products.map(p => `
                    <tr style="border-bottom: 1px solid var(--border);">
                      <td style="padding: 1rem;">${p.name}</td>
                      <td style="padding: 1rem;">${formatCategory(p.category)}</td>
                      <td style="padding: 1rem;">$${p.price.toFixed(2)}</td>
                      <td style="padding: 1rem;">${p.stock}</td>
                      <td style="padding: 1rem;">${p.sustainabilityScore}/10</td>
                      <td style="padding: 1rem;">
                        <button class="btn btn-sm btn-outline" onclick="editProduct('${p._id}')">Edit</button>
                        <button class="btn btn-sm" style="color: var(--error);" onclick="deleteProduct('${p._id}')">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 style="margin-bottom: 1.5rem;">Recent Orders</h2>
            <div style="background: white; border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: var(--bg-alt);">
                  <tr>
                    <th style="padding: 1rem; text-align: left;">Order #</th>
                    <th style="padding: 1rem; text-align: left;">Customer</th>
                    <th style="padding: 1rem; text-align: left;">Total</th>
                    <th style="padding: 1rem; text-align: left;">Status</th>
                    <th style="padding: 1rem; text-align: left;">Date</th>
                    <th style="padding: 1rem; text-align: left;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.slice(0, 10).map(o => `
                    <tr style="border-bottom: 1px solid var(--border);">
                      <td style="padding: 1rem;">${o.orderNumber}</td>
                      <td style="padding: 1rem;">${o.user?.name || 'Unknown User'}</td>
                      <td style="padding: 1rem;">$${o.totalPrice.toFixed(2)}</td>
                      <td style="padding: 1rem;">
                        <select onchange="updateOrderStatus('${o._id}', this.value)" style="padding: 0.5rem; border: 1px solid var(--border); border-radius: var(--radius-sm);">
                          <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                          <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                          <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                          <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                          <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                      </td>
                      <td style="padding: 1rem;">${new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style="padding: 1rem;">
                        <button class="btn btn-sm btn-outline" onclick="viewOrder('${o._id}')">View</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    `;

    loadPendingSellers();
  } catch (error) {
    app.innerHTML = `<div class="container" style="padding: 4rem 0; text-align: center;"><h2>Failed to load admin panel</h2></div>`;
  }
}

async function loadPendingSellers() {
  try {
    const sellers = await api.get('/api/admin/sellers/pending');
    currentPendingSellers = sellers; // 2. Store the data here
    
    const container = document.getElementById('pendingSellers');
    if (sellers.length === 0) {
      container.innerHTML = '<p style="padding: 2rem; text-align: center;">No pending verifications</p>';
      return;
    }

    container.innerHTML = `
      <div style="background: white; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
        ${sellers.map(seller => `
          <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0;">${seller.storeName || seller.name}</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0;">${seller.email}</p>
            </div>
            <!-- Ensure viewSellerDetails('${seller._id}') is spelled correctly -->
            <button class="btn btn-primary btn-sm" onclick="viewSellerDetails('${seller._id}')">View Details</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
}

async function approveSeller(sellerId) {
  if (!confirm('Approve this seller? They will be able to add products.')) return;

  try {
    await api.put(`/api/admin/sellers/${sellerId}/verify`, { action: 'approve' });
    showToast('Seller approved successfully!', 'success');
    loadPendingSellers();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function rejectSeller(sellerId) {
  const reason = prompt('Enter rejection reason (optional):');
  
  try {
    await api.put(`/api/admin/sellers/${sellerId}/verify`, { 
      action: 'reject',
      reason: reason || 'Verification requirements not met'
    });
    showToast('Seller rejected', 'info');
    loadPendingSellers();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function viewSellerDetails(sellerId) {
  // Find the seller from our global variable
  const seller = currentPendingSellers.find(s => s._id === sellerId);

  if (!seller) {
    showToast('Seller details not found', 'error');
    return;
  }

  // Generate the HTML for the modal
  const modalContent = `
    <div style="padding: 1rem; max-height: 85vh; overflow-y: auto;">
      <h2 style="margin-bottom: 1.5rem; color: var(--primary);">Seller Verification</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Business Info</h4>
          <p><strong>Store:</strong> ${seller.storeName || 'N/A'}</p>
          <p><strong>Business Name:</strong> ${seller.businessName || 'N/A'}</p>
          <p><strong>Tax ID:</strong> ${seller.taxId || 'N/A'}</p>
          <p><strong>Phone:</strong> ${seller.contactPhone || 'N/A'}</p>
        </div>
        <div>
          <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Bank Details</h4>
          <p><strong>Bank:</strong> ${seller.bankDetails?.bankName || 'N/A'}</p>
          <p><strong>Account:</strong> ${seller.bankDetails?.accountNumber || 'N/A'}</p>
          <p><strong>Account Name:</strong> ${seller.bankDetails?.accountName || 'N/A'}</p>
        </div>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Warehouse Address</h4>
        <p>${seller.warehouseAddress?.street || 'N/A'}, ${seller.warehouseAddress?.city || ''}, ${seller.warehouseAddress?.state || ''} ${seller.warehouseAddress?.postalCode || ''}</p>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Documents</h4>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
          ${seller.documents && seller.documents.length > 0 
            ? seller.documents.map(doc => `
                <a href="${doc.url}" target="_blank" style="text-decoration: none; color: var(--primary); background: #f8f9fa; padding: 10px; border-radius: 5px; border: 1px solid #ddd; display: flex; align-items: center; gap: 5px;">
                  <span>📄 View Document</span>
                </a>
              `).join('')
            : '<p>No documents uploaded</p>'
          }
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid #eee;">
        <button class="btn btn-outline" onclick="hideModal()">Close</button>
        <button class="btn" style="background: var(--error); color: white;" onclick="rejectSeller('${seller._id}')">Reject</button>
        <button class="btn" style="background: var(--success); color: white;" onclick="approveSeller('${seller._id}')">Approve Seller</button>
      </div>
    </div>
  `;

  showModal(modalContent);
}

function showAddProductModal() {
  showModal(`
    <div style="padding: 2rem;">
      <h2 style="margin-bottom: 1.5rem;">Add New Product</h2>
      <form id="addProductForm" onsubmit="addProduct(event)">
        <div class="form-group">
          <label>Name *</label>
          <input type="text" id="productName" required />
        </div>
        <div class="form-group">
          <label>Description *</label>
          <textarea id="productDescription" rows="4" required></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Price *</label>
            <input type="number" id="productPrice" step="0.01" min="0" required />
          </div>
          <div class="form-group">
            <label>Stock *</label>
            <input type="number" id="productStock" min="0" required />
          </div>
        </div>
        <div class="form-group">
          <label>Category *</label>
          <select id="productCategory" required>
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
          <input type="number" id="productEcoScore" min="1" max="10" required />
        </div>
        <div class="form-group">
          <label>Environmental Impact Summary *</label>
          <input type="text" id="productImpact" placeholder="e.g., Saves 100L water" required />
        </div>
        <div class="form-group">
          <label>Image URL *</label>
          <input type="url" id="productImage" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Add Product</button>
      </form>
    </div>
  `);
}

async function addProduct(event) {
  event.preventDefault();
  
  const product = {
    name: document.getElementById('productName').value,
    description: document.getElementById('productDescription').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    category: document.getElementById('productCategory').value,
    sustainabilityScore: parseInt(document.getElementById('productEcoScore').value),
    environmentalImpact: {
      summary: document.getElementById('productImpact').value
    },
    images: [document.getElementById('productImage').value]
  };

  try {
    await api.post('/api/admin/products', product);
    showToast('Product added successfully!', 'success');
    hideModal();
    renderAdmin();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await api.delete(`/api/admin/products/${id}`);
    showToast('Product deleted', 'success');
    renderAdmin();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await api.put(`/api/admin/orders/${orderId}/status`, { status });
    showToast('Order status updated', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function editProduct(id) {
  showToast('Edit functionality coming soon!', 'info');
}

function viewOrder(id) {
  showToast('Order details coming soon!', 'info');
}
