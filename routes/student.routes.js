const express= require('express');
const { body } = require('express-validator');

const router = express.Router();
const studentController=require('../controllers/student.controller');
// router.post('/add',)
const { check, validationResult } = require("express-validator");
const uploadImage = require('../middleware/upload-image');

console.log("entered in student routes")
router.post('/add',uploadImage, 
 [
    // console.log("hello"),
        body('first_name')
            .notEmpty()
            .withMessage('Please enter first name!'),
        body('age')
            .notEmpty()
            .withMessage("Please enter the student's age")
            .isInt()
            .withMessage("Age must be an integer"),
       
],
    studentController.createStudent
);

router.get("/",studentController.getAllStudents)

module.exports=router