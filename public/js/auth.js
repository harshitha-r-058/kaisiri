// Authentication state management
let currentUser = null;

async function initAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    updateNavbar(null);
    return;
  }

  try {
    currentUser = await api.get('/api/auth/me');
    updateNavbar(currentUser);
  } catch (error) {
    localStorage.removeItem('token');
    currentUser = null;
    updateNavbar(null);
  }
}

function updateNavbar(user) {
  const navUser = document.getElementById('navUser');
  const navUserMenu = document.getElementById('navUserMenu');
  const adminLink = document.getElementById('adminLink');

  if (user) {
    navUser.classList.add('hidden');
    navUserMenu.classList.remove('hidden');
    document.getElementById('userInitial').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('dropdownName').textContent = user.name;
    document.getElementById('dropdownPoints').textContent = `🌱 ${user.ecoPoints || 0} pts`;
    
    if (user.role === 'admin') {
      adminLink.classList.remove('hidden');
    } else {
      adminLink.classList.add('hidden');
    }
    
    // Show/hide seller link
    const sellerLink = document.getElementById('sellerLink');
    if (sellerLink) {
      if (user.role === 'seller' || user.role === 'admin') {
        sellerLink.classList.remove('hidden');
      } else {
        sellerLink.classList.add('hidden');
      }
    }
  } else {
    navUser.classList.remove('hidden');
    navUserMenu.classList.add('hidden');
  }
}

async function login(email, password) {
  try {
    const data = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    currentUser = data.user;
    updateNavbar(currentUser);
    showToast('Welcome back!', 'success');
    return true;
  } catch (error) {
    showToast(error.message, 'error');
    return false;
  }
}

async function register(name, email, password, role = 'user', storeName = '', storeDescription = '') {
  try {
    const data = await api.post('/api/auth/register', { name, email, password, role, storeName, storeDescription });
    localStorage.setItem('token', data.token);
    currentUser = data.user;
    updateNavbar(currentUser);
    showToast('Account created successfully!', 'success');
    return true;
  } catch (error) {
    showToast(error.message, 'error');
    return false;
  }
}

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  updateNavbar(null);
  api.post('/api/auth/logout').catch(() => {});
  showToast('Logged out successfully', 'info');
  navigateTo('/');
}

document.getElementById('logoutBtn')?.addEventListener('click', logout);

// User avatar dropdown toggle
document.getElementById('userAvatarBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById('userDropdown');
  dropdown.style.opacity = dropdown.style.opacity === '1' ? '0' : '1';
  dropdown.style.visibility = dropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
});

// Hamburger menu
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('active');
});
