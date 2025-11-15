const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkAuth, checkRole } = require('../middleware/authMiddleware');

router.post(
  '/create-user',
  checkAuth,
  checkRole('admin'),
  async (req, res) => {
    
    const { name,email, password } = req.body; 

    if (!name|| !email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = await User.create({
        email,
        password,
        role: 'authorised',
      });

      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        message: 'Authorised user created successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  }
);

module.exports = router;