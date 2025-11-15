const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy; // You had this
const ExtractJwt = require('passport-jwt').ExtractJwt; // You had this
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path if needed
const dotenv = require('dotenv');

dotenv.config(); // Make sure .env variables are loaded

// --- JWT Strategy Options ---
// This tells passport to extract the token from the "Authorization: Bearer <token>" header
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET; // This MUST match the secret in authRoutes.js

module.exports = function (passport) {
  
  // ======================================================
  // === 1. JWT STRATEGY (For protecting your API routes) ===
  // ======================================================
  // This was the missing part
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // jwt_payload is the decoded token { id: '...', ... }
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            // User found, return them (this becomes req.user)
            return done(null, user);
          }
          // User not found
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  // ========================================================
  // === 2. GOOGLE STRATEGY (For logging in with Google) ===
  // ========================================================
  // This part was already correct
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback', 
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }

          user = await User.findOne({ email: newUser.email });
          if (user) {
            user.googleId = newUser.googleId;
            user.displayName = user.displayName || newUser.displayName;
            await user.save();
            return done(null, user);
          }
          
          user = await User.create(newUser);
          return done(null, user);

        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  // --- Session Management (Needed for Google OAuth flow) ---
  // These are used by Google OAuth during the redirect flow
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};