const express= require('express');
const { body } = require('express-validator');

const multer= require('multer');
const router = express.Router();
const studentController=require('../controllers/student.controller');
const attendanceController= require('../controllers/attendance.controller')
const feeController= require('../controllers/fee.controller')
// router.post('/add',)
const { check, validationResult } = require("express-validator");
const uploadImage = require('../middleware/upload-image');


const fs = require('fs')
const csvParser = require("csv-parser");
const path = require('path')


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

router.delete('/:email', studentController.deleteStudentByEmail);


// Route for marking attendance for a student
router.post('/attendance', attendanceController.markAttendance);

// Route for marking attendance for multiple students in a group
router.post('/attendance/group', attendanceController.markAttendanceGroup);

// Get attendance list based on date

// router.get('/attendance/date/:date', attendanceController.getAttendanceByDate);


// Get attendance list based on date as a query parameter
router.get('/attendance/date', attendanceController.getAttendanceByDate);



// Get attendance list based on class
router.get('/attendance/class/:classType', attendanceController.getAttendanceByClass);

// Get attendance list for a single student
router.get('/attendance/student/:studentId', attendanceController.getAttendanceForStudent);



// Get attendance list based on date and class type as query parameters
router.get('/attendance', attendanceController.getAttendance);


// Get attendance list based on class and date (both are optional)
// router.get('/attendance', attendanceController.getAttendanceByClassAndDate);

// getting fee list for the given month and year
router.get('/fee-status',feeController.getStudentsFeeListBasedOnYearAndMonth);

//inserting fee
router.post('/insert-fee',feeController.createFee)




var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, './uploads/')
    },
    filename: (req, file, callBack) => {
      callBack(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname),
      )
    },
  })
  var upload = multer({
    storage: storage,
  })

router.post('/uploadcsv',upload.single('uploadcsv'),studentController.uploadStudentData)

router.get('/get_attendance/date', attendanceController.getStudentsAttendanceStatus);

router.get('/get_students_attendance_reports',attendanceController.getStudentsAttendanceReport);

module.exports=router