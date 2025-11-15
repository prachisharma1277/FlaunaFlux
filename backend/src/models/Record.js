const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  incidentType: {
    type: String,
    required: true,
    enum: ['Sighting', 'Poaching', 'Illegal Activity', 'Carcass Found', 'Other'],
  },
  species: {
    type: String,
    required: true,
  },
  incidentDate: {
    type: Date,
    required: true,
  },
  // Use GeoJSON for location to enable geospatial queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  number: {
    type: Number,
    default: 1,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  notes: {
    type: String,
  },
  imageUrl: {
    type: String, // URL from Cloudinary
  },
  imagePublicId: {
    type: String, // public_id from Cloudinary (for deletion)
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    // required: true, // Uncomment if auth is implemented
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending',
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a 2dsphere index for geospatial queries
RecordSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Record', RecordSchema);