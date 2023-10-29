const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to the Student model
    required: true,
  },
  amount:{
    type: String,

  },
  paymentType: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

// Create a compound unique index to enforce uniqueness based on student, month, and year
feeSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;