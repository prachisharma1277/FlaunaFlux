const express = require('express');
const router = express.Router();
const { checkAuth, checkRole } = require('../middleware/authMiddleware');

router.get('/public', checkAuth, (req, res) => {
  res.json({
    message: `Hello, ${req.user.email}! This is public data for all logged-in users.`,
  });
});

router.get(
  '/sensitive',
  checkAuth,
  checkRole('authorised'),
  (req, res) => {
    res.json({
      message: `Welcome, Authorised User ${req.user.email}!`,
      sensitiveData: 'Tracking data for endangered species...',
    });
  }
);

router.get(
  '/general',
  checkAuth, 
  checkRole('general'),
  (req, res) => {
    res.json({
      message: `Hello General User ${req.user.email}!`,
      generalInfo: 'Thanks for supporting our cause!',
    });
  }
);

module.exports = router;