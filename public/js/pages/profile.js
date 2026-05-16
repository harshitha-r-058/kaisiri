async function renderProfile() {
  const app = document.getElementById('app');
  
  if (!currentUser) {
    navigateTo('/login');
    return;
  }

  app.innerHTML = `
    <section class="section">
      <div class="container" style="max-width: 800px;">
        <h1 style="margin-bottom: 2rem;">My Profile</h1>
        
        <div style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700;">
              ${currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style="margin-bottom: 0.5rem;">${currentUser.name}</h2>
              <p style="color: var(--text-muted);">${currentUser.email}</p>
              <div style="margin-top: 0.5rem; display: flex; gap: 1rem;">
                <span style="background: var(--success); color: white; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                  🌱 ${currentUser.ecoPoints || 0} Eco Points
                </span>
                ${currentUser.role === 'admin' ? '<span style="background: var(--accent); color: white; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Admin</span>' : ''}
              </div>
            </div>
          </div>

          <form id="profileForm" onsubmit="updateProfile(event)">
            <div class="form-group">
              <label>Name</label>
              <input type="text" id="profileName" value="${currentUser.name}" required />
            </div>
            <div class="form-group">
              <label>Email (cannot be changed)</label>
              <input type="email" value="${currentUser.email}" disabled />
            </div>
            <button type="submit" class="btn btn-primary" id="profileSubmitBtn">Update Profile</button>
          </form>
        </div>

        <div style="background: white; padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
          <h3 style="margin-bottom: 1rem;">Preferred Categories</h3>
          <p style="color: var(--text-light); margin-bottom: 1rem; font-size: 0.9rem;">
            Select your favorite product categories to get better recommendations
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;" id="categoryPreferences">
            ${['sustainable-clothing', 'eco-home', 'reusable-essentials', 'organic-food', 'natural-beauty', 'green-tech'].map(cat => `
              <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border: 2px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">
                <input type="checkbox" value="${cat}" ${currentUser.preferredCategories?.includes(cat) ? 'checked' : ''} onchange="updatePreferences()" />
                <span>${formatCategory(cat)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

async function updateProfile(event) {
  event.preventDefault();
  const btn = document.getElementById('profileSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Updating...';

  const name = document.getElementById('profileName').value;

  try {
    await api.put('/api/auth/profile', { name });
    currentUser.name = name;
    updateNavbar(currentUser);
    showToast('Profile updated successfully!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Update Profile';
  }
}

async function updatePreferences() {
  const checkboxes = document.querySelectorAll('#categoryPreferences input[type="checkbox"]');
  const preferredCategories = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  try {
    await api.put('/api/auth/profile', { preferredCategories });
    currentUser.preferredCategories = preferredCategories;
    showToast('Preferences updated!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}
