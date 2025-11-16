const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { v2: cloudinary } = require('cloudinary');
const passport = require('passport');
const fetch = require('node-fetch');
const router = express.Router();
const API_URL=process.env.BACKEND_URL;
// --- 1. Import your new mailer function ---
const { sendAlertEmail } = require('../config/mail'); 

// Import models
const Report = require('../models/Report').default;
const Alert = require('../models/Alert').default;

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Cloudinary Upload Function ---
const uploadImageToCloud = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'flaunaflux_reports' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url); // Return the secure URL
      }
    );
    stream.end(fileBuffer);
  });
};
router.post(
  '/analyze',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'), 
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return res.status(500).json({ message: 'HF_TOKEN is not configured.' });
    }
    try {
      const imageBuffer = req.file.buffer;
      const hfResponse = await fetch(
        "https://router.huggingface.co/hf-inference/models/microsoft/resnet-50",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": req.file.mimetype 
          },
          body: imageBuffer
        }
      );
      if (!hfResponse.ok) {
        throw new Error(`Hugging Face API error: ${hfResponse.statusText}`);
      }
      const result = await hfResponse.json();
      if (Array.isArray(result) && result.length > 0) {
        const topGuess = result[0].label;
        res.json({ species: topGuess });
      } else {
        throw new Error('AI model did not return a valid result.');
      }
    } catch (err) {
      console.error('Error calling Hugging Face model:', err.message);
      res.status(500).json({ message: 'Failed to analyze image.' });
    }
  }
);

// ========================================================
// === POST /api/reports/ ===
// === This route is now updated with email logic ===
// ========================================================
/**
 * @route   POST /api/reports/
 * @desc    Submit a new complete report (with image and data)
 * @access  Private
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  async (req, res) => {
    try {
      const { reportType, species, notes, latitude, longitude, aiSuggestion } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: 'Image is required.' });
      }

      // 1. Upload image to Cloudinary
      const imageUrl = await uploadImageToCloud(req.file.buffer);

      // 2. Create new report
      const newReport = new Report({
        reportType,
        species,
        notes,
        latitude,
        longitude,
        imageUrl,
        aiSuggestion: aiSuggestion || null,
        userConfirmed: aiSuggestion ? species === aiSuggestion : null,
        user: req.user.id,
      });

      // 3. Save the report to MongoDB
      const savedReport = await newReport.save();

      // 4. AFTER saving, trigger alert AND send email
      try {
        const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        };

        // --- 4a. Trigger the alert endpoint ---
        await axios.post(`${API_URL}/api/alerts/trigger`, {
          reportType,
          species,
          notes,
          location,
        });

        // --- 4b. Prepare data for the email ---
        // We create an object that has the same 'shape' as an Alert
        const alertDataForEmail = {
          type: reportType,
          species: species,
          description: notes,
          severity: 'High', // You might want to pass this from the frontend too
          location: location,
        };
        
        // --- 4c. Send the email alert ---
        await sendAlertEmail(alertDataForEmail);

      } catch (alertErr) {
        // If alert or email fails, just log it. Don't fail the main report.
        console.error(
          'Failed to trigger alert or send email:',
          alertErr.message
        );
      }

      // 5. Send the successful response
      res.status(201).json(savedReport);

    } catch (err) {
      // 6. Send the error response
      console.error('Error submitting report:', err);
      res.status(500).json({ message: 'Error submitting report.' });
    }
  }
);

// === GET /api/reports/ ===
// (This route remains unchanged)
router.get('/', async (req, res) => {
  // ... (logic for fetching reports) ...
});


module.exports = router;
