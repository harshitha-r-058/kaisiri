// Seller Login Page
function renderSellerLogin() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <section class="section">
      <div class="container" style="max-width: 500px;">
        <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md);">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h1>Seller Login</h1>
            <p style="color: var(--text-light); margin-top: 0.5rem;">Access your seller dashboard</p>
          </div>
          <form id="sellerLoginForm" onsubmit="handleSellerLogin(event)">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="sellerLoginEmail" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="sellerLoginPassword" required autocomplete="current-password" />
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" id="sellerLoginBtn">Sign In as Seller</button>
          </form>
          <div style="text-align: center; padding-top: 1rem; border-top: 1px solid var(--border);">
            <p style="color: var(--text-muted); margin-bottom: 0.5rem;">Not a seller yet?</p>
            <button class="btn btn-outline" onclick="navigateTo('/seller/register')" style="width: 100%;">Become a Seller</button>
          </div>
          <p style="text-align: center; color: var(--text-muted); margin-top: 1rem; font-size: 0.9rem;">
            Regular user? <a href="/login" data-link="/login" style="color: var(--primary); font-weight: 600;">Login here</a>
          </p>
        </div>
      </div>
    </section>
  `;
}

async function handleSellerLogin(event) {
  event.preventDefault();
  const btn = document.getElementById('sellerLoginBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  const email = document.getElementById('sellerLoginEmail').value;
  const password = document.getElementById('sellerLoginPassword').value;

  const success = await login(email, password);
  if (success) {
    // Check if user is actually a seller
    if (currentUser.role === 'seller' || currentUser.role === 'admin') {
      navigateTo('/seller');
    } else {
      showToast('This account is not registered as a seller', 'error');
      logout();
      btn.disabled = false;
      btn.textContent = 'Sign In as Seller';
    }
  } else {
    btn.disabled = false;
    btn.textContent = 'Sign In as Seller';
  }
}

// Seller Verification Page
function renderSellerVerification() {
  const app = document.getElementById('app');
  
  if (!currentUser || (currentUser.role !== 'seller' && currentUser.role !== 'admin')) {
    navigateTo('/seller/login');
    return;
  }

  app.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;">Loading verification status...</div>';

  loadVerificationStatus();
}

async function loadVerificationStatus() {
  try {
    const status = await api.get('/api/seller/status');
    const app = document.getElementById('app');

    if (status.verificationStatus === 'approved') {
      // Already verified, redirect to dashboard
      navigateTo('/seller');
      return;
    }

    if (status.verificationStatus === 'pending') {
      app.innerHTML = `
        <section class="section">
          <div class="container" style="max-width: 700px;">
            <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md); text-align: center;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
              <h1 style="margin-bottom: 1rem;">Verification Pending</h1>
              <p style="color: var(--text-light); margin-bottom: 1.5rem;">
                Your seller verification is under review by our admin team.
              </p>
              <div style="background: var(--bg-alt); padding: 1.5rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
                <p style="font-size: 0.9rem; color: var(--text-muted);">
                  <strong>Submitted:</strong> ${new Date(status.verificationSubmittedAt).toLocaleDateString()}
                </p>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">
                  We typically review applications within 24-48 hours.
                </p>
              </div>
              <button class="btn btn-outline" onclick="navigateTo('/')">Go to Homepage</button>
            </div>
          </div>
        </section>
      `;
      return;
    }

    if (status.verificationStatus === 'rejected') {
      app.innerHTML = `
        <section class="section">
          <div class="container" style="max-width: 700px;">
            <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md);">
              <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
                <h1 style="margin-bottom: 1rem; color: var(--error);">Verification Rejected</h1>
                <p style="color: var(--text-light);">
                  Unfortunately, your seller verification was not approved.
                </p>
              </div>
              ${status.rejectionReason ? `
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; margin-bottom: 1.5rem;">
                  <strong>Reason:</strong> ${status.rejectionReason}
                </div>
              ` : ''}
              <p style="margin-bottom: 1.5rem; color: var(--text-light);">
                You can resubmit your verification with updated information.
              </p>
              <button class="btn btn-primary" style="width: 100%;" onclick="showVerificationForm()">Resubmit Verification</button>
            </div>
          </div>
        </section>
      `;
      return;
    }

    // Show verification form
    showVerificationForm();

  } catch (error) {
    document.getElementById('app').innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h2>Error loading verification status</h2>
        <p style="color: var(--text-light);">${error.message}</p>
      </div>
    `;
  }
}

function showVerificationForm() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <section class="section">
      <div class="container" style="max-width: 800px;">
        <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md);">
          <h1 style="margin-bottom: 1rem;">Seller Verification</h1>
          <p style="color: var(--text-light); margin-bottom: 2rem;">
            Please provide your business and warehouse details for verification.
          </p>

          <form id="verificationForm" onsubmit="submitVerification(event)" enctype="multipart/form-data">
            <h3 style="margin-bottom: 1rem; color: var(--primary);">Business Information</h3>
            
            <div class="form-group">
              <label>Business Name *</label>
              <input type="text" name="businessName" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Business Registration Number *</label>
                <input type="text" name="businessRegistration" required />
              </div>
              <div class="form-group">
                <label>Tax ID / VAT Number *</label>
                <input type="text" name="taxId" required />
              </div>
            </div>

            <h3 style="margin: 2rem 0 1rem; color: var(--primary);">Warehouse Address</h3>
            
            <div class="form-group">
              <label>Street Address *</label>
              <input type="text" name="warehouseStreet" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>City *</label>
                <input type="text" name="warehouseCity" required />
              </div>
              <div class="form-group">
                <label>State/Province *</label>
                <input type="text" name="warehouseState" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Postal Code *</label>
                <input type="text" name="warehousePostalCode" required />
              </div>
              <div class="form-group">
                <label>Country *</label>
                <input type="text" name="warehouseCountry" required />
              </div>
            </div>

            <h3 style="margin: 2rem 0 1rem; color: var(--primary);">Contact Information</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Contact Phone *</label>
                <input type="tel" name="contactPhone" required />
              </div>
              <div class="form-group">
                <label>Business Email *</label>
                <input type="email" name="businessEmail" required />
              </div>
            </div>

            <h3 style="margin: 2rem 0 1rem; color: var(--primary);">Bank Details (for payments)</h3>
            
            <div class="form-group">
              <label>Account Name *</label>
              <input type="text" name="accountName" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Account Number *</label>
                <input type="text" name="accountNumber" required />
              </div>
              <div class="form-group">
                <label>Bank Name *</label>
                <input type="text" name="bankName" required />
              </div>
            </div>

            <div class="form-group">
              <label>Routing Number / SWIFT Code</label>
              <input type="text" name="routingNumber" />
            </div>

            <h3 style="margin: 2rem 0 1rem; color: var(--primary);">Supporting Documents</h3>
            
            <div class="form-group">
              <label>Upload Documents (Business License, Tax Certificate, Warehouse Proof)</label>
              <input type="file" name="documents" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
              <small style="color: var(--text-muted);">
                Upload up to 5 documents (PDF, DOC, DOCX, JPG, PNG). Max 5MB each.
              </small>
            </div>

            <div style="background: var(--bg-alt); padding: 1rem; border-radius: var(--radius-sm); margin: 1.5rem 0;">
              <p style="font-size: 0.9rem; color: var(--text-muted);">
                <strong>Note:</strong> All information will be verified by our admin team. 
                Please ensure all details are accurate and documents are clear and legible.
              </p>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="verifySubmitBtn">
              Submit for Verification
            </button>
          </form>
        </div>
      </div>
    </section>
  `;
}

async function submitVerification(event) {
  event.preventDefault();
  const btn = document.getElementById('verifySubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/api/seller/verify', {
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

    const result = await response.json();
    showToast(result.message, 'success');
    
    // Redirect to pending status page
    setTimeout(() => {
      renderSellerVerification();
    }, 1500);

  } catch (error) {
    showToast(error.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Submit for Verification';
  }
}
