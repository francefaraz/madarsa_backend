const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  },
  classType: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
});

// Virtual field to store only the date part
attendanceSchema.virtual('formattedDate').get(function () {
  return this.date.toISOString().split('T')[0];
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
