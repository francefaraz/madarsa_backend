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

// router.post(
//     "/signup",
//     [
//       check("name")
//         .isLength({ min: 3 })
//         .withMessage("the name must have minimum length of 3")
//         .trim(),
  
//       check("email")
//         .isEmail()
//         .withMessage("invalid email address")
//         .normalizeEmail(),
  
//       check("password")
//         .isLength({ min: 8, max: 15 })
//         .withMessage("your password should have min and max length between 8-15")
//         .matches(/\d/)
//         .withMessage("your password should have at least one number")
//         .matches(/[!@#$%^&*(),.?":{}|<>]/)
//         .withMessage("your password should have at least one sepcial character"),
  
//       check("confirmPassword").custom((value, { req }) => {
//         if (value !== req.body.password) {
//           console.log(req.body.password, req.body.confirmPassword);
//           throw new Error("confirm password does not match");
//         }
//         return true;
//       }),
//     ],
//     (req, res, next) => {
//       const error = validationResult(req).formatWith(({ msg }) => msg);
  
//       const hasError = !error.isEmpty();
  
//       if (hasError) {
//         res.status(422).json({ error: error.array() });
//       } else {
//         res.status(200).json({messgae:"done"})
//       }
//     },
//     // signupController
   
//   );
  

router.get("/",studentController.getAllStudents)

module.exports=router