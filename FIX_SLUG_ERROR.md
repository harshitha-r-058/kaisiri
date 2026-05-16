# 🔧 Fix: Duplicate Slug Error

## Error Message
```
E11000 duplicate key error collection: test.products index: slug_1 dup key: { slug: null }
```

## What Happened?
The database has a unique index on the `slug` field, but some products were inserted with `null` slugs, causing a conflict.

## Quick Fix (2 Steps)

### Step 1: Clean the Database
```bash
npm run fix-db
```

This will:
- Drop the products collection
- Drop the sessions collection
- Clean up any problematic indexes

### Step 2: Re-seed the Database
```bash
npm run seed
```

This will:
- Create products with proper slugs
- Create the admin user
- Set up sample data

### Step 3: Start the Server
```bash
npm start
```

## What Was Fixed?

1. **Product Model** (`server/models/Product.js`)
   - Updated pre-save hook to always generate slug if missing
   - Added pre-insertMany hook for bulk inserts

2. **Seed Script** (`server/seed.js`)
   - Now manually generates slugs before inserting products
   - Ensures no null slugs are created

3. **Fix Script** (`fix-database.js`)
   - Drops problematic collections
   - Allows clean re-seeding

## Alternative: Manual MongoDB Fix

If you prefer to fix it manually:

```bash
# Connect to MongoDB
mongosh

# Switch to kaisiri database
use kaisiri

# Drop the products collection
db.products.drop()

# Drop the sessions collection (optional)
db.sessions.drop()

# Exit
exit
```

Then run:
```bash
npm run seed
```

## Verify It's Fixed

After running the fix:

1. Check for errors:
   ```bash
   npm run seed
   ```
   
   You should see:
   ```
   ✅ MongoDB connected: localhost
   ✅ Seeded 15 products
   ✅ Admin created: admin@kaisiri.com / admin123
   🌿 Seed complete!
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open browser:
   ```
   http://localhost:5000
   ```

4. Products should display correctly!

## Why Did This Happen?

The `slug` field is used for SEO-friendly URLs (e.g., `/product/organic-cotton-tee` instead of `/product/123abc`). It must be unique, but the initial seed didn't generate slugs properly.

## Prevention

This is now fixed in the code, so it won't happen again. The slug is automatically generated from the product name:

```javascript
// Example:
name: "Organic Cotton Tee"
slug: "organic-cotton-tee"  // Auto-generated
```

## Still Having Issues?

1. **Make sure MongoDB is running:**
   ```bash
   mongod
   ```

2. **Check your .env file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/kaisiri
   ```

3. **Try dropping the entire database:**
   ```bash
   mongosh
   use kaisiri
   db.dropDatabase()
   exit
   ```
   
   Then:
   ```bash
   npm run seed
   ```

## Success! ✅

Once fixed, you should be able to:
- ✅ Seed the database without errors
- ✅ Start the server
- ✅ Browse products
- ✅ Add to cart
- ✅ Place orders

---

**Need more help?** Check README.md troubleshooting section.
