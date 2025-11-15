const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  
  reportType: {
    type: String,
    required: true,
    enum: ['Animal Sighting', 'Poaching Activity', 'Damaged Fence', 'Other']
  },
  species: {
    type: String,
    required: false // Only required if reportType is 'Animal Sighting'
  },
  notes: {
    type: String,
    required: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // Stored as [longitude, latitude]
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);