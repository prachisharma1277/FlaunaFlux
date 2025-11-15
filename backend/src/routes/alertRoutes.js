const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Report=require('../models/Report');
const sendMail = require('../config/mail');

const setup = (io) => {
  
  router.get('/', async (req, res) => {
    try {
      const alerts = await Alert.find()
        .sort({ timestamp: -1 }) // Newest first
        .limit(10);
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // --- POST /api/alerts/trigger ---
  // This is the endpoint your AI, sensors, or "Report Incident" button will call
  router.post('/trigger', async (req, res) => {
    const { reportType,
    species,
    notes,
    location } = req.body;

    const newAlert = new Alert({
      reportType,
    species,
    notes,
    location
    });

    try {
      // 1. Save the new alert to the database
      const savedAlert = await newAlert.save();

      // 2. EMIT the new alert to ALL connected clients
      console.log('Emitting new-alert:', savedAlert);
      io.emit('new-alert', savedAlert); // This is the real-time part!

      res.status(201).json(savedAlert);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  return router; // Return the configured router
};

module.exports = setup;