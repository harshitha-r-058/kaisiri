// Main application initialization
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🌿 Kaisiri - Eco-Friendly E-commerce Platform');
  
  // Initialize authentication
  await initAuth();
  
  // Load cart
  await loadCart();
  
  // Initial route
  router();
});
