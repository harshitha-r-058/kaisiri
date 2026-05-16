# 🌿 Kaisiri - Eco-Friendly E-commerce Platform

A modern, responsive e-commerce web application focused on selling eco-friendly and sustainable products. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

![Kaisiri](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=400&fit=crop)

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - Secure signup/login/logout with JWT
- 🛍️ **Product Catalog** - Browse sustainable products across 6 categories
- 🔍 **Advanced Search & Filters** - Search, filter by category, price, eco-score
- 🛒 **Shopping Cart** - Add, update, remove items with real-time updates
- 💳 **Checkout System** - Complete order flow with payment simulation
- 📦 **Order History** - Track all past orders with detailed information
- ❤️ **Wishlist** - Save favorite products for later
- ⭐ **Reviews & Ratings** - Customer reviews with star ratings
- 👤 **User Profile** - Manage account and preferences

### Unique Eco Features
- 🌍 **Environmental Impact Tracking** - Each product shows water saved, CO₂ reduced, plastic avoided
- 🌱 **Sustainability Score** - 1-10 rating for every product
- 🎯 **Eco Points System** - Earn points with every purchase
- 💡 **Eco Tips & Facts** - Educational content about sustainability
- 📊 **Impact Dashboard** - See your total environmental contribution

### AI-Powered Recommendations
- 🤖 **Personalized Suggestions** - ML-based product recommendations
- 📈 **Behavioral Analysis** - Tracks viewed products and purchase history
- 🎨 **Category Preferences** - Learn user preferences over time
- 🔥 **Trending Products** - Popular and high-rated items
- 🎁 **Similar Products** - Content-based recommendations

### Admin Panel
- 📊 **Dashboard** - Overview of products, orders, users, revenue
- ➕ **Product Management** - Add, edit, delete products
- 📦 **Order Management** - Update order status, view details
- 👥 **User Management** - View all registered users
- 📈 **Analytics** - Track eco points and environmental impact

### UI/UX
- 🎨 **Nature-Inspired Design** - Earthy color palette (greens, beiges, browns)
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- ✨ **Smooth Animations** - Hover effects, transitions, loading states
- 🚀 **SPA Architecture** - Fast client-side routing
- ♿ **Accessible** - Semantic HTML, ARIA labels, keyboard navigation

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-session** - Session management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No framework dependencies
- **SPA Router** - Client-side routing
- **Fetch API** - HTTP requests

### Fonts & Assets
- **Playfair Display** - Elegant serif for headings
- **Inter** - Clean sans-serif for body text
- **Unsplash** - High-quality product images

## 📁 Project Structure

```
kaisiri/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── products.js           # Product routes
│   │   ├── cart.js               # Cart routes
│   │   ├── orders.js             # Order routes
│   │   ├── wishlist.js           # Wishlist routes
│   │   ├── reviews.js            # Review routes
│   │   ├── recommendations.js    # AI recommendation routes
│   │   └── admin.js              # Admin routes
│   ├── middleware/
│   │   └── auth.js               # Auth middleware
│   ├── index.js                  # Express server
│   └── seed.js                   # Database seeding
├── public/
│   ├── css/
│   │   └── main.css              # All styles
│   ├── js/
│   │   ├── api.js                # API utilities
│   │   ├── auth.js               # Auth management
│   │   ├── cart.js               # Cart management
│   │   ├── router.js             # SPA router
│   │   ├── app.js                # App initialization
│   │   └── pages/
│   │       ├── home.js           # Home page
│   │       ├── products.js       # Products listing
│   │       ├── product-detail.js # Product detail
│   │       ├── cart-page.js      # Cart page
│   │       ├── checkout.js       # Checkout page
│   │       ├── orders.js         # Orders page
│   │       ├── wishlist.js       # Wishlist page
│   │       ├── auth-pages.js     # Login/Register
│   │       ├── profile.js        # User profile
│   │       └── admin.js          # Admin panel
│   └── index.html                # Main HTML
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

### Installation

1. **Clone or extract the project**
   ```bash
   cd kaisiri
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kaisiri
   JWT_SECRET=your_super_secret_jwt_key_here
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   **Windows:**
   ```bash
   # If MongoDB is installed as a service, it should start automatically
   # Otherwise, run:
   mongod
   ```
   
   **macOS (Homebrew):**
   ```bash
   brew services start mongodb-community
   ```
   
   **Linux:**
   ```bash
   sudo systemctl start mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```
   
   This will create:
   - 15+ sample eco-friendly products
   - Admin user: `admin@kaisiri.com` / `admin123`

6. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:5000
   ```

## 👤 Default Accounts

### Admin Account
- **Email:** `admin@kaisiri.com`
- **Password:** `admin123`
- **Access:** Full admin panel access

### Test User
Create your own account via the signup page!

## 📊 Sample Product Data

The seed script includes 15+ products across 6 categories:

### Categories
1. **Sustainable Clothing** - Organic cotton, hemp, recycled materials
2. **Eco-Friendly Home** - Bamboo, solar-powered, compostable items
3. **Reusable Essentials** - Water bottles, tote bags, coffee cups
4. **Organic Food** - (Ready for expansion)
5. **Natural Beauty** - Plastic-free, natural ingredients
6. **Green Tech** - Solar chargers, eco gadgets

### Product Features
- High-quality Unsplash images
- Detailed environmental impact metrics
- Sustainability scores (7-10)
- Certifications (GOTS, Fair Trade, FSC, etc.)
- Materials and origin information
- Customer reviews and ratings

## 🎯 Key Features Explained

### AI Recommendation System

The recommendation engine uses a hybrid approach:

1. **Content-Based Filtering**
   - Analyzes user's preferred categories
   - Tracks purchased product categories
   - Matches similar products

2. **Collaborative Filtering**
   - Tracks product views and interactions
   - Identifies popular products
   - Suggests trending items

3. **Scoring Algorithm**
   ```javascript
   score = 
     (purchased_category_match * 40) +
     (preferred_category_match * 25) +
     (popularity_score * 15) +
     (sustainability_score * 3) +
     (rating_score * 4) +
     (featured_boost * 10)
   ```

### Environmental Impact Tracking

Each product displays:
- 💧 **Water Saved** - Litres conserved vs conventional products
- 🌱 **CO₂ Reduced** - Carbon emissions avoided
- ♻️ **Plastic Avoided** - Single-use plastic eliminated
- 🌳 **Trees Planted** - Reforestation contributions

Orders calculate total impact and award eco points!

### Sustainability Score

Products rated 1-10 based on:
- Materials used (organic, recycled, biodegradable)
- Manufacturing process (carbon-neutral, fair trade)
- Packaging (plastic-free, compostable)
- Certifications (GOTS, FSC, Fair Trade, etc.)
- End-of-life (recyclable, compostable, durable)

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT authentication with secure tokens
- ✅ Session management with MongoDB store
- ✅ Input validation and sanitization
- ✅ Protected admin routes
- ✅ CORS configuration
- ✅ Environment variable protection

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🎨 Color Palette

```css
--primary: #2d5016        /* Forest Green */
--primary-light: #4a7c2c  /* Light Green */
--primary-dark: #1a3009   /* Dark Green */
--secondary: #8b7355      /* Warm Brown */
--accent: #d4a574         /* Beige */
--bg: #faf8f5             /* Off White */
--bg-alt: #f0ede7         /* Light Beige */
```

## 🚧 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications (order confirmations, shipping updates)
- [ ] Advanced admin analytics dashboard
- [ ] Product image upload functionality
- [ ] Social media sharing
- [ ] Gift cards and discount codes
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Real-time chat support

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the PORT in `.env` or kill the process using port 5000

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/featured` - Featured products
- `GET /api/products/:id` - Product details

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:productId` - Update quantity
- `DELETE /api/cart/:productId` - Remove item

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders/my` - User's orders
- `GET /api/orders/:id` - Order details

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Toggle wishlist

### Reviews
- `POST /api/reviews/:productId` - Add review
- `DELETE /api/reviews/:productId/:reviewId` - Delete review

### Recommendations
- `GET /api/recommendations` - Personalized recommendations
- `GET /api/recommendations/guest` - Guest recommendations
- `GET /api/recommendations/similar/:productId` - Similar products

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/products` - All products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status

## 🤝 Contributing

This is a demo project, but feel free to fork and customize!

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 🌟 Credits

- **Images:** [Unsplash](https://unsplash.com)
- **Fonts:** [Google Fonts](https://fonts.google.com)
- **Icons:** SVG icons (inline)

---

**Built with 💚 for a sustainable future**

🌿 **Kaisiri** - *Live Sustainably, Shop Consciously*
