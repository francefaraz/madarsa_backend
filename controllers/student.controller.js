const { request } = require('express');
const fs = require('fs')
const csvParser = require("csv-parser");
const path = require('path')


const Students= require('../models/student.model');



const sydFunctions=require('../util/syd-functions');


const PendingStudents = require('../models/studentRegister.model'); // Adjust the path as necessary

exports.createPendingStudent = async (req, res, next) => {
    try {
        const errorMessage = sydFunctions.validators(req, res);
        if (errorMessage) {
            return res.status(422).json({ message: 'Validation error', error: errorMessage });
        }
        if (!req.file) {
            return res.status(422).json({ message: 'Please add an image!' });
        }

        const protocol = req.secure ? 'https' : 'http';
        const hostUrl = `${protocol}://${req.headers.host}/`;

        const classAliasMapping = {
            'class_a': 'beginner',
            'class_b': 'Qaida',
            'class_c': 'Amma Para',
            'class_d': "Qur'an",
        };

        const pendingStudent = new PendingStudents({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            photoUrl: hostUrl + req.file.path.replace("\\", "/"),
            date_of_birth: new Date(req.body.dob),
            date_of_joining: new Date(req.body.doj),
            aadhar_number: req.body.aadhar_number,
            age: req.body.age,
            gender: req.body.gender,
            email: req.body.email,
            class: req.body.class,
            class_alias: classAliasMapping[req.body.class],
            father_name: req.body.father_name,
            mother_name: req.body.mother_name,
            admission_number: req.body.admission_number,
            entry_fee: req.body.entry_fee,
            temp_address: req.body.temp_address,
            address: req.body.address,
            phone_number: req.body.phone_number,
            father_number: req.body.father_number,
            mother_number: req.body.mother_number,
            alternate_number: req.body.alternate_number
        });

        const result = await pendingStudent.save();

        return res.status(201).json({
            message: "Student registration is pending approval!",
            student: result
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Student registration failed!', error: error.message });
    }
};



exports.approveStudent = async (req, res, next) => {
    try {
        const pendingStudent = await PendingStudents.findById(req.params.id);

        if (!pendingStudent) {
            return res.status(404).json({ message: 'Pending student not found' });
        }

        const rollNumber = await generateRollNumber(pendingStudent.class);

        const student = new Students({
            first_name: pendingStudent.first_name,
            last_name: pendingStudent.last_name,
            photoUrl: pendingStudent.photoUrl,
            date_of_birth: pendingStudent.date_of_birth,
            date_of_joining: pendingStudent.date_of_joining,
            aadhar_number: pendingStudent.aadhar_number,
            age: pendingStudent.age,
            gender: pendingStudent.gender,
            email: pendingStudent.email,
            class: pendingStudent.class,
            class_alias: pendingStudent.class_alias,
            father_name: pendingStudent.father_name,
            mother_name: pendingStudent.mother_name,
            roll_number: rollNumber,
            admission_number: pendingStudent.admission_number,
            entry_fee: pendingStudent.entry_fee,
            temp_address: pendingStudent.temp_address,
            address: pendingStudent.address,
            phone_number: pendingStudent.phone_number,
            father_number: pendingStudent.father_number,
            mother_number: pendingStudent.mother_number,
            alternate_number: pendingStudent.alternate_number
        });

        const result = await student.save();
        await pendingStudent.remove();

        return res.status(201).json({
            message: "Student has been approved and added to the main database!",
            student: result
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Student approval failed!', error: error.message });
    }
};


exports.createStudent = async(request,res,next)=>{
    console.log("hello in create student")
    let rollNumber = request.body.roll_number;
    console.log("roll number is ",rollNumber,"body is ",request.body.roll_number)
    if (!rollNumber || rollNumber === "null") {
      console.log("generating roll number automatic")
      rollNumber = await generateRollNumber(request.body.class);
      console.log("generated roll number is ",rollNumber)
    }
    console.log("roll number is ",rollNumber)


    try{
        
        const errorMessage = sydFunctions.validators(request, res);
        console.log('Retrieved errorMessage', errorMessage);
        if (errorMessage) {
            return res.status(422).json({ message: 'Validation error', error: errorMessage });
        }
        if (!request.file) {
            return res.status(422).json({ message: 'Please add an image!' });
        }   
        console.log(
            "asdklfjjadsfkj",request.body
        )
        console.dir(request.body)
        console.log( request.file.path)
        const protocol = request.secure ? 'https' : 'http';
        const hostUrl = `${protocol}://${request.headers.host}/`;
        const classAliasMapping = {
          'class_a': 'beginner',
          'class_b': 'Qaida',
          'class_c': 'Amma Para',
          'class_d': "Qur'an",
        };


        const student=new Students({
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            photoUrl: hostUrl+request.file.path.replace("\\", "/"), // If you are on Linux or Mac just use req.file.path
            date_of_birth: request.body.dob,
            date_of_joining: request.body.doj,
            aadhar_number:request.body.aadhar_number,
            age: request.body.age,
            gender: request.body.gender,
            email: request.body.email,
            class:request.body.class,
            class_alias : classAliasMapping[request.body.class],
            father_name: request.body.father_name,
            mother_name: request.body.mother_name,
            roll_number: rollNumber,
            admission_number:request.body.admission_number,
            entry_fee:request.body.entry_fee,
            temp_address: request.body.temp_address,
            address:request.body.address,
            phone_number: request.body.phone_number,
            father_number:request.body.father_number,
            mother_number:request.body.mother_number,
            alternate_number: request.body.alternate_number

        })
        const result = await student.save()

        
        console.log('result', await result);
        return res.status(201).json({
            message: "student is successfully added!",
            student: result
        });
    } catch (error) {
        console.log('error', error);
        // if (req.file) {
        //     sydFunctions.deleteImage(player.photoUrl);
        // }
        res.status(500).json({ message: 'Student Creation failed!' });
    }
};

const generateRollNumber = async (studentClass) => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const madarsaCode = '786';
  const classCode = studentClass.toUpperCase().slice(-1);

  const lastStudent = await Students.findOne({ class: studentClass }).sort({ roll_number: -1 }).select('roll_number')


  if (!lastStudent || !lastStudent.roll_number) {
      return `${madarsaCode}-${currentYear}-${classCode}-001`;
  }
 
  const lastRollNumber = lastStudent.roll_number;
  const rollNumberParts = lastRollNumber.split('-');
  const numericPart = parseInt(rollNumberParts[3], 10);
  const newNumericPart = numericPart + 1;
  const formattedNumericPart = String(newNumericPart).padStart(3, '0');

  return `${madarsaCode}-${currentYear}-${classCode}-${formattedNumericPart}`;
};



exports.getAllStudents= async(req, res, next)=>{
    Students.find().sort({class:1,roll_number:1})
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving students."
        });
    });
}; 

// Delete a student by email
exports.deleteStudentByEmail = async (req, res) => {
    console.log("hello")
    try {
        console.log("in student delete by email")
      const studentEmail = req.params.email;
        console.log(studentEmail);
      // Find the student by email and delete it
      const deletedStudent = await Students.findOneAndDelete({ email: studentEmail });
    console.log(deletedStudent)
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      console.log("DELETED");
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Failed to delete student' });
    }
  };


  exports.uploadStudentData = async (req,res)=>{
    try {
    console.log(req.file)
    const csvUrl ='./uploads/' + req.file.filename // Path to the uploaded CSV file
     const result = await csvToDb(csvUrl);
     result.forEach((student) => {
      const classAliasMapping = {
        'class_a': 'beginner',
        'class_b': 'Qaida',
        'class_c': 'Amma Para',
        'class_d': "Qur'an",
      };

      student.class_alias = classAliasMapping[student.class] || '';
    });
    // csvToDb('./uploads/' + req.file.filename).then(console.log("done")).catch(err => console.log(err));
    await Students.insertMany(result);

    res.status(200).json({ message: 'CSV uploaded and students inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


  async function csvToDb(csvUrl) {
    return new Promise((resolve, reject) => {
      const result = [];
      fs.createReadStream(csvUrl)
        .pipe(csvParser())
        .on('data', (data) => {
          console.log("name ",data.first_name,"-",data.last_name," [fara");
      if(data.first_name!='')
            result.push(data);
        })
        .on('end', () => {
          // Delete the CSV file after reading its content
          fs.unlinkSync(csvUrl);
          resolve(result);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

// student update 

exports.updateStudent = async (req, res, next) => {
  const studentId = req.params.id;

  try {
    const student = await Students.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update fields based on the request body
    console.log("REQUEST BODY IS ",req.body)
    student.first_name = req.body.first_name || student.first_name;
    student.last_name = req.body.last_name || student.last_name;
    student.date_of_birth = req.body.date_of_birth || student.date_of_birth;
    student.aadhar_number = req.body.aadhar_number || student.aadhar_number;
    student.date_of_joining = req.body.date_of_joining || student.date_of_joining;
    student.father_name = req.body.father_name || student.father_name;
    student.age = req.body.age || student.age;
    student.address = req.body.address || student.address;
    student.gender = req.body.gender || student.gender;
    student.email = req.body.email || student.email;
    student.mother_name = req.body.mother_name || student.mother_name;
    student.roll_number = req.body.roll_number || student.roll_number;
    student.father_number = req.body.father_number || student.father_number;
    student.mother_number = req.body.mother_number || student.mother_number;
    student.admission_number = req.body.admission_number || student.admission_number;
    student.entry_fee = req.body.entry_fee || student.entry_fee;
    student.class = req.body.class || student.class;
    student.phone_number = req.body.phone_number || student.phone_number;
    student.photoUrl = req.body.photoUrl || student.photoUrl;
    student.temp_address = req.body.temp_address || student.temp_address;
    student.alternate_number = req.body.alternate_number || student.alternate_number;

    // Update class_alias based on the selected class
    const classAliasMapping = {
      'class_a': 'beginner',
      'class_b': 'Qaida',
      'class_c': 'Amma Para',
      'class_d': "Qur'an",
    };
    student.class_alias = classAliasMapping[student.class] || '';

    // Save the updated student
    const updatedStudent = await student.save();

    return res.status(200).json({
      message: 'Student updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



//   async function csvToDb(csvUrl) {
//     const result = [];
//     console.log("csv url is ",csvUrl)
//     fs.createReadStream(csvUrl)
//   .pipe(csvParser())
//   .on("data", (data) => {
//     console.log(data)
//     if(data.first_name!='')
//     result.push(data);
//   })
//   .on("end", () => {
//     console.log(result);
//     fs.unlinkSync(csvUrl)

//   });
// }
//https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg