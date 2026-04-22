const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  fullName: {
    trim: true,
    type: String,
    required: true,
  },id: {
    unique: true,
    trim: true,
    type: String,
    required: true,
  }, className: {
    trim: true,
    type: String,
    required: true,
  }
  
});
module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);