# 🏪 Seller Feature Guide - Kaisiri

## Overview

Kaisiri now supports **multi-vendor marketplace** functionality! Sellers can register, add their own eco-friendly products, and manage their store.

## ✨ New Features

### For Sellers
- ✅ Seller registration with store details
- ✅ Seller dashboard with stats (products, orders, revenue)
- ✅ Add products with image upload
- ✅ Edit and delete own products
- ✅ View orders containing their products
- ✅ Track sales and revenue

### For Admins
- ✅ Approve/reject seller products
- ✅ View all sellers
- ✅ Manage seller accounts

### For Users
- ✅ See seller information on products
- ✅ Browse products from multiple sellers
- ✅ Order from different sellers in one cart

## 🚀 Quick Start

### 1. Become a Seller

**Option A: Register as New Seller**
```
1. Go to http://localhost:5000/seller/register
2. Fill in:
   - Your Name
   - Email
   - Password
   - Store Name
   - Store Description
3. Click "Create Seller Account"
```

**Option B: Upgrade Existing Account**
- Contact admin to upgrade your account to seller role

### 2. Access Seller Dashboard

```
1. Login with seller account
2. Click your avatar → "Seller Dashboard"
3. View your stats and products
```

### 3. Add Your First Product

```
1. In Seller Dashboard, click "+ Add New Product"
2. Fill in product details:
   - Name, Description
   - Price, Stock
   - Category
   - Sustainability Score (1-10)
   - Environmental Impact
   - Materials
   - Upload images (up to 5)
3. Click "Add Product"
4. Product appears in your dashboard
```

## 📋 Product Requirements

### Required Fields
- ✅ Product Name
- ✅ Description
- ✅ Price
- ✅ Stock quantity
- ✅ Category
- ✅ Sustainability Score (1-10)
- ✅ Environmental Impact Summary

### Optional Fields
- Short Description
- Original Price (for discounts)
- Materials (comma-separated)
- Certifications
- Origin/Country
- Product Images (up to 5)

### Image Requirements
- **Format:** JPEG, JPG, PNG, WEBP
- **Size:** Max 5MB per image
- **Quantity:** Up to 5 images per product
- **Recommended:** 800x800px or larger

## 🎯 Seller Dashboard Features

### Stats Overview
- **Total Products** - All your products
- **Active Products** - Products in stock
- **Total Orders** - Orders containing your products
- **Total Revenue** - Your earnings

### Product Management
- View all your products in a table
- See product status (Approved/Pending)
- Edit product details
- Delete products
- Track stock levels

### Order Management
- View orders containing your products
- See customer information
- Track order status
- Calculate your revenue per order

## 💰 Revenue Calculation

```
Your Revenue = Sum of (Your Product Price × Quantity) in each order
```

Example:
```
Order #KSR-123:
- Your Product A: $29.99 × 2 = $59.98
- Another Seller's Product: $19.99 × 1 = (not counted)
Your Revenue from this order: $59.98
```

## 🔒 Product Approval System

### Auto-Approval
- **Verified Sellers:** Products auto-approved
- **New Sellers:** Products pending admin approval

### Approval Process
1. Seller adds product
2. Product status: "Pending"
3. Admin reviews product
4. Admin approves/rejects
5. If approved: Product visible to customers

## 📊 API Endpoints

### Seller Routes (Protected)

**Dashboard Stats**
```
GET /api/seller/dashboard
Authorization: Bearer {token}
```

**Get Seller's Products**
```
GET /api/seller/products
Authorization: Bearer {token}
```

**Add Product**
```
POST /api/seller/products
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- name: string
- description: string
- price: number
- stock: number
- category: string
- sustainabilityScore: number (1-10)
- impactSummary: string
- materials: string (comma-separated)
- images: file[] (up to 5)
```

**Update Product**
```
PUT /api/seller/products/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Delete Product**
```
DELETE /api/seller/products/:id
Authorization: Bearer {token}
```

**Get Orders**
```
GET /api/seller/orders
Authorization: Bearer {token}
```

**Update Profile**
```
PUT /api/seller/profile
Authorization: Bearer {token}

Body:
{
  "storeName": "My Eco Store",
  "storeDescription": "Selling sustainable products"
}
```

## 🗄️ Database Schema Updates

### User Model
```javascript
{
  role: 'user' | 'seller' | 'admin',
  storeName: String,
  storeDescription: String,
  sellerVerified: Boolean,
  totalSales: Number,
  sellerRating: Number
}
```

### Product Model
```javascript
{
  seller: ObjectId (ref: User),
  sellerName: String,
  approved: Boolean,
  // ... existing fields
}
```

## 🎨 Frontend Pages

### New Pages
1. **/seller** - Seller Dashboard
2. **/seller/register** - Seller Registration

### Updated Pages
- User dropdown now shows "Seller Dashboard" link
- Products show seller information
- Admin panel shows seller products

## 🔐 Security & Permissions

### Seller Permissions
- ✅ Can add products
- ✅ Can edit own products only
- ✅ Can delete own products only
- ✅ Can view orders with their products
- ❌ Cannot edit other sellers' products
- ❌ Cannot access admin functions

### Admin Permissions
- ✅ All seller permissions
- ✅ Can approve/reject any product
- ✅ Can edit any product
- ✅ Can delete any product
- ✅ Can manage sellers

## 📝 Example: Adding a Product

### Via Dashboard UI
1. Login as seller
2. Go to Seller Dashboard
3. Click "+ Add New Product"
4. Fill form:
   ```
   Name: Organic Bamboo Toothbrush
   Description: Eco-friendly toothbrush made from sustainable bamboo
   Price: 8.99
   Stock: 100
   Category: Reusable Essentials
   Sustainability Score: 9
   Impact: Replaces plastic toothbrushes, biodegradable
   Materials: Bamboo, BPA-free nylon bristles
   ```
5. Upload images
6. Submit

### Via API (cURL)
```bash
curl -X POST http://localhost:5000/api/seller/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Organic Bamboo Toothbrush" \
  -F "description=Eco-friendly toothbrush" \
  -F "price=8.99" \
  -F "stock=100" \
  -F "category=reusable-essentials" \
  -F "sustainabilityScore=9" \
  -F "impactSummary=Replaces plastic toothbrushes" \
  -F "materials=Bamboo, BPA-free nylon" \
  -F "images=@toothbrush1.jpg" \
  -F "images=@toothbrush2.jpg"
```

## 🧪 Testing

### Test Seller Account
Create a test seller:
```bash
# Via UI
1. Go to /seller/register
2. Register with:
   - Name: Test Seller
   - Email: seller@test.com
   - Password: test123
   - Store: Eco Test Store
```

### Test Product Upload
1. Login as seller
2. Add product with all fields
3. Upload 2-3 images
4. Verify product appears in dashboard
5. Check product on main products page

### Test Order Flow
1. Login as regular user
2. Add seller's product to cart
3. Complete checkout
4. Login as seller
5. Check order in seller dashboard

## 🐛 Troubleshooting

### Images Not Uploading
**Issue:** "Only image files are allowed"
**Fix:** Use JPEG, JPG, PNG, or WEBP format

**Issue:** "File too large"
**Fix:** Compress images to under 5MB

### Product Not Visible
**Issue:** Product added but not showing
**Fix:** Check if product is approved (admin approval required for new sellers)

### Cannot Access Seller Dashboard
**Issue:** "Seller Access Required"
**Fix:** Make sure you registered as seller, not regular user

## 📈 Future Enhancements

### Planned Features
- [ ] Seller analytics dashboard
- [ ] Bulk product upload (CSV)
- [ ] Seller ratings and reviews
- [ ] Commission system
- [ ] Payout management
- [ ] Seller messaging system
- [ ] Product variants (sizes, colors)
- [ ] Inventory alerts
- [ ] Sales reports export

## 🎓 Best Practices

### For Sellers
1. **High-Quality Images** - Use clear, well-lit photos
2. **Detailed Descriptions** - Explain eco-benefits clearly
3. **Accurate Stock** - Keep inventory updated
4. **Competitive Pricing** - Research similar products
5. **Sustainability Focus** - Highlight environmental impact

### For Admins
1. **Review Products** - Approve quality eco-products
2. **Verify Sellers** - Check seller legitimacy
3. **Monitor Quality** - Ensure product standards
4. **Support Sellers** - Help with issues

## 📞 Support

### For Sellers
- Email: seller-support@kaisiri.com
- Dashboard: Help section
- Documentation: This guide

### For Admins
- Admin panel → Seller Management
- Review pending products
- Manage seller accounts

---

## 🎉 Success!

You now have a complete multi-vendor marketplace where:
- ✅ Sellers can register and add products
- ✅ Products are stored in database
- ✅ Images are uploaded to server
- ✅ Orders track seller revenue
- ✅ Admins can manage everything

**Start selling eco-friendly products today!** 🌿
