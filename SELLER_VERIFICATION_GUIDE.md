# 🔐 Seller Verification System - Complete Guide

## Overview

Kaisiri now has a **complete seller verification system** where sellers must submit business and warehouse details for admin approval before they can add products.

## 🎯 New Features

### 1. Seller Verification Process
- ✅ Sellers register with basic info
- ✅ Submit detailed business/warehouse information
- ✅ Upload supporting documents
- ✅ Wait for admin approval
- ✅ Get approved/rejected with feedback
- ✅ Access dashboard only after approval

### 2. Separate Seller Login
- ✅ Dedicated seller login page at `/seller/login`
- ✅ Validates user is actually a seller
- ✅ Redirects to verification if not approved

### 3. Admin Verification Panel
- ✅ View all pending seller verifications
- ✅ See complete business details
- ✅ Approve or reject with reason
- ✅ Track verification history

### 4. New Admin Credentials
- ✅ **Old credentials removed**
- ✅ **New secure credentials**
- ✅ Must re-seed database

## 🔑 New Admin Credentials

### ⚠️ IMPORTANT: Admin Credentials Changed!

**New Admin Login:**
```
Email: admin@kaisiri.eco
Password: Admin@2024!Secure
```

**Old credentials (`admin@kaisiri.com` / `admin123`) are NO LONGER VALID!**

## 🚀 Quick Start

### Step 1: Update Database

```bash
# Clean and re-seed with new admin
npm run fix-db
npm run seed
npm start
```

### Step 2: Test Seller Flow

**A. Register as Seller**
```
1. Go to: http://localhost:5000/seller/register
2. Fill in:
   - Name: Test Seller
   - Email: seller@test.com
   - Password: test123
   - Store Name: Eco Test Store
3. Register
```

**B. Submit Verification**
```
1. After registration, you'll see verification form
2. Fill in all required fields:
   - Business Information
   - Warehouse Address
   - Contact Details
   - Bank Details
   - Upload Documents
3. Submit
4. Status changes to "Pending"
```

**C. Admin Approves**
```
1. Login as admin: admin@kaisiri.eco / Admin@2024!Secure
2. Go to Admin Dashboard
3. See "Pending Seller Verifications" section
4. Click "Approve" on the seller
5. Seller can now add products
```

**D. Seller Adds Products**
```
1. Seller logs in at /seller/login
2. Redirected to dashboard (now approved)
3. Can add products with images
```

## 📋 Verification Requirements

### Required Information

#### Business Information
- Business Name
- Business Registration Number
- Tax ID / VAT Number

#### Warehouse Address
- Street Address
- City
- State/Province
- Postal Code
- Country

#### Contact Information
- Contact Phone
- Business Email

#### Bank Details (for payments)
- Account Name
- Account Number
- Bank Name
- Routing Number / SWIFT Code (optional)

#### Supporting Documents
- Business License
- Tax Certificate
- Warehouse Proof (lease/ownership)
- Up to 5 documents (PDF, DOC, DOCX, JPG, PNG)
- Max 5MB per file

## 🔄 Verification States

### 1. Pending (Initial State)
```
- Seller just registered
- Has not submitted verification
- Cannot access dashboard
- Sees verification form
```

### 2. Pending (After Submission)
```
- Seller submitted verification
- Waiting for admin review
- Cannot add products yet
- Sees "Verification Pending" message
```

### 3. Approved
```
- Admin approved seller
- Can access full dashboard
- Can add/edit/delete products
- Can view orders and revenue
```

### 4. Rejected
```
- Admin rejected verification
- Sees rejection reason
- Can resubmit with corrections
- Cannot add products
```

## 🎨 User Flows

### Seller Registration Flow
```
1. Visit /seller/register
2. Fill registration form
3. Submit → Account created
4. Redirected to /seller/verify
5. Fill verification form
6. Submit → Status: Pending
7. Wait for admin approval
8. Get email notification (future)
9. Login → Access dashboard
```

### Seller Login Flow
```
1. Visit /seller/login
2. Enter credentials
3. System checks:
   - Is user a seller? ✓
   - Is seller verified? 
     - No → Redirect to /seller/verify
     - Yes → Redirect to /seller (dashboard)
```

### Admin Approval Flow
```
1. Login to admin panel
2. See "Pending Seller Verifications"
3. Click "View Details" (optional)
4. Review:
   - Business info
   - Warehouse address
   - Documents
5. Decision:
   - Approve → Seller can sell
   - Reject → Enter reason → Seller notified
```

## 🔒 Security Features

### Access Control
- ✅ Sellers cannot add products until verified
- ✅ Verification required for all seller actions
- ✅ Admin-only approval process
- ✅ Separate login for sellers
- ✅ Role validation on every request

### Data Protection
- ✅ Sensitive business data encrypted
- ✅ Documents stored securely
- ✅ Bank details protected
- ✅ Admin-only access to verification details

### Validation
- ✅ All required fields validated
- ✅ Document type validation
- ✅ File size limits (5MB)
- ✅ Email format validation
- ✅ Phone number validation

## 📁 Files Modified/Created

### New Files
- `public/js/pages/seller-auth.js` - Seller login & verification UI
- `SELLER_VERIFICATION_GUIDE.md` - This guide

### Modified Files
- `server/models/User.js` - Added verification fields
- `server/routes/seller.js` - Added verification routes
- `server/routes/admin.js` - Added seller approval routes
- `server/seed.js` - New admin credentials
- `public/js/pages/seller.js` - Verification check
- `public/js/pages/admin.js` - Seller verification panel
- `public/js/router.js` - New routes
- `public/index.html` - New script

## 🗄️ Database Schema Updates

### User Model - New Fields
```javascript
{
  verificationStatus: 'pending' | 'approved' | 'rejected',
  verificationSubmittedAt: Date,
  verificationApprovedAt: Date,
  businessName: String,
  businessRegistration: String,
  taxId: String,
  warehouseAddress: {
    street, city, state, postalCode, country
  },
  contactPhone: String,
  businessEmail: String,
  bankDetails: {
    accountName, accountNumber, bankName, routingNumber
  },
  documents: [{
    type, url, uploadedAt
  }],
  rejectionReason: String
}
```

## 🔌 New API Endpoints

### Seller Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/seller/status` | Check verification status | Seller |
| POST | `/api/seller/verify` | Submit verification | Seller |
| GET | `/api/seller/dashboard` | Dashboard (verified only) | Verified Seller |
| POST | `/api/seller/products` | Add product (verified only) | Verified Seller |

### Admin Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/sellers` | Get all sellers | Admin |
| GET | `/api/admin/sellers/pending` | Get pending sellers | Admin |
| PUT | `/api/admin/sellers/:id/verify` | Approve/Reject seller | Admin |

## 🧪 Testing

### Test Complete Flow

```bash
# 1. Reset database with new admin
npm run fix-db
npm run seed
npm start

# 2. Register as seller
# Go to: http://localhost:5000/seller/register
# Email: seller@test.com
# Password: test123

# 3. Submit verification
# Fill all fields
# Upload documents
# Submit

# 4. Login as admin
# Go to: http://localhost:5000/login
# Email: admin@kaisiri.eco
# Password: Admin@2024!Secure

# 5. Approve seller
# Admin Dashboard → Pending Verifications
# Click "Approve"

# 6. Login as seller
# Go to: http://localhost:5000/seller/login
# Email: seller@test.com
# Password: test123

# 7. Add product
# Dashboard → Add Product
# Upload images
# Submit
```

### Test Rejection Flow

```bash
# 1-3. Same as above

# 4. Login as admin
# Reject seller with reason

# 5. Login as seller
# See rejection message
# Resubmit verification
```

## 🎓 Best Practices

### For Sellers
1. **Accurate Information** - Provide correct business details
2. **Clear Documents** - Upload legible, valid documents
3. **Complete Forms** - Fill all required fields
4. **Valid Warehouse** - Provide real warehouse address
5. **Business Email** - Use professional email address

### For Admins
1. **Verify Documents** - Check all uploaded documents
2. **Validate Address** - Ensure warehouse is real
3. **Check Registration** - Verify business registration number
4. **Clear Reasons** - Provide specific rejection reasons
5. **Timely Review** - Approve/reject within 24-48 hours

## 🐛 Troubleshooting

### Seller Cannot Access Dashboard
**Issue:** "Your seller account is not verified yet"
**Solution:** 
1. Check verification status at `/seller/verify`
2. If pending, wait for admin approval
3. If rejected, resubmit with corrections

### Admin Cannot See Pending Sellers
**Issue:** No sellers in pending list
**Solution:**
1. Check if sellers submitted verification
2. Refresh admin panel
3. Check browser console for errors

### Documents Not Uploading
**Issue:** "Only PDF, DOC... files allowed"
**Solution:**
1. Use supported formats: PDF, DOC, DOCX, JPG, PNG
2. Check file size (max 5MB)
3. Try uploading one at a time

### Old Admin Credentials Not Working
**Issue:** "Invalid email or password"
**Solution:**
1. Use NEW credentials: admin@kaisiri.eco / Admin@2024!Secure
2. Re-seed database: `npm run seed`
3. Old credentials are permanently removed

## 📊 Verification Statistics

Track in admin panel:
- Total sellers
- Pending verifications
- Approved sellers
- Rejected sellers
- Average approval time

## 🔮 Future Enhancements

- [ ] Email notifications for approval/rejection
- [ ] Automated document verification (OCR)
- [ ] Seller rating system
- [ ] Verification expiry (annual renewal)
- [ ] Multi-step verification process
- [ ] Video call verification option
- [ ] Seller performance tracking
- [ ] Automated fraud detection

## 📞 Support

### For Sellers
- **Verification Issues:** Contact admin
- **Document Problems:** Re-upload clear copies
- **Rejection Appeals:** Resubmit with corrections

### For Admins
- **Review Guidelines:** Check business legitimacy
- **Document Verification:** Validate all documents
- **Fraud Detection:** Report suspicious applications

---

## ✅ Summary

You now have a **complete seller verification system** with:

✅ Seller registration with verification  
✅ Detailed business/warehouse information  
✅ Document upload system  
✅ Admin approval workflow  
✅ Separate seller login  
✅ New secure admin credentials  
✅ Verification status tracking  
✅ Rejection with feedback  
✅ Resubmission capability  

**Sellers must be verified before they can add products!** 🔐

---

## 🎉 Ready to Use!

1. **Re-seed database** with new admin
2. **Test seller registration** and verification
3. **Approve as admin**
4. **Start selling!**

**New Admin:** admin@kaisiri.eco / Admin@2024!Secure 🔑
