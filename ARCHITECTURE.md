# 🏗️ Kaisiri - Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         KAISIRI PLATFORM                         │
│                  Eco-Friendly E-commerce System                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser    │ ◄─────► │   Express    │ ◄─────► │   MongoDB    │
│  (Frontend)  │  HTTP   │   (Backend)  │  Query  │  (Database)  │
└──────────────┘         └──────────────┘         └──────────────┘
     │                          │                         │
     │                          │                         │
  HTML/CSS/JS              REST API                  Collections
  SPA Router               JWT Auth                  (Users, Products,
  State Mgmt               Middleware                 Orders)
```

## Application Layers

### 1. Presentation Layer (Frontend)

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   index.html │  │   main.css   │  │  JavaScript  │     │
│  │              │  │              │  │   Modules    │     │
│  │  - Semantic  │  │  - Variables │  │              │     │
│  │  - Structure │  │  - Grid/Flex │  │  - api.js    │     │
│  │  - SEO       │  │  - Responsive│  │  - auth.js   │     │
│  └──────────────┘  └──────────────┘  │  - cart.js   │     │
│                                       │  - router.js │     │
│                                       │  - pages/    │     │
│                                       └──────────────┘     │
│                                                              │
│  Features:                                                   │
│  • Single Page Application (SPA)                            │
│  • Client-side routing                                      │
│  • State management                                         │
│  • Responsive design                                        │
│  • Accessibility (WCAG)                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Application Layer (Backend)

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Express.js Server                      │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │            Middleware Stack                   │  │    │
│  │  │                                               │  │    │
│  │  │  1. CORS                                      │  │    │
│  │  │  2. Body Parser (JSON)                        │  │    │
│  │  │  3. Session Management                        │  │    │
│  │  │  4. Static Files                              │  │    │
│  │  │  5. Authentication (JWT)                      │  │    │
│  │  │  6. Authorization (Role-based)                │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │              Route Handlers                   │  │    │
│  │  │                                               │  │    │
│  │  │  /api/auth          - Authentication         │  │    │
│  │  │  /api/products      - Product catalog        │  │    │
│  │  │  /api/cart          - Shopping cart          │  │    │
│  │  │  /api/orders        - Order management       │  │    │
│  │  │  /api/wishlist      - Wishlist               │  │    │
│  │  │  /api/reviews       - Product reviews        │  │    │
│  │  │  /api/recommendations - AI suggestions       │  │    │
│  │  │  /api/admin         - Admin operations       │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3. Data Layer (Database)

```
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              MongoDB Database                       │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │    Users     │  │   Products   │               │    │
│  │  │              │  │              │               │    │
│  │  │ - _id        │  │ - _id        │               │    │
│  │  │ - name       │  │ - name       │               │    │
│  │  │ - email      │  │ - price      │               │    │
│  │  │ - password   │  │ - category   │               │    │
│  │  │ - role       │  │ - ecoScore   │               │    │
│  │  │ - wishlist[] │  │ - impact{}   │               │    │
│  │  │ - cart[]     │  │ - reviews[]  │               │    │
│  │  │ - ecoPoints  │  │ - stock      │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │    Orders    │  │   Sessions   │               │    │
│  │  │              │  │              │               │    │
│  │  │ - _id        │  │ - _id        │               │    │
│  │  │ - user       │  │ - session    │               │    │
│  │  │ - items[]    │  │ - expires    │               │    │
│  │  │ - total      │  └──────────────┘               │    │
│  │  │ - status     │                                  │    │
│  │  │ - ecoImpact{}│                                  │    │
│  │  └──────────────┘                                  │    │
│  │                                                      │    │
│  │  Indexes:                                           │    │
│  │  • users.email (unique)                            │    │
│  │  • products (text search)                          │    │
│  │  • orders.user                                     │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Authentication Flow

```
┌─────────┐                                              ┌──────────┐
│ Browser │                                              │ Database │
└────┬────┘                                              └────┬─────┘
     │                                                        │
     │  1. POST /api/auth/register                           │
     │     { name, email, password }                         │
     ├──────────────────────────────►                        │
     │                                                        │
     │                              2. Hash password          │
     │                                 (bcrypt)               │
     │                                                        │
     │                              3. Save user ────────────►│
     │                                                        │
     │                              4. Generate JWT           │
     │                                 token                  │
     │                                                        │
     │  5. Return { token, user }                            │
     │◄──────────────────────────────                        │
     │                                                        │
     │  6. Store token in                                    │
     │     localStorage                                      │
     │                                                        │
     │  7. All future requests                               │
     │     include token in                                  │
     │     Authorization header                              │
     │                                                        │
```

### Product Browsing Flow

```
┌─────────┐                                              ┌──────────┐
│ Browser │                                              │ Database │
└────┬────┘                                              └────┬─────┘
     │                                                        │
     │  1. GET /api/products?                                │
     │     category=eco-home&                                │
     │     minScore=8&                                       │
     │     sort=price-asc                                    │
     ├──────────────────────────────►                        │
     │                                                        │
     │                              2. Build query           │
     │                                 with filters          │
     │                                                        │
     │                              3. Query products ───────►│
     │                                                        │
     │                              4. Return results ◄──────┤
     │                                                        │
     │  5. Return { products,                                │
     │     total, page, pages }                              │
     │◄──────────────────────────────                        │
     │                                                        │
     │  6. Render product grid                               │
     │                                                        │
```

### Shopping Cart Flow

```
┌─────────┐                                              ┌──────────┐
│ Browser │                                              │ Database │
└────┬────┘                                              └────┬─────┘
     │                                                        │
     │  1. POST /api/cart                                    │
     │     { productId, quantity }                           │
     │     + JWT token                                       │
     ├──────────────────────────────►                        │
     │                                                        │
     │                              2. Verify token          │
     │                                 & user                │
     │                                                        │
     │                              3. Check stock ──────────►│
     │                                                        │
     │                              4. Update user.cart ─────►│
     │                                                        │
     │                              5. Get updated cart ◄────┤
     │                                 with populated        │
     │                                 products              │
     │                                                        │
     │  6. Return cart items                                 │
     │◄──────────────────────────────                        │
     │                                                        │
     │  7. Update cart badge                                 │
     │     & cart page                                       │
     │                                                        │
```

### Order Placement Flow

```
┌─────────┐                                              ┌──────────┐
│ Browser │                                              │ Database │
└────┬────┘                                              └────┬─────┘
     │                                                        │
     │  1. POST /api/orders                                  │
     │     { shippingAddress }                               │
     │     + JWT token                                       │
     ├──────────────────────────────►                        │
     │                                                        │
     │                              2. Get user cart ────────►│
     │                                                        │
     │                              3. Validate stock ───────►│
     │                                                        │
     │                              4. Calculate totals      │
     │                                 (subtotal, tax,       │
     │                                  shipping)            │
     │                                                        │
     │                              5. Calculate eco         │
     │                                 impact & points       │
     │                                                        │
     │                              6. Create order ─────────►│
     │                                                        │
     │                              7. Update product ───────►│
     │                                 purchase counts       │
     │                                                        │
     │                              8. Clear cart ───────────►│
     │                                                        │
     │                              9. Award eco points ─────►│
     │                                                        │
     │  10. Return order                                     │
     │◄──────────────────────────────                        │
     │                                                        │
     │  11. Navigate to                                      │
     │      orders page                                      │
     │                                                        │
```

### AI Recommendation Flow

```
┌─────────┐                                              ┌──────────┐
│ Browser │                                              │ Database │
└────┬────┘                                              └────┬─────┘
     │                                                        │
     │  1. GET /api/recommendations                          │
     │     + JWT token                                       │
     ├──────────────────────────────►                        │
     │                                                        │
     │                              2. Get user data ────────►│
     │                                 - viewedProducts      │
     │                                 - purchasedCategories │
     │                                 - preferredCategories │
     │                                                        │
     │                              3. Get all products ─────►│
     │                                                        │
     │                              4. Score each product:   │
     │                                 • Category match (40) │
     │                                 • Preference (25)     │
     │                                 • Popularity (15)     │
     │                                 • Eco score (3x)      │
     │                                 • Rating (4x)         │
     │                                 • Featured (10)       │
     │                                                        │
     │                              5. Sort by score         │
     │                                                        │
     │  6. Return top 8                                      │
     │     recommendations                                   │
     │◄──────────────────────────────                        │
     │                                                        │
     │  7. Render on homepage                                │
     │                                                        │
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Transport Security                                │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • HTTPS (in production)                           │    │
│  │  • Secure headers                                  │    │
│  │  • CORS configuration                              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Layer 2: Authentication                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • JWT tokens (14-day expiry)                      │    │
│  │  • bcrypt password hashing (12 rounds)            │    │
│  │  • Session management (MongoDB store)             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Layer 3: Authorization                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • Role-based access control (user/admin)         │    │
│  │  • Protected route middleware                      │    │
│  │  • Resource ownership validation                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Layer 4: Data Protection                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • Environment variables for secrets               │    │
│  │  • Input validation                                │    │
│  │  • MongoDB injection prevention                    │    │
│  │  • XSS protection                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Interaction

```
┌──────────────────────────────────────────────────────────────┐
│                    COMPONENT DIAGRAM                          │
└──────────────────────────────────────────────────────────────┘

Frontend Components:
┌─────────────┐
│   Router    │ ──► Manages navigation & URL
└──────┬──────┘
       │
       ├──► ┌──────────┐
       │    │   Home   │ ──► Hero, Featured, Recommendations
       │    └──────────┘
       │
       ├──► ┌──────────┐
       │    │ Products │ ──► Grid, Filters, Pagination
       │    └──────────┘
       │
       ├──► ┌──────────┐
       │    │   Cart   │ ──► Items, Totals, Checkout
       │    └──────────┘
       │
       ├──► ┌──────────┐
       │    │  Orders  │ ──► History, Details, Status
       │    └──────────┘
       │
       └──► ┌──────────┐
            │  Admin   │ ──► Dashboard, Management
            └──────────┘

State Management:
┌─────────────┐
│  Auth State │ ──► currentUser, token
└─────────────┘
┌─────────────┐
│  Cart State │ ──► cart items, count
└─────────────┘

Backend Services:
┌─────────────┐
│ Auth Service│ ──► Login, Register, Verify
└─────────────┘
┌─────────────┐
│Product Svc  │ ──► CRUD, Search, Filter
└─────────────┘
┌─────────────┐
│ Cart Service│ ──► Add, Update, Remove
└─────────────┘
┌─────────────┐
│Order Service│ ──► Create, List, Update
└─────────────┘
┌─────────────┐
│  AI Service │ ──► Recommendations, Scoring
└─────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   PRODUCTION DEPLOYMENT                       │
└──────────────────────────────────────────────────────────────┘

Option 1: Heroku
┌─────────┐     ┌──────────┐     ┌─────────────┐
│ Browser │────►│  Heroku  │────►│MongoDB Atlas│
└─────────┘     │   Dyno   │     └─────────────┘
                └──────────┘

Option 2: DigitalOcean
┌─────────┐     ┌──────────┐     ┌─────────────┐
│ Browser │────►│    DO    │────►│  Managed    │
└─────────┘     │   App    │     │  MongoDB    │
                └──────────┘     └─────────────┘

Option 3: AWS
┌─────────┐     ┌──────────┐     ┌─────────────┐
│ Browser │────►│   EC2    │────►│ DocumentDB  │
└─────────┘     │ Instance │     │  or Atlas   │
                └──────────┘     └─────────────┘
                     │
                     ▼
                ┌──────────┐
                │  Nginx   │ (Reverse Proxy)
                └──────────┘

With CDN (Optional):
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Browser │────►│   CDN    │────►│  Server  │────►│ Database │
└─────────┘     │CloudFlare│     └──────────┘     └──────────┘
                └──────────┘
                (Static Assets)
```

## Technology Stack Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     TECHNOLOGY STACK                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend                                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  HTML5  │  CSS3  │  JavaScript ES6+                 │    │
│  │  ────────────────────────────────────────────────   │    │
│  │  • Semantic markup                                   │    │
│  │  • Custom properties                                 │    │
│  │  • Grid & Flexbox                                    │    │
│  │  • Fetch API                                         │    │
│  │  • LocalStorage                                      │    │
│  │  • SPA Router                                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Backend                                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Node.js  │  Express.js  │  Middleware              │    │
│  │  ────────────────────────────────────────────────   │    │
│  │  • RESTful API                                       │    │
│  │  • JWT (jsonwebtoken)                                │    │
│  │  • bcryptjs                                          │    │
│  │  • express-session                                   │    │
│  │  • cors                                              │    │
│  │  • dotenv                                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Database                                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MongoDB  │  Mongoose ODM                            │    │
│  │  ────────────────────────────────────────────────   │    │
│  │  • NoSQL document database                           │    │
│  │  • Schema validation                                 │    │
│  │  • Relationships (refs)                              │    │
│  │  • Indexes                                           │    │
│  │  • Text search                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Development                                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  npm  │  nodemon  │  Git                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Performance Considerations

```
┌──────────────────────────────────────────────────────────────┐
│                   PERFORMANCE OPTIMIZATIONS                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend:                                                    │
│  • Lazy loading images                                       │
│  • Minimal JavaScript (no framework overhead)                │
│  • CSS Grid for efficient layouts                            │
│  • Client-side caching (localStorage)                        │
│  • Pagination (12 items per page)                            │
│                                                               │
│  Backend:                                                     │
│  • Database indexing (email, text search)                    │
│  • Efficient queries (select, populate)                      │
│  • Session store (MongoDB)                                   │
│  • Static file serving                                       │
│                                                               │
│  Database:                                                    │
│  • Indexes on frequently queried fields                      │
│  • Text search index for products                            │
│  • Embedded documents for performance                        │
│  • Connection pooling                                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Scalability Path

```
Current (Single Server):
┌─────────┐     ┌──────────┐     ┌──────────┐
│ Browser │────►│  Server  │────►│ Database │
└─────────┘     └──────────┘     └──────────┘

Future (Scaled):
                ┌──────────┐
                │   Load   │
┌─────────┐     │ Balancer │     ┌──────────┐
│ Browser │────►│          │────►│ Server 1 │───┐
└─────────┘     └──────────┘     └──────────┘   │
                                                  │
                                 ┌──────────┐   │   ┌──────────┐
                                 │ Server 2 │───┼──►│ Database │
                                 └──────────┘   │   │ Cluster  │
                                                  │   └──────────┘
                                 ┌──────────┐   │
                                 │ Server 3 │───┘
                                 └──────────┘
                                      │
                                      ▼
                                 ┌──────────┐
                                 │  Redis   │
                                 │  Cache   │
                                 └──────────┘
```

---

This architecture is designed for:
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
- ✅ Developer experience

**Built with best practices and modern patterns** 🏗️
