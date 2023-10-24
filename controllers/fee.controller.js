const Students= require('../models/student.model');
const Fee= require('../models/fee.model');

exports.getStudentsFeeListBasedOnYearAndMonth = async (req, res) => {

    try {

        const { month, year } = req.query;

      console.log("IN FUNCTION")
      const studentsWithPaymentStatus = await Students.aggregate([
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
            class:1,
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
      res.status(200).json(studentsWithPaymentStatus);
  } catch (error) {
    // Handle any errors
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.createFee = async (req, res) => {
    try {
      const { studentId, paymentType, paymentDate, year, month } = req.body;
  
      const fee = new Fee({
        student: studentId,
        paymentType,
        paymentDate,
        year,
        month,
      });
  
      await fee.save();
  
      res.status(201).json({ message: 'Fee record saved successfully', fee });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Duplicate fee record' });
      } else {
        res.status(500).json({ message: 'Error saving fee record', error: error.message });
      }
    }
  };