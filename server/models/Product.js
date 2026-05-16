const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: {
    type: String,
    required: true,
    enum: ['sustainable-clothing', 'eco-home', 'reusable-essentials', 'organic-food', 'natural-beauty', 'green-tech']
  },
  tags: [{ type: String }],
  stock: { type: Number, default: 100, min: 0 },
  sustainabilityScore: { type: Number, min: 1, max: 10, required: true },
  environmentalImpact: {
    waterSaved: { type: String },
    co2Reduced: { type: String },
    plasticAvoided: { type: String },
    treesPlanted: { type: String },
    summary: { type: String, required: true }
  },
  materials: [{ type: String }],
  certifications: [{ type: String }],
  origin: { type: String },
  // Seller information
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerName: { type: String },
  approved: { type: Boolean, default: true }, // Admin can approve seller products
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Also handle insertMany
productSchema.pre('insertMany', function (next, docs) {
  if (docs && docs.length) {
    docs.forEach(doc => {
      if (!doc.slug && doc.name) {
        doc.slug = doc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
    });
  }
  next();
});

// Update average rating
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

// Text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
