const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find().select('totalPrice ecoImpact')
    ]);
    const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalEcoPoints = orders.reduce((sum, o) => sum + (o.ecoImpact?.ecoPoints || 0), 0);
    res.json({ totalProducts, totalOrders, totalUsers, revenue: revenue.toFixed(2), totalEcoPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/products
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/sellers - Get all sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password').sort({ createdAt: -1 });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/sellers/pending - Get pending sellers
router.get('/sellers/pending', async (req, res) => {
  try {
    const sellers = await User.find({ 
      role: 'seller', 
      verificationStatus: 'pending' 
    }).select('-password').sort({ verificationSubmittedAt: -1 });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/sellers/:id/verify - Approve/Reject seller
router.put('/sellers/:id/verify', async (req, res) => {
  try {
    const { action, reason } = req.body; // action: 'approve' or 'reject'
    const seller = await User.findById(req.params.id);
    
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    if (action === 'approve') {
      seller.verificationStatus = 'approved';
      seller.sellerVerified = true;
      seller.verificationApprovedAt = new Date();
      seller.rejectionReason = undefined;
    } else if (action === 'reject') {
      seller.verificationStatus = 'rejected';
      seller.sellerVerified = false;
      seller.rejectionReason = reason || 'Verification requirements not met';
    }

    await seller.save();
    res.json({ message: `Seller ${action}d successfully`, seller });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
