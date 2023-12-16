const mongoose=require('mongoose');
console.log("commed fa")
const Schema=mongoose.Schema;

const studentsSchema=Schema({
    first_name: { type: String, required:true },
    last_name: { type: String, required:true },
    date_of_birth: { type: String, required:true },
    aadhar_number: { type: String ,required:true},
    father_name: { type: String ,required:true},
    age: { type: Number ,required:true},
    address:{type:String,required:true},
    gender: { type: String ,required:true},
    email: { type: String ,required:true},
    mother_name: { type: String ,required:true},
    roll_number: {type:String,required:true ,   unique: true},
    admission_number:{ type:String,required:true},
    entry_fee:{type:String,required:true},
    class: {
        type: String,
        enum: ['class_a', 'class_b', 'class_c', 'class_d'],
        required: true,
      },
    class_alias:{type:String},
    phone_number: { type: String ,required:true},
    photoUrl: { type: String },
    temp_address: { type: String},
    alternate_number: { type: String},
},{timestamps:true})

studentsSchema.pre('save', function (next) {
  const classAliasMapping = {
      'class_a': 'beginner',
      'class_b': 'Qaida',
      'class_c': 'Amma Para',
      'class_d': "Qur'an",
  };

  // Set class_alias based on the selected class
  this.class_alias = classAliasMapping[this.class] || '';

  next();
});

studentsSchema.index({ first_name: 1, last_name: 1, father_name: 1, phone_number: 1 }, { unique: true }, function(err, result) {
  if (err) {
    console.log("Error creating index:", err);
} else {
    console.log("Index created successfully:", result);
}
});

  
module.exports=mongoose.model('Students',studentsSchema,"students");