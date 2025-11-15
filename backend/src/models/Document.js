// server/models/Document.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  // We'll save the secure Cloudinary URL here
  filePath: {
    type: String,
    required: true,
  },
  // This is the Cloudinary public_id, needed for deletion
  publicId: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", DocumentSchema);