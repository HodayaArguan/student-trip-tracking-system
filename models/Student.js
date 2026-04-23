const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  fullName: {
    trim: true,
    type: String,
    required: true,
  },
  id: {
    unique: true,
    trim: true,
    type: String,
    required: true,
  },
  className: {
    trim: true,
    type: String,
    required: true,
  },
  lastLocation: {
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    timestamp: {
      type: Date,
      required: false,
    },
  },
});
module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
