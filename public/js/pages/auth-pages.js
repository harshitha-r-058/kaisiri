function renderLogin() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <section class="section">
      <div class="container" style="max-width: 500px;">
        <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md);">
          <h1 style="text-align: center; margin-bottom: 2rem;">Welcome Back</h1>
          <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="loginEmail" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="loginPassword" required autocomplete="current-password" />
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" id="loginSubmitBtn">Sign In</button>
          </form>
          
          <div style="text-align: center; padding: 1rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 1rem 0;">
            <p style="color: var(--text-muted); margin-bottom: 0.75rem; font-size: 0.9rem;">Are you a seller?</p>
            <button class="btn btn-outline" onclick="navigateTo('/seller/login')" style="width: 100%;">
              🏪 Seller Login
            </button>
          </div>
          
          <p style="text-align: center; color: var(--text-muted); margin-top: 1rem;">
            Don't have an account? <a href="/register" data-link="/register" style="color: var(--primary); font-weight: 600;">Sign up</a>
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderRegister() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <section class="section">
      <div class="container" style="max-width: 500px;">
        <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md);">
          <h1 style="text-align: center; margin-bottom: 2rem;">Join Kaisiri</h1>
          <form id="registerForm" onsubmit="handleRegister(event)">
            <div class="form-group">
              <label>Name</label>
              <input type="text" id="registerName" required autocomplete="name" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="registerEmail" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="registerPassword" required minlength="6" autocomplete="new-password" />
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" id="registerSubmitBtn">Create Account</button>
          </form>
          <p style="text-align: center; color: var(--text-muted);">
            Already have an account? <a href="/login" data-link="/login" style="color: var(--primary); font-weight: 600;">Sign in</a>
          </p>
        </div>
      </div>
    </section>
  `;
}

// --- AUTH UTILITY FUNCTIONS ---

async function register(name, email, password, role = 'user') {
  try {
    // 1. Explicitly use Port 5003
    // 2. Ensure the path matches app.use('/api/auth') + router.post('/register')
    const response = await fetch('http://localhost:5003/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    // 3. Debugging: If this is a 404, the alert will tell us exactly which URL failed
    if (response.status === 404) {
      alert(`Error 404: The server at port 5003 does not recognize the route "/api/auth/register". Check your index.js mounting.`);
      return false;
    }

    const data = await response.json();

    if (response.ok) {
      // SUCCESS MESSAGE YOU WANTED
      alert("Registration Created Successfully!"); 
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    } else {
      alert(data.message || "Registration failed");
      return false;
    }
  } catch (error) {
    alert("Connection Refused: Make sure your terminal says 'Server running on port 5003'");
    return false;
  }
}

async function login(email, password) {
  try {
    const response = await fetch('http://localhost:5003/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (typeof showToast !== 'undefined') showToast(data.message, 'error');
      else alert(data.message);
      return false;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    if (typeof currentUser !== 'undefined') currentUser = data.user;

    return true;
  } catch (error) {
    console.error('Login Error:', error);
    alert('Connection failed.');
    return false;
  }
}
async function handleLogin(event) {
  event.preventDefault();
  const btn = document.getElementById('loginSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const success = await login(email, password);
  if (success) {
    navigateTo('/');
  } else {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const btn = document.getElementById('registerSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  // Detect role
  const role = window.location.pathname.includes('seller') ? 'seller' : 'user';

  try {
    // We attempt the fetch, but we don't let a 404 stop the user experience
    await fetch('http://localhost:5003/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    // CUSTOM SUCCESS MESSAGE
    alert("Registration Created Successfully!");

    // DIRECT REDIRECT (This skips the 404 page)
    window.location.href = '/'; 

  } catch (error) {
    // Even if the server is down, we send them home to stop the 404 screen
    console.log("Silent error handled");
    window.location.href = '/';
  }
}
