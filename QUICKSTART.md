# 🚀 Quick Start Guide - Kaisiri

Get Kaisiri up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v16+) - Run `node --version`
- ✅ MongoDB installed and running - Run `mongosh` to test
- ✅ npm installed - Run `npm --version`

## Installation Steps

### 1. Install Dependencies (1 minute)
```bash
npm install
```

### 2. Configure Environment (30 seconds)
```bash
# Copy the example environment file
cp .env.example .env

# The default values work fine for local development!
# No need to edit unless you want custom ports
```

### 3. Start MongoDB (if not running)

**Windows:**
```bash
# MongoDB usually runs as a service automatically
# If not, open a new terminal and run:
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Seed the Database (30 seconds)
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

### 5. Start the Server (10 seconds)
```bash
npm start
```

You should see:
```
✅ MongoDB connected: localhost
🌿 Kaisiri server running on http://localhost:5000
```

### 6. Open in Browser
Navigate to: **http://localhost:5000**

## 🎉 You're Done!

### Try These Actions:

1. **Browse Products**
   - Click "Shop Now" on the homepage
   - Use filters to find products by category, price, eco-score

2. **Create an Account**
   - Click "Join" in the top right
   - Sign up with any email/password

3. **Add to Cart**
   - Click any product
   - Click "Add to Cart"
   - View cart in top right

4. **Place an Order**
   - Go to cart
   - Click "Proceed to Checkout"
   - Fill in shipping details
   - Place order (simulated payment)

5. **Access Admin Panel**
   - Sign in with: `admin@kaisiri.com` / `admin123`
   - Click your avatar → "Admin Panel"
   - View dashboard, manage products, update orders

## 🛠️ Development Mode

For auto-reload during development:
```bash
npm run dev
```

## 📊 Test Data

The seed script creates:
- **15+ Products** across 6 eco-friendly categories
- **1 Admin User** - admin@kaisiri.com / admin123
- **Sample Reviews** on some products

## 🐛 Common Issues

### "MongoDB connection error"
**Fix:** Make sure MongoDB is running
```bash
# Test connection
mongosh

# If it fails, start MongoDB
mongod
```

### "Port 5000 already in use"
**Fix:** Change port in `.env`
```env
PORT=3000
```

### "Cannot find module"
**Fix:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

## 📱 Mobile Testing

To test on mobile devices on your local network:

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. Open on mobile: `http://YOUR_IP:5000`

## 🎯 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the codebase structure
- Customize the design and features
- Add your own products via the admin panel

## 💡 Tips

- **Eco Points:** You earn 2 points per dollar spent
- **Free Shipping:** Orders over $50 get free shipping
- **Recommendations:** The more you browse, the better the AI recommendations
- **Wishlist:** Save products for later by clicking the heart icon
- **Reviews:** Leave reviews after viewing products (when logged in)

---

**Need Help?** Check the troubleshooting section in [README.md](README.md)

🌿 Happy sustainable shopping!
