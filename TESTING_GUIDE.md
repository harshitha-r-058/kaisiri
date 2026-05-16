# 🧪 Testing Guide - Kaisiri

This guide helps you test all features of the Kaisiri e-commerce platform.

## Quick Test Checklist

Use this checklist to verify the application is working correctly:

### ✅ Initial Setup
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Database seeded with products
- [ ] Homepage loads at http://localhost:5000

### ✅ User Authentication
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can logout
- [ ] User menu shows after login
- [ ] Eco points display in menu

### ✅ Product Browsing
- [ ] Products display on homepage
- [ ] Featured products section loads
- [ ] Recommendations section loads
- [ ] Can navigate to products page
- [ ] Product grid displays correctly
- [ ] Product images load

### ✅ Search & Filters
- [ ] Search bar works
- [ ] Category filter works
- [ ] Price filter works
- [ ] Eco score filter works
- [ ] Sort options work
- [ ] Pagination works

### ✅ Product Details
- [ ] Can click product to view details
- [ ] Product images display
- [ ] Eco score badge shows
- [ ] Environmental impact displays
- [ ] Similar products load
- [ ] Reviews section displays

### ✅ Shopping Cart
- [ ] Can add product to cart
- [ ] Cart badge updates
- [ ] Can view cart page
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Subtotal calculates correctly
- [ ] Shipping cost shows
- [ ] Tax calculates

### ✅ Checkout
- [ ] Can proceed to checkout
- [ ] Shipping form displays
- [ ] Can fill out address
- [ ] Order summary shows
- [ ] Can place order
- [ ] Order confirmation appears
- [ ] Cart clears after order

### ✅ Order History
- [ ] Orders page displays
- [ ] Past orders show
- [ ] Order details correct
- [ ] Eco impact displays
- [ ] Order status shows

### ✅ Wishlist
- [ ] Can add to wishlist
- [ ] Heart icon toggles
- [ ] Wishlist page displays
- [ ] Can remove from wishlist
- [ ] Can add to cart from wishlist

### ✅ Reviews
- [ ] Can submit review (when logged in)
- [ ] Review appears on product
- [ ] Average rating updates
- [ ] Review count updates

### ✅ User Profile
- [ ] Profile page loads
- [ ] User info displays
- [ ] Can update name
- [ ] Can select category preferences
- [ ] Eco points show

### ✅ Admin Panel
- [ ] Can login as admin
- [ ] Admin link appears in menu
- [ ] Dashboard loads
- [ ] Stats display correctly
- [ ] Product table shows
- [ ] Can add new product
- [ ] Can delete product
- [ ] Order table shows
- [ ] Can update order status

### ✅ Responsive Design
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Hamburger menu works on mobile
- [ ] Touch interactions work

## Detailed Test Scenarios

### Scenario 1: New User Journey

**Goal:** Test complete user flow from registration to order

1. **Register**
   ```
   - Go to homepage
   - Click "Join" button
   - Fill in: Name, Email, Password
   - Click "Create Account"
   - Verify: Redirected to homepage, logged in
   ```

2. **Browse Products**
   ```
   - Click "Shop Now"
   - Verify: Products display in grid
   - Try filters: Category, Price, Eco Score
   - Try sorting: Price, Rating, Eco Score
   - Verify: Results update correctly
   ```

3. **View Product**
   ```
   - Click any product
   - Verify: Detail page loads
   - Check: Images, price, description, eco score
   - Check: Environmental impact section
   - Check: Similar products section
   ```

4. **Add to Cart**
   ```
   - Click "Add to Cart"
   - Verify: Toast notification appears
   - Verify: Cart badge updates (shows 1)
   - Click cart icon
   - Verify: Product appears in cart
   ```

5. **Checkout**
   ```
   - Click "Proceed to Checkout"
   - Fill shipping address:
     - Full Name: John Doe
     - Address: 123 Green St
     - City: Portland
     - Postal Code: 97201
     - Country: United States
   - Click "Place Order"
   - Verify: Order confirmation
   - Verify: Redirected to orders page
   ```

6. **View Order**
   ```
   - Check order appears in list
   - Verify: Order number, items, total
   - Verify: Eco impact shows
   - Verify: Eco points awarded
   ```

### Scenario 2: Admin Workflow

**Goal:** Test admin product and order management

1. **Login as Admin**
   ```
   - Logout if logged in
   - Click "Sign In"
   - Email: admin@kaisiri.com
   - Password: admin123
   - Click "Sign In"
   - Verify: Admin link appears in menu
   ```

2. **View Dashboard**
   ```
   - Click "Admin Panel"
   - Verify: Stats display (products, orders, users, revenue)
   - Verify: Product table loads
   - Verify: Order table loads
   ```

3. **Add Product**
   ```
   - Click "Add Product"
   - Fill form:
     - Name: Test Eco Product
     - Description: A sustainable test product
     - Price: 29.99
     - Stock: 50
     - Category: Reusable Essentials
     - Eco Score: 9
     - Impact: Saves 100L water
     - Image: https://images.unsplash.com/photo-1...
   - Click "Add Product"
   - Verify: Product appears in table
   ```

4. **Update Order Status**
   ```
   - Find any order in table
   - Change status dropdown: Pending → Processing
   - Verify: Status updates
   - Verify: Toast notification
   ```

5. **Delete Product**
   ```
   - Find test product in table
   - Click "Delete"
   - Confirm deletion
   - Verify: Product removed from table
   ```

### Scenario 3: Wishlist & Reviews

**Goal:** Test wishlist and review functionality

1. **Add to Wishlist**
   ```
   - Browse products
   - Click heart icon on any product
   - Verify: Toast "Added to wishlist"
   - Click heart again
   - Verify: Toast "Removed from wishlist"
   - Add 3 products to wishlist
   ```

2. **View Wishlist**
   ```
   - Click wishlist icon in nav
   - Verify: 3 products display
   - Click "Add to Cart" on one
   - Verify: Added to cart
   - Click heart to remove one
   - Verify: Product removed
   ```

3. **Submit Review**
   ```
   - Go to any product detail page
   - Scroll to reviews section
   - Select rating: 5 stars
   - Write comment: "Great eco-friendly product!"
   - Click "Submit Review"
   - Verify: Review appears
   - Verify: Average rating updates
   ```

### Scenario 4: Recommendations

**Goal:** Test AI recommendation system

1. **View Products**
   ```
   - Browse several products in "Sustainable Clothing"
   - Click to view details on 3-4 products
   - Note: System tracks views
   ```

2. **Set Preferences**
   ```
   - Go to Profile
   - Select preferred categories:
     - Sustainable Clothing
     - Eco-Friendly Home
   - Verify: Preferences saved
   ```

3. **Check Recommendations**
   ```
   - Go to homepage
   - Scroll to "Recommended For You"
   - Verify: Products match viewed/preferred categories
   - Verify: High eco-score products prioritized
   ```

4. **Similar Products**
   ```
   - Go to any product detail
   - Scroll to "Similar Products"
   - Verify: Products from same category
   - Verify: Similar eco scores
   ```

### Scenario 5: Search & Filters

**Goal:** Test search and filtering accuracy

1. **Text Search**
   ```
   - Search: "bamboo"
   - Verify: Only bamboo products show
   - Search: "organic"
   - Verify: Organic products show
   - Search: "xyz123" (nonsense)
   - Verify: "No products found" message
   ```

2. **Category Filter**
   ```
   - Select: Sustainable Clothing
   - Verify: Only clothing shows
   - Select: Eco-Friendly Home
   - Verify: Only home products show
   ```

3. **Price Filter**
   ```
   - Min: 20, Max: 50
   - Verify: Only products $20-$50 show
   - Min: 100, Max: 200
   - Verify: "No products found" (if none in range)
   ```

4. **Eco Score Filter**
   ```
   - Select: 9+
   - Verify: Only products with score 9-10 show
   - Select: 10
   - Verify: Only perfect score products show
   ```

5. **Combined Filters**
   ```
   - Category: Reusable Essentials
   - Price: 10-30
   - Eco Score: 8+
   - Sort: Price Low to High
   - Verify: Results match all criteria
   ```

## API Testing

### Using cURL

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Products**
```bash
curl http://localhost:5000/api/products
```

**Get Product by ID**
```bash
curl http://localhost:5000/api/products/PRODUCT_ID
```

### Using Postman

1. Import collection (create from API endpoints in README)
2. Set environment variable: `baseUrl = http://localhost:5000`
3. Test each endpoint
4. Verify responses

## Performance Testing

### Load Time
- Homepage should load < 2 seconds
- Product pages should load < 1 second
- API responses should be < 500ms

### Database Queries
```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2)

// Check slow queries
db.system.profile.find({millis: {$gt: 100}})
```

### Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check:
   - Total load time
   - Number of requests
   - Total size
   - Largest files

## Security Testing

### Authentication
- [ ] Cannot access protected routes without login
- [ ] Cannot access admin routes without admin role
- [ ] JWT tokens expire correctly
- [ ] Passwords are hashed (check database)

### Input Validation
- [ ] Cannot submit empty forms
- [ ] Email validation works
- [ ] Password minimum length enforced
- [ ] Price must be positive number
- [ ] Quantity must be positive integer

### XSS Prevention
```javascript
// Try injecting script in review
<script>alert('XSS')</script>
// Should be escaped/sanitized
```

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Can submit forms with Enter
- [ ] Can close modals with Escape
- [ ] Focus indicators visible

### Screen Reader
- [ ] Images have alt text
- [ ] Buttons have aria-labels
- [ ] Form inputs have labels
- [ ] Headings are hierarchical

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Links distinguishable
- [ ] Buttons have sufficient contrast

## Common Issues & Solutions

### Issue: Products not loading
**Check:**
- MongoDB is running
- Database is seeded
- Network tab for errors
- Console for JavaScript errors

### Issue: Cart not updating
**Check:**
- User is logged in
- API endpoint responding
- Browser console for errors
- Network tab for failed requests

### Issue: Images not displaying
**Check:**
- Image URLs are valid
- Network connection
- CORS settings
- Browser console

### Issue: Admin panel not accessible
**Check:**
- Logged in as admin user
- Email: admin@kaisiri.com
- Password: admin123
- Role is 'admin' in database

## Automated Testing (Future)

### Unit Tests (Jest)
```javascript
// Example test structure
describe('Product Model', () => {
  test('should create product with valid data', () => {
    // Test implementation
  });
});
```

### Integration Tests (Supertest)
```javascript
// Example API test
describe('POST /api/auth/register', () => {
  test('should register new user', async () => {
    // Test implementation
  });
});
```

### E2E Tests (Cypress)
```javascript
// Example E2E test
describe('User can complete purchase', () => {
  it('should add product to cart and checkout', () => {
    // Test implementation
  });
});
```

## Test Data

### Test Users
```
Regular User:
- Email: user@test.com
- Password: test123

Admin User:
- Email: admin@kaisiri.com
- Password: admin123
```

### Test Products
- 15+ products seeded automatically
- Various categories, prices, eco scores
- Sample reviews included

### Test Orders
- Create by completing checkout
- Various statuses can be set by admin

## Reporting Issues

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/device
5. Screenshots (if applicable)
6. Console errors (if any)

## Success Criteria

The application passes testing if:
- ✅ All checklist items pass
- ✅ No console errors
- ✅ All API endpoints respond correctly
- ✅ Responsive on all screen sizes
- ✅ Accessible via keyboard
- ✅ Fast load times (< 3s)
- ✅ Secure (no exposed secrets)

---

**Happy Testing!** 🧪

If you find any issues, refer to the troubleshooting section in README.md
