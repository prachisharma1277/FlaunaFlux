const express = require('express');
const router = express.Router();
const Record = require('../models/Record'); // Adjust path to models
const { v2: cloudinary } = require('cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary'); // <-- REMOVE this
const streamifier = require('streamifier'); // <-- ADD this
const multer = require('multer');
const dotenv = require('dotenv');

// Load environment variables for this file
dotenv.config();

// --- Cloudinary Configuration (This part is fine) ---
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Cloudinary environment variables are not set!");
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// --- Multer Storage (REPLACED) ---
// We now store the file in memory as a buffer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Map allowed formats from your old code to MIME types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'video/mp4',
      'video/quicktime' // .mov
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type (jpg, png, mp4, mov allowed)."), false);
    }
  },
});

/**
 * @route   POST /log
 * @desc    Log a new incident/sighting
 * @access  Public (Base path is /api/records)
 */
router.post('/log', upload.single('image'), async (req, res) => {
  try {
    const {
      incidentType,
      species,
      incidentDate,
      latitude,
      longitude,
      number,
      severity,
      notes,
    } = req.body;

    let imageUrl = null;
    let imagePublicId = null;

    // --- NEW: Manual Cloudinary Upload Logic ---
    if (req.file) {
      // 1. Function to upload buffer
      const uploadStream = (fileBuffer, options) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      // 2. Set options (from your old storage params)
      const options = {
        folder: 'fauna-flux-sightings',
        resource_type: 'auto'
      };

      // 3. Perform the upload
      const result = await uploadStream(req.file.buffer, options);

      // 4. Set variables from Cloudinary result
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    // --- END: New Upload Logic ---

    // Create new record (This logic is the same as your old code)
    const newRecord = new Record({
      incidentType,
      species,
      incidentDate: new Date(incidentDate),
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      number: parseInt(number, 10),
      severity,
      notes,
      imageUrl,       // Comes from result.secure_url
      imagePublicId,  // Comes from result.public_id
    });

    // Save to database
    const savedRecord = await newRecord.save();

    res.status(201).json(savedRecord);

  } catch (error) {
    console.error('Error in /api/records/log:', error);
    // Handle file type error from multer
    if (error.message.includes("Invalid file type")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while logging record.', error: error.message });
  }
});

module.exports = router;