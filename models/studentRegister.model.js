const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingStudentsSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    aadhar_number: { type: String, required: true },
    date_of_joining: { type: Date, required: true },
    father_name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Invalid email'] },
    mother_name: { type: String, required: true },
    father_number: { type: String },
    mother_number: { type: String },
    admission_number: { type: String, required: true, unique: true },
    entry_fee: { type: String, required: true },
    class: {
        type: String,
        enum: ['class_a', 'class_b', 'class_c', 'class_d'],
        required: true,
    },
    class_alias: { type: String },
    phone_number: { type: String, required: true },
    photoUrl: { type: String },
    temp_address: { type: String },
    alternate_number: { type: String },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
}, { timestamps: true });

pendingStudentsSchema.pre('save', function (next) {
    const classAliasMapping = {
        'class_a': 'beginner',
        'class_b': 'Qaida',
        'class_c': 'Amma Para',
        'class_d': "Qur'an",
    };
    this.class_alias = classAliasMapping[this.class] || '';
    next();
});

module.exports = mongoose.model('PendingStudents', pendingStudentsSchema, 'pending_students');
