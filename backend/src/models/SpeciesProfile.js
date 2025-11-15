const mongoose = require('mongoose');

const SpeciesProfileSchema = new mongoose.Schema({
  species: {
    type: String,
    required: true, // e.g., "Tiger"
  },
  region: {
    type: String,
    required: true, // e.g., "Western Ghats"
  },                                                                                                                 
  criticalHighTemp: {
    type: Number, // e.g., 40 (in °C)
  },
  criticalLowTemp: {
    type: Number,
  },
  highTempMessage: {
    type: String, // "Risk of heat stress, reduced hunting."
  },
  lowTempMessage: {
    type: String, // "Risk of hypothermia, reduced activity."
  }
  // You can add many more rules here (e.g., rainfall, drought)
});

module.exports = mongoose.model('SpeciesProfile', SpeciesProfileSchema);