const connection=require('./configs/db.config')

// const Fee = require('./models/fee.model')

// // const createFee = async (studentId, amount, paymentType, paymentDate) => {
// //     await connection()
// //     try {
// //         const fee = new Fee({
// //             student: studentId,
// //             amount,
// //             paymentType,
// //             paymentDate,
// //           });
      
// //           await fee.save();
// //           console.log('Fee record saved successfully.');
// //         } catch (error) {
// //           if (error.code === 11000) {
// //             console.error('Duplicate fee record:', error.message);
// //           } else {
// //             console.error('Error saving fee record:', error.message);
// //           }
// //         }
// //   };
  
// //   // Replace with the actual student ID and date you want to test
// //   const studentId = '65059a7baf418726398ad500';
// //   const formattedDate = '2023-11-10';
  
// //   // Test creating two fee records with the same student and formattedDate
// //   createFee(studentId, 100, 'Cash', formattedDate);
// //   createFee(studentId, 150, 'Credit Card', formattedDate);

// const createFee = async (studentId, paymentDate, paymentType, year, month) => {
//   await connection();
//   try {
//     const fee = new Fee({
//       student: studentId, // Correct the order
//       paymentType: paymentType, // Correct the order
//       paymentDate: paymentDate, // Correct the order
//       year: year,
//       month: month,
//     });

//     await fee.save();
//     console.log('Fee record saved successfully.');
//   } catch (error) {
//     if (error.code === 11000) {
//       console.error('Duplicate fee record:', error.message);
//     } else {
//       console.error('Error saving fee record:', error.message);
//     }
//   }
// };

// // Replace with the actual student ID, payment type, payment date, year, and month
// const studentId = '65059a7baf418726398ad500';
// const paymentType = 'Cash';
// const paymentDate = '2023-11-10';
// const year = 2024;
// const month = 'November';

// // Call the function to create the fee record
// // createFee(studentId, paymentDate, paymentType, year, month);
// createFee(studentId, paymentDate, paymentType, year, month);

//   // // Replace with the actual student ID, amount, payment type, payment date, year, and month
//   // const studentId = '650474db0b413eb9846a2c94';
//   // const amount = 100;
//   // const paymentType = 'Cash';
//   // const paymentDate = '2023-11-10';
//   // const year = 2023;
//   // const month = 11;
//   // const formattedDate = '2023-11-11';
  
//   // Call the function to create the fee record
//   // createFee(paymentDate,studentId, paymentType,  month, year)
//   // createFee(formattedDate,studentId,'Credit Card',month,year);

const Student = require('./models/student.model');
const Fee = require('./models/fee.model');
const getStudentsWithPaymentStatus = async (month, year) => {
  await connection()
  try {
    console.log("IN FUNCTION")
    const studentsWithPaymentStatus = await Student.aggregate([
      {
        $lookup: {
          from: 'fees', // Collection name for fees
          localField: '_id',
          foreignField: 'student',
          as: 'fees',
        },
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          paymentStatus: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$fees',
                        as: 'fee',
                        cond: {
                          $and: [
                            { $eq: ['$$fee.month', month] },
                            { $eq: ['$$fee.year', year] },
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: 'Paid',
              else: 'Not Paid',
            },
          },
        },
      },
    ]);
    console.log("student data is ", studentsWithPaymentStatus); // Debug statement
    return studentsWithPaymentStatus;
  } catch (error) {
    console.log("Error:", error); // Debug statement
    throw error;
  }
};

// Example usage:
const month = 'November'; // Specify the month
const year = 2023; // Specify the year

getStudentsWithPaymentStatus(month, year)
  .then((students) => {
    console.log('Students with payment status:');
    console.log(students);
    console.log(students.length);

  })
  .catch((error) => {
    console.error('Error:', error);
  });
