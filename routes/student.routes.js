const express= require('express');
const { body } = require('express-validator');

const router = express.Router();
const studentController=require('../controllers/student.controller');
const attendanceController= require('../controllers/attendance.controller')
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


module.exports=router