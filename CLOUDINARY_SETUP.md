# ☁️ Cloudinary Setup Guide

## Overview

Kaisiri now uses **Cloudinary** for all image and document uploads instead of local storage. This provides:
- ✅ Cloud-based storage (no local files)
- ✅ Automatic image optimization
- ✅ CDN delivery (fast loading)
- ✅ Secure document storage
- ✅ Easy scaling

## 🚀 Quick Setup

### Step 1: Get Cloudinary Credentials

1. **Sign up for Cloudinary** (Free tier available)
   - Go to: https://cloudinary.com/users/register/free
   - Create account (free forever for up to 25GB)

2. **Get your credentials**
   - After signup, go to Dashboard
   - You'll see:
     ```
     Cloud Name: your_cloud_name
     API Key: 123456789012345
     API Secret: abcdefghijklmnopqrstuvwxyz
     ```

### Step 2: Add Credentials to .env

Open your `.env` file and add:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Replace with your actual credentials!**

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- `cloudinary` - Cloudinary SDK
- `multer-storage-cloudinary` - Multer storage for Cloudinary

### Step 4: Start Server

```bash
npm start
```

That's it! All uploads now go to Cloudinary! ☁️

## 📁 What Changed

### New Files
- `server/config/cloudinary.js` - Cloudinary configuration

### Modified Files
- `server/routes/seller.js` - Uses Cloudinary for uploads
- `package.json` - Added Cloudinary dependencies
- `.env` - Added Cloudinary credentials

### Removed
- Local file storage (`uploads/` folder no longer used)
- File system operations (fs module)

## 🎯 Features

### Product Images
- **Upload:** Up to 5 images per product
- **Format:** JPEG, JPG, PNG, WEBP
- **Size:** Max 5MB per image
- **Storage:** `kaisiri/products/` folder in Cloudinary
- **Optimization:** Auto-resized to 1000x1000px max

### Verification Documents
- **Upload:** Up to 5 documents
- **Format:** PDF, JPEG, JPG, PNG
- **Size:** Max 5MB per file
- **Storage:** `kaisiri/documents/` folder in Cloudinary
- **Types:** Business license, tax certificate, warehouse proof

## 📊 Cloudinary Dashboard

After uploading, you can view all files in your Cloudinary dashboard:
- Go to: https://cloudinary.com/console
- Navigate to Media Library
- See folders:
  - `kaisiri/products/` - Product images
  - `kaisiri/documents/` - Verification documents

## 🔒 Security

### API Keys
- ✅ Never commit `.env` file to Git
- ✅ Keep API Secret private
- ✅ Use environment variables only

### Access Control
- ✅ Cloudinary folders are private by default
- ✅ Only authenticated sellers can upload
- ✅ Admin can view all documents

## 💰 Pricing

### Free Tier (Forever)
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **Perfect for:** Small to medium stores

### Paid Plans (if needed)
- **Plus:** $99/month (starts at 100 GB)
- **Advanced:** Custom pricing
- **Only needed for:** Large stores with thousands of products

## 🧪 Testing

### Test Product Upload

1. **Register as seller**
   ```
   http://localhost:5000/seller/register
   ```

2. **Submit verification**
   - Upload documents (PDF or images)
   - Documents go to Cloudinary

3. **Add product**
   - Upload product images
   - Images go to Cloudinary

4. **Check Cloudinary**
   - Login to Cloudinary dashboard
   - See uploaded files in Media Library

### Test Document Upload

```bash
# Via API
curl -X POST http://localhost:5000/api/seller/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "businessName=Test Business" \
  -F "businessRegistration=12345" \
  -F "taxId=TAX123" \
  -F "warehouseStreet=123 Main St" \
  -F "warehouseCity=Portland" \
  -F "warehouseState=OR" \
  -F "warehousePostalCode=97201" \
  -F "warehouseCountry=USA" \
  -F "contactPhone=555-1234" \
  -F "businessEmail=business@test.com" \
  -F "accountName=Test Account" \
  -F "accountNumber=123456789" \
  -F "bankName=Test Bank" \
  -F "documents=@license.pdf" \
  -F "documents=@tax-cert.pdf"
```

## 🎨 Image URLs

### Before (Local Storage)
```
/uploads/products/product-1234567890.jpg
```

### After (Cloudinary)
```
https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/kaisiri/products/abc123.jpg
```

Benefits:
- ✅ CDN delivery (faster)
- ✅ Automatic optimization
- ✅ Responsive images
- ✅ No server storage needed

## 🔧 Configuration Options

### Image Transformations

Edit `server/config/cloudinary.js` to customize:

```javascript
// Product images - resize to 800x800
transformation: [{ width: 800, height: 800, crop: 'limit' }]

// Product images - add watermark
transformation: [
  { width: 1000, height: 1000, crop: 'limit' },
  { overlay: 'watermark', gravity: 'south_east', opacity: 50 }
]

// Product images - auto quality
transformation: [{ quality: 'auto', fetch_format: 'auto' }]
```

### Folder Structure

```javascript
// Organize by seller
folder: `kaisiri/products/${sellerId}`

// Organize by date
folder: `kaisiri/products/${new Date().getFullYear()}`
```

## 🐛 Troubleshooting

### Error: "Invalid cloud_name"
**Solution:** Check your `CLOUDINARY_CLOUD_NAME` in `.env`

### Error: "Invalid API key"
**Solution:** Check your `CLOUDINARY_API_KEY` in `.env`

### Error: "Upload failed"
**Solution:** 
1. Check file size (max 5MB)
2. Check file format (JPEG, PNG, PDF only)
3. Check Cloudinary quota (free tier: 25GB)

### Images not displaying
**Solution:**
1. Check Cloudinary dashboard - are files uploaded?
2. Check image URL in database
3. Check browser console for errors

### Documents not uploading
**Solution:**
1. Use PDF, JPEG, JPG, or PNG format
2. Check file size (max 5MB)
3. Check Cloudinary storage quota

## 📈 Monitoring

### Check Usage
1. Go to Cloudinary Dashboard
2. Click "Usage" tab
3. See:
   - Storage used
   - Bandwidth used
   - Transformations used

### Alerts
- Set up email alerts for quota limits
- Monitor monthly usage
- Upgrade plan if needed

## 🎓 Best Practices

### For Sellers
1. **Optimize images** before upload (compress to <1MB)
2. **Use good quality** images (min 800x800px)
3. **Correct format** - JPEG for photos, PNG for graphics
4. **Clear documents** - scan at 300 DPI minimum

### For Admins
1. **Monitor storage** - check Cloudinary usage monthly
2. **Clean up** - delete unused images
3. **Organize** - use folders for different sellers
4. **Backup** - Cloudinary has automatic backups

## 🔮 Advanced Features

### Auto-optimization
```javascript
// Enable in cloudinary.js
transformation: [{ quality: 'auto', fetch_format: 'auto' }]
```

### Responsive Images
```javascript
// Generate multiple sizes
transformation: [
  { width: 400, crop: 'scale' },  // Thumbnail
  { width: 800, crop: 'scale' },  // Medium
  { width: 1200, crop: 'scale' }  // Large
]
```

### Video Support (Future)
```javascript
// Enable video uploads
allowed_formats: ['jpg', 'png', 'mp4', 'mov']
resource_type: 'video'
```

## 📞 Support

### Cloudinary Support
- **Docs:** https://cloudinary.com/documentation
- **Support:** https://support.cloudinary.com
- **Community:** https://community.cloudinary.com

### Kaisiri Support
- Check `SELLER_VERIFICATION_GUIDE.md`
- Check `SELLER_GUIDE.md`
- Contact admin

---

## ✅ Checklist

Before going live:
- [ ] Cloudinary account created
- [ ] Credentials added to `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Test product upload works
- [ ] Test document upload works
- [ ] Images display correctly
- [ ] Cloudinary dashboard accessible
- [ ] Usage monitoring set up

---

## 🎉 You're All Set!

Your Kaisiri platform now uses **professional cloud storage** with:
- ✅ Cloudinary integration
- ✅ Automatic image optimization
- ✅ CDN delivery
- ✅ Secure document storage
- ✅ Scalable infrastructure

**Add your Cloudinary credentials to `.env` and start uploading!** ☁️
