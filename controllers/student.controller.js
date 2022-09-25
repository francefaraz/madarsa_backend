const Students= require('../models/student.model');

const sydFunctions=require('../util/syd-functions');
exports.createStudent = async(req,res,next)=>{
    try{
        
        const errorMessage = sydFunctions.validators(req, res);
        console.log('Retrieved errorMessage', errorMessage);
        if (errorMessage) {
            return res.status(422).json({ message: 'Validation error', error: errorMessage });
        }
        const result = await new Students(req.body).save()
        console.log('result', result);
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