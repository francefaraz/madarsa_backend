const mongoose = require('mongoose');
const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to the Student model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
});

// Create a compound unique index on student and a custom month-year field
feeSchema.index(
  { student: 1, paymentDate: 1 },
  { unique: true }
);

// Virtual field to store the month-year part of the paymentDate
feeSchema.virtual('monthYear').get(function () {
  const paymentDate = this.paymentDate;
  return `${paymentDate.getFullYear()}-${paymentDate.getMonth() + 1}`;
});

module.exports = mongoose.model('Fee', feeSchema);



// const feeSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Student', // Reference to the Student model
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   paymentType:{
//     type:String,
//     required:true
//   },
//   paymentDate: {
//     type: Date,
//     required: true,
//   },
// });

// // Virtual field to store only the date part
// feeSchema.virtual('formattedDate').get(function () {
//   return this.paymentDate.toISOString().split('T')[0];
// });
// feeSchema.index({ student: 1, paymentDate: 1 }, { unique: true });


// module.exports = mongoose.model('Fee', feeSchema);
