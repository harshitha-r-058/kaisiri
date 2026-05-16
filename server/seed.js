require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

const products = [
  // ── Sustainable Clothing ──────────────────────────────────────────────────
  {
    name: 'Organic Cotton Tee',
    shortDescription: 'Soft, breathable tee made from 100% GOTS-certified organic cotton.',
    description: 'Crafted from 100% GOTS-certified organic cotton, this tee is grown without harmful pesticides or synthetic fertilisers. The fabric is naturally soft, breathable, and gets better with every wash. Available in earthy, plant-dyed tones.',
    price: 34.99,
    originalPrice: 44.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
    category: 'sustainable-clothing',
    tags: ['organic', 'cotton', 'tshirt', 'clothing', 'natural'],
    sustainabilityScore: 9,
    environmentalImpact: {
      waterSaved: 'Saves 2,700 L of water vs conventional cotton',
      co2Reduced: 'Reduces CO₂ by 46% vs conventional farming',
      plasticAvoided: 'Zero synthetic fibres',
      summary: 'Saves 2,700 L water & cuts CO₂ by 46%'
    },
    materials: ['100% Organic Cotton'],
    certifications: ['GOTS', 'Fair Trade'],
    origin: 'India',
    featured: true,
    bestseller: true,
    stock: 150
  },
  {
    name: 'Hemp Linen Trousers',
    shortDescription: 'Relaxed-fit trousers woven from durable, naturally pest-resistant hemp.',
    description: 'Hemp requires no pesticides and uses 50% less water than cotton. These relaxed-fit trousers are woven from a hemp-linen blend that softens beautifully over time. Perfect for warm days and conscious wardrobes.',
    price: 79.99,
    originalPrice: 99.99,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=600'],
    category: 'sustainable-clothing',
    tags: ['hemp', 'linen', 'trousers', 'pants', 'natural'],
    sustainabilityScore: 10,
    environmentalImpact: {
      waterSaved: 'Uses 50% less water than cotton',
      co2Reduced: 'Hemp absorbs 1.63 tonnes CO₂/hectare',
      plasticAvoided: 'Fully biodegradable',
      summary: '50% less water, fully biodegradable'
    },
    materials: ['55% Hemp', '45% Linen'],
    certifications: ['OEKO-TEX Standard 100'],
    origin: 'Portugal',
    featured: true,
    stock: 80
  },
  {
    name: 'Recycled Fleece Jacket',
    shortDescription: 'Warm fleece jacket made from 100% post-consumer recycled plastic bottles.',
    description: 'Each jacket is made from approximately 25 recycled plastic bottles. The fleece is warm, lightweight, and pill-resistant. By choosing recycled materials we divert plastic from landfill and reduce virgin polyester production.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
    category: 'sustainable-clothing',
    tags: ['recycled', 'fleece', 'jacket', 'plastic', 'outerwear'],
    sustainabilityScore: 8,
    environmentalImpact: {
      plasticAvoided: 'Diverts ~25 plastic bottles per jacket',
      co2Reduced: 'Saves 60% energy vs virgin polyester',
      summary: 'Diverts 25 plastic bottles, saves 60% energy'
    },
    materials: ['100% Recycled Polyester (rPET)'],
    certifications: ['GRS', 'bluesign'],
    origin: 'Taiwan',
    featured: false,
    bestseller: true,
    stock: 60
  },
  {
    name: 'Bamboo Activewear Set',
    shortDescription: 'Moisture-wicking leggings and crop top from bamboo viscose.',
    description: 'Bamboo grows rapidly without pesticides and regenerates from its own roots. This activewear set is silky-soft, moisture-wicking, and naturally antibacterial — ideal for yoga, pilates, or everyday wear.',
    price: 64.99,
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
    category: 'sustainable-clothing',
    tags: ['bamboo', 'activewear', 'yoga', 'leggings', 'sport'],
    sustainabilityScore: 8,
    environmentalImpact: {
      waterSaved: 'Bamboo needs no irrigation',
      co2Reduced: 'Sequesters 35% more CO₂ than trees',
      summary: 'No irrigation needed, sequesters 35% more CO₂'
    },
    materials: ['95% Bamboo Viscose', '5% Elastane'],
    certifications: ['OEKO-TEX'],
    origin: 'China',
    stock: 120
  },

  // ── Eco-Friendly Home ─────────────────────────────────────────────────────
  {
    name: 'Beeswax Food Wraps (Set of 3)',
    shortDescription: 'Reusable, compostable alternative to cling film.',
    description: 'Made from organic cotton infused with beeswax, tree resin, and jojoba oil. These wraps mould to any container with the warmth of your hands and can be washed and reused for up to a year, replacing hundreds of metres of single-use plastic wrap.',
    price: 18.99,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'],
    category: 'eco-home',
    tags: ['beeswax', 'food wrap', 'kitchen', 'plastic-free', 'reusable'],
    sustainabilityScore: 10,
    environmentalImpact: {
      plasticAvoided: 'Replaces ~300 m of cling film per year',
      summary: 'Replaces 300 m of cling film annually'
    },
    materials: ['Organic Cotton', 'Beeswax', 'Tree Resin', 'Jojoba Oil'],
    certifications: ['GOTS'],
    origin: 'UK',
    featured: true,
    bestseller: true,
    stock: 200
  },
  {
    name: 'Bamboo Cutting Board',
    shortDescription: 'Durable, naturally antibacterial cutting board from FSC bamboo.',
    description: 'Bamboo is harder than most hardwoods and naturally antimicrobial. This cutting board is crafted from FSC-certified bamboo with a juice groove and non-slip feet. It is knife-friendly, easy to clean, and will last for years.',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
    category: 'eco-home',
    tags: ['bamboo', 'cutting board', 'kitchen', 'FSC', 'cooking'],
    sustainabilityScore: 9,
    environmentalImpact: {
      co2Reduced: 'Bamboo sequesters CO₂ as it grows',
      plasticAvoided: 'Replaces plastic cutting boards',
      summary: 'Replaces plastic boards, sequesters CO₂'
    },
    materials: ['FSC-Certified Bamboo'],
    certifications: ['FSC'],
    origin: 'Vietnam',
    featured: true,
    stock: 90
  },
  {
    name: 'Solar-Powered Fairy Lights',
    shortDescription: '10 m of warm-white LED lights charged entirely by solar energy.',
    description: 'These 10 m warm-white LED fairy lights charge during the day via the included solar panel and automatically illuminate at dusk. Zero electricity cost, zero carbon footprint for lighting — perfect for gardens, balconies, and indoor spaces.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600'],
    category: 'eco-home',
    tags: ['solar', 'lights', 'LED', 'garden', 'energy'],
    sustainabilityScore: 9,
    environmentalImpact: {
      co2Reduced: 'Zero grid electricity consumption',
      summary: 'Zero electricity cost, 100% solar powered'
    },
    materials: ['Recycled Copper Wire', 'LED Bulbs', 'Solar Panel'],
    certifications: ['CE', 'RoHS'],
    origin: 'Germany',
    stock: 75
  },
  {
    name: 'Compostable Bin Liners (50 pack)',
    shortDescription: 'Home-compostable bin liners certified to EN 13432.',
    description: 'Made from plant-based materials (cornstarch and PBAT), these bin liners break down completely in a home compost within 12 weeks. They are leak-proof, odour-resistant, and fit standard 10 L kitchen bins.',
    price: 12.99,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    category: 'eco-home',
    tags: ['compostable', 'bin liners', 'plastic-free', 'kitchen', 'waste'],
    sustainabilityScore: 10,
    environmentalImpact: {
      plasticAvoided: 'Replaces 50 conventional plastic bags',
      summary: 'Replaces 50 plastic bags, fully compostable'
    },
    materials: ['Cornstarch', 'PBAT'],
    certifications: ['EN 13432', 'TÜV Austria OK Compost HOME'],
    origin: 'Netherlands',
    bestseller: true,
    stock: 300
  },

  // ── Reusable Daily Essentials ─────────────────────────────────────────────
  {
    name: 'Stainless Steel Water Bottle (750 ml)',
    shortDescription: 'Double-walled insulated bottle that keeps drinks cold 24 h / hot 12 h.',
    description: 'Crafted from 18/8 food-grade stainless steel with a double-wall vacuum insulation. Keeps beverages cold for 24 hours and hot for 12 hours. BPA-free, leak-proof, and built to last a lifetime — replacing thousands of single-use plastic bottles.',
    price: 32.99,
    originalPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
    category: 'reusable-essentials',
    tags: ['water bottle', 'stainless steel', 'reusable', 'hydration', 'BPA-free'],
    sustainabilityScore: 10,
    environmentalImpact: {
      plasticAvoided: 'Replaces ~1,460 plastic bottles per year',
      co2Reduced: 'Saves ~73 kg CO₂ annually',
      summary: 'Replaces 1,460 plastic bottles per year'
    },
    materials: ['18/8 Stainless Steel', 'BPA-Free Lid'],
    certifications: ['FDA Approved', 'BPA-Free'],
    origin: 'South Korea',
    featured: true,
    bestseller: true,
    stock: 250
  },
  {
    name: 'Bamboo Toothbrush (4-pack)',
    shortDescription: 'Biodegradable bamboo handle with BPA-free nylon bristles.',
    description: 'Over 4.7 billion plastic toothbrushes are discarded every year. Our bamboo toothbrushes feature a FSC-certified bamboo handle that is fully compostable and BPA-free nylon bristles. Comes in a pack of 4 with a 3-month supply.',
    price: 14.99,
    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600'],
    category: 'reusable-essentials',
    tags: ['bamboo', 'toothbrush', 'oral care', 'biodegradable', 'bathroom'],
    sustainabilityScore: 9,
    environmentalImpact: {
      plasticAvoided: 'Avoids 4 plastic toothbrushes',
      summary: 'Avoids 4 plastic toothbrushes per pack'
    },
    materials: ['FSC Bamboo', 'BPA-Free Nylon Bristles'],
    certifications: ['FSC', 'Vegan Society'],
    origin: 'China',
    featured: true,
    bestseller: true,
    stock: 400
  },
  {
    name: 'Organic Cotton Tote Bag',
    shortDescription: 'Heavy-duty tote from GOTS organic cotton — replaces hundreds of plastic bags.',
    description: 'Woven from thick GOTS-certified organic cotton canvas, this tote holds up to 15 kg and is machine washable. A single tote replaces hundreds of single-use plastic bags over its lifetime. Features an inner pocket and reinforced handles.',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    category: 'reusable-essentials',
    tags: ['tote bag', 'organic cotton', 'shopping', 'reusable', 'plastic-free'],
    sustainabilityScore: 9,
    environmentalImpact: {
      plasticAvoided: 'Replaces 500+ plastic bags over its lifetime',
      summary: 'Replaces 500+ plastic bags over its lifetime'
    },
    materials: ['100% GOTS Organic Cotton Canvas'],
    certifications: ['GOTS', 'Fair Trade'],
    origin: 'India',
    stock: 180
  },
  {
    name: 'Reusable Coffee Cup (350 ml)',
    shortDescription: 'Leak-proof cup from recycled materials — accepted at most coffee chains.',
    description: 'Made from 50% recycled coffee grounds and polypropylene, this cup is lightweight, dishwasher-safe, and accepted at most major coffee chains for a discount. The silicone sleeve provides grip and heat protection.',
    price: 22.99,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
    category: 'reusable-essentials',
    tags: ['coffee cup', 'reusable', 'travel', 'recycled', 'cafe'],
    sustainabilityScore: 8,
    environmentalImpact: {
      plasticAvoided: 'Replaces ~500 disposable cups per year',
      co2Reduced: 'Saves ~11 kg CO₂ annually',
      summary: 'Replaces 500 disposable cups per year'
    },
    materials: ['50% Recycled Coffee Grounds', 'PP', 'Silicone'],
    certifications: ['BPA-Free', 'FDA Approved'],
    origin: 'UK',
    featured: false,
    bestseller: true,
    stock: 130
  },

  // ── Natural Beauty ────────────────────────────────────────────────────────
  {
    name: 'Solid Shampoo Bar',
    shortDescription: 'Concentrated shampoo bar equivalent to 2–3 bottles — zero plastic.',
    description: 'One bar equals 2–3 bottles of liquid shampoo and comes in a compostable cardboard box. Formulated with natural oils (argan, coconut, castor) and free from sulphates, parabens, and silicones. Suitable for all hair types.',
    price: 16.99,
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600'],
    category: 'natural-beauty',
    tags: ['shampoo', 'bar', 'plastic-free', 'hair care', 'natural'],
    sustainabilityScore: 10,
    environmentalImpact: {
      plasticAvoided: 'Eliminates 2–3 plastic shampoo bottles',
      waterSaved: '80% less water than liquid shampoo',
      summary: 'Eliminates 3 plastic bottles, 80% less water'
    },
    materials: ['Argan Oil', 'Coconut Oil', 'Castor Oil', 'Natural Surfactants'],
    certifications: ['Vegan Society', 'Cruelty-Free'],
    origin: 'France',
    featured: true,
    stock: 200
  },
  {
    name: 'Natural Deodorant Stick',
    shortDescription: 'Aluminium-free deodorant in a compostable cardboard push-up tube.',
    description: 'Effective 24-hour protection without aluminium, parabens, or synthetic fragrances. The formula uses magnesium hydroxide and arrowroot powder to neutralise odour naturally. Packaged in a fully compostable cardboard tube.',
    price: 13.99,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600'],
    category: 'natural-beauty',
    tags: ['deodorant', 'natural', 'aluminium-free', 'plastic-free', 'beauty'],
    sustainabilityScore: 9,
    environmentalImpact: {
      plasticAvoided: 'Zero plastic packaging',
      summary: 'Zero plastic, aluminium-free formula'
    },
    materials: ['Magnesium Hydroxide', 'Arrowroot Powder', 'Shea Butter', 'Coconut Oil'],
    certifications: ['Vegan Society', 'Cruelty-Free', 'COSMOS Natural'],
    origin: 'USA',
    stock: 160
  },

  // ── Green Tech ────────────────────────────────────────────────────────────
  {
    name: 'Solar Charging Power Bank (20,000 mAh)',
    shortDescription: 'Dual solar panels + USB-C PD for off-grid charging anywhere.',
    description: 'This rugged 20,000 mAh power bank features dual solar panels and USB-C Power Delivery (45 W). Charge your devices off-grid using clean solar energy. The recycled ABS casing is drop-proof and water-resistant (IP65).',
    price: 59.99,
    originalPrice: 74.99,
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'],
    category: 'green-tech',
    tags: ['solar', 'power bank', 'charging', 'tech', 'outdoor'],
    sustainabilityScore: 8,
    environmentalImpact: {
      co2Reduced: 'Solar charging avoids grid CO₂ emissions',
      summary: 'Solar-powered, avoids grid CO₂ emissions'
    },
    materials: ['Recycled ABS', 'Monocrystalline Solar Cells', 'Li-Polymer Battery'],
    certifications: ['CE', 'FCC', 'IP65'],
    origin: 'Japan',
    featured: true,
    stock: 50
  }
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await User.deleteMany({ role: 'admin' });

  // Generate slugs for all products before inserting
  const productsWithSlugs = products.map(product => ({
    ...product,
    slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }));

  const inserted = await Product.insertMany(productsWithSlugs);
  console.log(`✅ Seeded ${inserted.length} products`);

  // Create admin user
  const admin = await User.create({
    name: 'Kaisiri Admin',
    email: 'admin@kaisiri.eco',
    password: 'Admin@2024!Secure',
    role: 'admin'
  });
  console.log(`✅ Admin created: ${admin.email} / Admin@2024!Secure`);

  mongoose.connection.close();
  console.log('🌿 Seed complete!');
}

seed().catch(err => { console.error(err); process.exit(1); });
