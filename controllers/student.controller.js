const { request } = require('express');
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
            "asdklfjjadsfkj"
        )
        console.log( request.file.path)
        const student=new Students({
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            photoUrl: request.file.path.replace("\\", "/"), // If you are on Linux or Mac just use req.file.path
            date_of_birth: request.body.dob,
            aadhar_number:request.body.aadhar_number,
            age: request.body.age,
            gender: request.body.gender,
            email: request.body.email,
            father_name: request.body.father_name,
            mother_name: request.body.mother_name,
            temp_address: request.body.temp_address,
            address:request.body.address,
            phone_number: request.body.phone_number,
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
    Students.find()
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving students."
        });
    });
}; 