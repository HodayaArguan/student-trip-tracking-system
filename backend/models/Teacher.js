const mongoose = require('mongoose');
const teacherSchema = new mongoose.Schema({
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
  },
  password: {
    minlength: 6,
    required: true,
    type: String
  }
  
});
module.exports = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);