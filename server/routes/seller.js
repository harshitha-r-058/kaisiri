const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, sellerOnly } = require('../middleware/auth');
const { uploadProductImages, uploadDocuments, deleteImage } = require('../config/cloudinary');
// All routes require seller authentication
router.use(protect, sellerOnly);

// Middleware to check if seller is verified
const requireVerified = (req, res, next) => {
  if (req.user.verificationStatus !== 'approved') {
    return res.status(403).json({ 
      message: 'Your seller account is not verified yet. Please submit verification details.',
      verificationStatus: req.user.verificationStatus 
    });
  }
  next();
};

// GET /api/seller/status - Check verification status
router.get('/status', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      verificationStatus: user.verificationStatus,
      sellerVerified: user.sellerVerified,
      verificationSubmittedAt: user.verificationSubmittedAt,
      verificationApprovedAt: user.verificationApprovedAt,
      rejectionReason: user.rejectionReason,
      hasWarehouseDetails: !!(user.warehouseAddress && user.warehouseAddress.street)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/seller/verify - Submit verification details
router.post('/verify', protect, uploadDocuments.array('documents', 5), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Map the form fields to the User model
        user.businessName = req.body.businessName;
        user.businessRegistration = req.body.businessRegistration;
        user.taxId = req.body.taxId;
        user.contactPhone = req.body.contactPhone;
        user.businessEmail = req.body.businessEmail;
        
        user.warehouseAddress = {
            street: req.body.warehouseStreet,
            city: req.body.warehouseCity,
            state: req.body.warehouseState,
            postalCode: req.body.warehousePostalCode,
            country: req.body.warehouseCountry
        };

        user.bankDetails = {
            accountName: req.body.accountName,
            accountNumber: req.body.accountNumber,
            bankName: req.body.bankName,
            routingNumber: req.body.routingNumber
        };

        user.verificationStatus = 'pending';
        user.verificationSubmittedAt = new Date();

        // Save Cloudinary URLs if files were uploaded
        if (req.files && req.files.length > 0) {
            user.documents = req.files.map(file => ({
                type: 'verification_doc',
                url: file.path,
                uploadedAt: new Date()
            }));
        }

        await user.save();

        // THIS PREVENTS THE 404 AND GIVES SUCCESS
        res.status(200).json({ 
            message: 'Seller registration created successfully! Verification is pending.',
            status: 'success' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating seller registration' });
    }
});
// GET /api/seller/products - Get seller's products
router.get('/products', requireVerified, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/seller/products - Create new product
router.post('/products', requireVerified, uploadProductImages.array('images', 5), async (req, res) => {
  try {
    const {
      name, description, shortDescription, price, originalPrice,
      category, tags, stock, sustainabilityScore,
      waterSaved, co2Reduced, plasticAvoided, treesPlanted, impactSummary,
      materials, certifications, origin
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !sustainabilityScore || !impactSummary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get uploaded image URLs from Cloudinary
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({
      name,
      description,
      shortDescription,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images,
      category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      stock: parseInt(stock) || 0,
      sustainabilityScore: parseInt(sustainabilityScore),
      environmentalImpact: {
        waterSaved,
        co2Reduced,
        plasticAvoided,
        treesPlanted,
        summary: impactSummary
      },
      materials: materials ? (Array.isArray(materials) ? materials : materials.split(',').map(m => m.trim())) : [],
      certifications: certifications ? (Array.isArray(certifications) ? certifications : certifications.split(',').map(c => c.trim())) : [],
      origin,
      seller: req.user._id,
      sellerName: req.user.storeName || req.user.name,
      approved: req.user.sellerVerified // Auto-approve if seller is verified
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/seller/products/:id - Update product
router.put('/products/:id', uploadProductImages.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    const {
      name, description, shortDescription, price, originalPrice,
      category, tags, stock, sustainabilityScore,
      waterSaved, co2Reduced, plasticAvoided, treesPlanted, impactSummary,
      materials, certifications, origin, removeImages
    } = req.body;

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (price) product.price = parseFloat(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    if (category) product.category = category;
    if (tags) product.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (stock !== undefined) product.stock = parseInt(stock);
    if (sustainabilityScore) product.sustainabilityScore = parseInt(sustainabilityScore);
    if (origin !== undefined) product.origin = origin;

    // Update environmental impact
    if (waterSaved !== undefined) product.environmentalImpact.waterSaved = waterSaved;
    if (co2Reduced !== undefined) product.environmentalImpact.co2Reduced = co2Reduced;
    if (plasticAvoided !== undefined) product.environmentalImpact.plasticAvoided = plasticAvoided;
    if (treesPlanted !== undefined) product.environmentalImpact.treesPlanted = treesPlanted;
    if (impactSummary) product.environmentalImpact.summary = impactSummary;

    // Update materials and certifications
    if (materials) product.materials = Array.isArray(materials) ? materials : materials.split(',').map(m => m.trim());
    if (certifications) product.certifications = Array.isArray(certifications) ? certifications : certifications.split(',').map(c => c.trim());

    // Handle image removal
    if (removeImages) {
      const toRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      product.images = product.images.filter(img => !toRemove.includes(img));
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path); // Cloudinary URLs
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/seller/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    // Note: Cloudinary images will remain (you can manually delete if needed)
    // Or implement automatic deletion using deleteImage function

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/seller/orders - Get orders containing seller's products
router.get('/orders', async (req, res) => {
  try {
    const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    const orders = await Order.find({
      'items.product': { $in: productIds }
    }).populate('user', 'name email').sort({ createdAt: -1 });

    // Filter to show only seller's items in each order
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(item =>
        productIds.some(id => id.toString() === item.product.toString())
      );
      return {
        ...order.toObject(),
        items: sellerItems,
        sellerTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    });

    res.json(filteredOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/seller/profile - Update seller profile
router.put('/profile', async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;
    const user = await User.findById(req.user._id);
    
    if (storeName) user.storeName = storeName;
    if (storeDescription !== undefined) user.storeDescription = storeDescription;
    
    await user.save();
    res.json({ storeName: user.storeName, storeDescription: user.storeDescription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/seller/dashboard - Seller dashboard stats
router.get('/dashboard', requireVerified, async (req, res) => {
  try {

    // Get seller products
    const products = await Product.find({ seller: req.user._id });

    // Total products
    const totalProducts = products.length;

    // Approved/active products
    const activeProducts = products.filter(product => product.approved).length;

    // Get all seller product IDs
    const sellerProductIds = products.map(product => product._id);

    // Find orders containing seller products
    const orders = await Order.find({
      'items.product': { $in: sellerProductIds }
    });

    // Total orders
    const totalOrders = orders.length;

    // Calculate revenue
    let revenue = 0;

    orders.forEach(order => {
      order.items.forEach(item => {

        const belongsToSeller = sellerProductIds.some(
          id => id.toString() === item.product.toString()
        );

        if (belongsToSeller) {
          revenue += item.price * item.quantity;
        }

      });
    });

    // Send dashboard data
    res.json({
      totalProducts,
      activeProducts,
      totalOrders,
      revenue
    });

  } catch (err) {
    console.error('Seller Dashboard Error:', err);

    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;
