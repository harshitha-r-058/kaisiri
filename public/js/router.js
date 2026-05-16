// Simple SPA router
const routes = {
  '/': renderHome,
  '/products': renderProducts,
  '/product/:id': renderProductDetail,
  '/cart': renderCartPage,
  '/checkout': renderCheckout,
  '/orders': renderOrders,
  '/wishlist': renderWishlist,
  '/login': renderLogin,
  '/register': renderRegister,
  '/admin': renderAdmin,
  '/profile': renderProfile,
  '/seller': renderSellerDashboard,
  '/seller/register': renderSellerRegister,
  '/seller/login': renderSellerLogin,
  '/seller/verify': renderSellerVerification
};

function navigateTo(path) {
  window.history.pushState({}, '', path);
  router();
}

function router() {
  const path = window.location.pathname;
  
  // Match dynamic routes
  for (const [route, handler] of Object.entries(routes)) {
    const paramNames = [];
    const regexPath = route.replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });
    
    const match = path.match(new RegExp(`^${regexPath}$`));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      handler(params);
      return;
    }
  }
  
  // 404
  document.getElementById('app').innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p><button class="btn btn-primary" onclick="navigateTo(\'/\')">Go Home</button></div>';
}

// Handle browser back/forward
window.addEventListener('popstate', router);

// Handle link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (link) {
    e.preventDefault();
    const path = link.getAttribute('data-link') || link.getAttribute('href');
    navigateTo(path);
  }
});

// Search functionality
document.getElementById('searchBtn')?.addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  if (query) navigateTo(`/products?search=${encodeURIComponent(query)}`);
});

document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.trim();
    if (query) navigateTo(`/products?search=${encodeURIComponent(query)}`);
  }
});
