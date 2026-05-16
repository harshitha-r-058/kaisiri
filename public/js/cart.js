// Cart management
let cart = [];

async function loadCart() {
  if (!currentUser) {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCartBadge();
    return cart;
  }

  try {
    cart = await api.get('/api/cart');
    updateCartBadge();
    return cart;
  } catch (error) {
    console.error('Failed to load cart:', error);
    return [];
  }
}

async function addToCart(productId, quantity = 1) {
  if (!currentUser) {
    showToast('Please sign in to add items to cart', 'info');
    navigateTo('/login');
    return;
  }

  try {
    cart = await api.post('/api/cart', { productId, quantity });
    updateCartBadge();
    showToast('Added to cart!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function updateCartItem(productId, quantity) {
  if (!currentUser) return;

  try {
    cart = await api.put(`/api/cart/${productId}`, { quantity });
    updateCartBadge();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function removeFromCart(productId) {
  if (!currentUser) return;

  try {
    cart = await api.delete(`/api/cart/${productId}`);
    updateCartBadge();
    showToast('Removed from cart', 'info');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function clearCart() {
  if (!currentUser) return;

  try {
    cart = await api.delete('/api/cart');
    updateCartBadge();
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'block' : 'none';
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
}
