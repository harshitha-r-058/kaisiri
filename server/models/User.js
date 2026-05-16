const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  // Seller-specific fields
  storeName: { type: String, trim: true },
  storeDescription: { type: String },
  sellerVerified: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  verificationSubmittedAt: { type: Date },
  verificationApprovedAt: { type: Date },
  // Warehouse/Business Details
  businessName: { type: String },
  businessRegistration: { type: String },
  taxId: { type: String },
  warehouseAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  contactPhone: { type: String },
  businessEmail: { type: String },
  bankDetails: {
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    routingNumber: { type: String }
  },
  documents: [{
    type: { type: String }, // 'business_license', 'tax_certificate', 'warehouse_proof'
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  totalSales: { type: Number, default: 0 },
  sellerRating: { type: Number, default: 0 },
  rejectionReason: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1, min: 1 }
  }],
  // AI recommendation tracking
  viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  purchasedCategories: [{ type: String }],
  preferredCategories: [{ type: String }],
  sustainabilityScore: { type: Number, default: 0 }, // user's eco score
  ecoPoints: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
