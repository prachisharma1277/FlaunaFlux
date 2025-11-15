import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    required: true,
    enum: ['Animal Sighting', 'Poaching Activity', 'Damaged Fence', 'Other'],
  },
  species: {
    type: String,
    // Not required, as it might not be an 'Animal Sighting' report
  },
  notes: {
    type: String,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, 
  },
  aiSuggestion: {
    type: String,
  },
  userConfirmed: {
    type: Boolean,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Report = mongoose.model('Report', reportSchema);

export default Report;