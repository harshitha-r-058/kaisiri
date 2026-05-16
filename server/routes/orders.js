const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/orders - place order
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'simulated' } = req.body;
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart || user.cart.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const items = user.cart.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0] || '',
      price: item.product.price,
      quantity: item.quantity
    }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const totalPrice = subtotal + shippingCost + tax;

    // Calculate eco impact
    const ecoPoints = Math.floor(subtotal * 2);
    const co2Saved = `${(subtotal * 0.3).toFixed(1)} kg CO₂`;
    const plasticAvoided = `${Math.floor(subtotal * 0.5)} plastic items`;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentResult: { id: 'SIM-' + Date.now(), status: 'COMPLETED', updateTime: new Date().toISOString() },
      subtotal,
      shippingCost,
      tax,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      ecoImpact: { co2Saved, plasticAvoided, ecoPoints }
    });

    // Update product purchase counts and user eco points
    for (const item of user.cart) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { purchaseCount: item.quantity } });
      if (item.product.category) {
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { purchasedCategories: item.product.category }
        });
      }
    }

    // Clear cart and add eco points
    await User.findByIdAndUpdate(req.user._id, {
      cart: [],
      $inc: { ecoPoints }
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my - user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
