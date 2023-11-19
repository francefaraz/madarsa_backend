const mongoose=require('mongoose');
console.log("commed")
const Schema=mongoose.Schema;

const studentsSchema=Schema({
    first_name: { type: String, required:true },
    last_name: { type: String, required:true },
    photoUrl: { type: String },
    date_of_birth: { type: String, required:true },
    aadhar_number: { type: String ,required:true},
    age: { type: Number ,required:true},
    gender: { type: String ,required:true},
    email: { type: String ,required:true},
    father_name: { type: String ,required:true},
    mother_name: { type: String ,required:true},
    temp_address: { type: String},
    address:{type:String,required:true},
    phone_number: { type: String ,required:true},
    alternate_number: { type: String},
    class: {
        type: String,
        enum: ['class_a', 'class_b', 'class_c', 'class_d'],
        required: true,
      },
    // photoUrl: { type: String ,required:true},
},{timestamps:true})

studentsSchema.index({ first_name: 1, last_name: 1, father_name: 1,phone_number:1 }, { unique: true });

module.exports=mongoose.model('Students',studentsSchema,"students");