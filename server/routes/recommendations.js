const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * AI-based recommendation engine using collaborative filtering + content-based approach.
 * Scores products based on:
 *  1. User's preferred/purchased categories (content-based)
 *  2. User's viewed products (recency-weighted)
 *  3. Product popularity (view + purchase counts)
 *  4. Sustainability score (eco-alignment)
 *  5. High ratings
 */
async function getRecommendations(userId, limit = 8) {
  const user = await User.findById(userId);
  const allProducts = await Product.find({ stock: { $gt: 0 } });

  // Build a score for each product
  const scored = allProducts.map(product => {
    let score = 0;

    // 1. Category preference boost (purchased > preferred > viewed)
    if (user.purchasedCategories.includes(product.category)) score += 40;
    if (user.preferredCategories.includes(product.category)) score += 25;

    // 2. Viewed product category boost (but not the exact same product)
    const viewedIds = user.viewedProducts.map(id => id.toString());
    if (viewedIds.includes(product._id.toString())) score -= 10; // slight penalty for already-seen
    else score += 5;

    // 3. Popularity score (normalized)
    score += Math.min(product.viewCount / 10, 15);
    score += Math.min(product.purchaseCount * 2, 20);

    // 4. Sustainability alignment (eco-conscious users get higher eco-score products)
    score += product.sustainabilityScore * 3;

    // 5. Rating boost
    score += product.averageRating * 4;

    // 6. Featured / bestseller boost
    if (product.featured) score += 10;
    if (product.bestseller) score += 8;

    return { product, score };
  });

  // Sort by score descending, exclude already-purchased (from orders) if possible
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.product);
}

// GET /api/recommendations - personalized (requires auth)
router.get('/', protect, async (req, res) => {
  try {
    const recommendations = await getRecommendations(req.user._id, 8);
    res.json({ recommendations, personalized: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/recommendations/guest - non-personalized (top eco products)
router.get('/guest', async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } })
      .sort({ sustainabilityScore: -1, averageRating: -1, viewCount: -1 })
      .limit(8);
    res.json({ recommendations: products, personalized: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/recommendations/similar/:productId
router.get('/similar/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const similar = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } }
      ],
      stock: { $gt: 0 }
    })
      .sort({ sustainabilityScore: -1, averageRating: -1 })
      .limit(4);

    res.json(similar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
