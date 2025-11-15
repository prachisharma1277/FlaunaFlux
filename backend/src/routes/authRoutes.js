const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware'); // Assuming this is where generateToken lives
const passport = require('passport'); 
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const MY_ADMIN_CODE = process.env.ADMIN_SECRET_CODE; 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; 
let client = null;

if (GOOGLE_CLIENT_ID) {
    try {
        client = new OAuth2Client(GOOGLE_CLIENT_ID);
        console.log('Google OAuth2Client initialized for GSI route.');
    } catch (e) {
        console.error('ERROR: Failed to initialize Google OAuth2Client.', e.message);
        client = null;
    }
} else {
    console.warn('WARNING: GOOGLE_CLIENT_ID is missing. Google sign-in (POST /google) is disabled.');
}

// =======================================================
// /api/auth/register
// =======================================================
router.post('/register', async (req, res) => {
    try { 
        const { name, email, password, adminCode } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let userRole = 'general'; 
        if (adminCode === MY_ADMIN_CODE) {
            userRole = 'admin'; 
        }

        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
        });

        if (user) {
            // --- FIX 1: Standardized Response ---
            const token = generateToken(user._id, user.role);
            res.status(201).json({
                success: true,
                token: token, // Top-level token
                user: {      // User object
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// =======================================================
// /api/auth/login
// =======================================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
       
        if (user && (await bcrypt.compare(password, user.password))) {
            // --- FIX 2: Standardized Response ---
            const token = generateToken(user._id, user.role);
            res.json({
                success: true, 
                token: token, // <-- MOVED to top level
                user: {
                    _id: user._id,
                    name: user.name, 
                    email: user.email,
                    role: user.role,
                    // Token removed from here
                }
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});


// =======================================================
// /api/auth/google (GSI POST Route)
// =======================================================
router.post('/google', async (req, res) => {
    if (!client) {
        console.error('Attempted Google sign-in, but GOOGLE_CLIENT_ID is missing.');
        return res.status(503).json({ message: 'Google authentication service is unavailable.' });
    }

    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'Missing Google credential token.' });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Note: This password isn't used, but is a good idea
            // in case your User schema requires a password.
            const tempPassword = new mongoose.Types.ObjectId().toString();

            user = await User.create({
                name: name,
                email: email,
                password: tempPassword, // Use a random password
                role: 'general',
                avatar: picture,
            });
        }
        
        if (user) {
             // --- FIX 3: Standardized Response ---
            const token = generateToken(user._id, user.role);
            res.status(200).json({
                success: true,
                token: token, // <-- MOVED to top level
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    // Token removed from here
                }
            });
        } else {
             res.status(500).json({ message: 'Failed to create or retrieve user.' });
        }

    } catch (error) {
        console.error('Google JWT verification failed:', error);
        res.status(401).json({ message: 'Google authentication failed. Token invalid or expired.' });
    }
});


// =======================================================
// (The old GET /google and /google/callback routes are fine)
// (Your new frontend doesn't use them, but they don't hurt)
// =======================================================
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'], 
        session: false,
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failed', 
        session: false, 
    }),
    (req, res) => {
        if (!req.user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const token = generateToken(req.user._id, req.user.role);
        res.redirect(
            `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
        );
    }
);

module.exports = router;