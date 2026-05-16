const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadDocuments } = require('../config/cloudinary');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET || 'kaisiri_jwt_secret', { expiresIn: '14d' });

// POST /api/auth/register
// Handles BOTH standard users and sellers with full verification details
router.post('/register', uploadDocuments.array('documents', 5), async (req, res) => {
    try {
        const { 
            name, email, password, role, 
            storeName, storeDescription,
            businessName, businessRegistration, taxId,
            warehouseStreet, warehouseCity, warehouseState, warehousePostalCode, warehouseCountry,
            contactPhone, businessEmail,
            accountName, accountNumber, bankName, routingNumber
        } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email, and password are required' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const userData = { 
            name, 
            email, 
            password, 
            role: role || 'user' 
        };

        // If registering as a seller, nest the verification fields
        if (role === 'seller') {
            userData.storeName = storeName || `${name}'s Store`;
            userData.storeDescription = storeDescription || '';
            userData.businessName = businessName;
            userData.businessRegistration = businessRegistration;
            userData.taxId = taxId;
            userData.contactPhone = contactPhone;
            userData.businessEmail = businessEmail;
            
            userData.warehouseAddress = {
                street: warehouseStreet,
                city: warehouseCity,
                state: warehouseState,
                postalCode: warehousePostalCode,
                country: warehouseCountry
            };
            
            userData.bankDetails = {
                accountName,
                accountNumber,
                bankName,
                routingNumber
            };

            userData.verificationStatus = 'pending';
            userData.verificationSubmittedAt = new Date();

            if (req.files && req.files.length > 0) {
                userData.documents = req.files.map(file => ({
                    type: 'verification_doc',
                    url: file.path, 
                    uploadedAt: new Date()
                }));
            }
        }

        const user = await User.create(userData);
        const token = generateToken(user._id);
        
        // Optional: req.session.token = token; (if using sessions)

        res.status(201).json({
            token,
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                storeName: user.storeName,
                verificationStatus: user.verificationStatus
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = generateToken(user._id);
        req.session.token = token;

        res.json({
            token,
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                ecoPoints: user.ecoPoints,
                verificationStatus: user.verificationStatus 
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('wishlist', 'name price images sustainabilityScore');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, preferredCategories } = req.body;
        const user = await User.findById(req.user._id);
        if (name) user.name = name;
        if (preferredCategories) user.preferredCategories = preferredCategories;
        await user.save();
        res.json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            ecoPoints: user.ecoPoints 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;