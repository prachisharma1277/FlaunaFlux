// server/routes/api/documents.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../models/Document");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier"); // We'll need this for a buffer stream

// --- Cloudinary Configuration ---
// This will automatically pick up your .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// --- Multer Configuration ---
// We'll store the file in memory as a buffer
const upload = multer({
  storage: multer.memoryStorage(),
  // You can add file type limits here
  fileFilter: (req, file, cb) => {
    // Basic file type check (e.g., allow pdf, doc, docx)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."), false);
    }
  },
});
// --------------------------------

/**
 * @route   POST api/documents/upload
 * @desc    Upload a document
 * @access  Private
 */
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const userId = req.header("x-user-id");
    if (!userId) {
      return res.status(401).json({ msg: "No user ID, authorization denied" });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // --- Upload file buffer to Cloudinary ---
    // We wrap this in a Promise to use await
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

    // Set Cloudinary options
    const options = {
      folder: "faunaflux_documents", // Optional: A folder in Cloudinary
      resource_type: "auto", // Automatically detect file type
    };

    const result = await uploadStream(req.file.buffer, options);
    // ----------------------------------------

    // Create new document for our database
    const newDocument = new Document({
      user: userId,
      originalName: req.file.originalname,
      filePath: result.secure_url, // The permanent URL
      publicId: result.public_id, // The ID for deletion
      fileType: req.file.mimetype,
    });

    const doc = await newDocument.save();
    res.json(doc);
  } catch (err) {
    console.error("SERVER ERROR in /upload:", err.message);
    if (err.message.includes("Invalid file type")) {
      return res.status(400).json({ msg: "Invalid file type." });
    }
    res.status(500).json({ msg: "Server Error" });
  }
});

/**
 * @route   GET api/documents/my-documents
 * @desc    Get all documents for the logged-in user
 * @access  Private
 */
router.get("/my-documents", async (req, res) => {
  try {
    const userId = req.header("x-user-id");
    if (!userId) {
      return res.status(401).json({ msg: "No user ID, authorization denied" });
    }

    const documents = await Document.find({ user: userId }).sort({
      uploadDate: -1,
    });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;