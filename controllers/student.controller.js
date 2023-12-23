const { request } = require('express');
const fs = require('fs')
const csvParser = require("csv-parser");
const path = require('path')


const Students= require('../models/student.model');

const sydFunctions=require('../util/syd-functions');
exports.createStudent = async(request,res,next)=>{
    console.log("hello in syd")
    console.log(request.body.first_name)

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
            roll_number: request.body.roll_number,
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
        console.log("FARAAA")
      const studentEmail = req.params.email;
        console.log(studentEmail);
      // Find the student by email and delete it
      const deletedStudent = await Students.findOneAndDelete({ email: studentEmail });
    console.log(deletedStudent)
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      console.log("DELETE HOGYA BE");
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