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
            fees:1,
            roll_number:1,
            paymentDate: {
              $ifNull: [
                {
                  $cond: {
                    if: {
                      $and: [
                        { $gt: [{ $size: '$fees' }, 0] },
                        { $eq: [{ $arrayElemAt: ['$fees.month', 0] }, parseInt(month)] },
                        { $eq: [{ $arrayElemAt: ['$fees.year', 0] }, parseInt(year)] },
                      ],
                    },
                    then: { $arrayElemAt: ['$fees.paymentDate', 0] },
                    else: null,
                  },
                },
                null,
              ],
            },
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
                              { $eq: ['$$fee.month', parseInt(month)] },
                              { $eq: ['$$fee.year', parseInt(year)] },
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
            paymentType: {
              $ifNull: [
                {
                  $cond: {
                    if: {
                      $and: [
                        { $gt: [{ $size: '$fees' }, 0] },
                        { $eq: [{ $arrayElemAt: ['$fees.month', 0] }, parseInt(month)] },
                        { $eq: [{ $arrayElemAt: ['$fees.year', 0] },  parseInt(year)] },
                      ],
                    },
                    then: { $arrayElemAt: ['$fees.paymentType', 0] },
                    else: null,
                  },
                },
                null,
              ],
            }
          },
        },
      ]).sort({class:1,roll_number:1});
      console.log(studentsWithPaymentStatus);
      res.status(200).json(studentsWithPaymentStatus);
  } catch (error) {
    // Handle any errors
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.createFee = async (req, res) => {
    try {
      const { studentId, paymentType, paymentDate,amount, year, month } = req.body;
  
      const fee = new Fee({
        student: studentId,
        paymentType,
        paymentDate,
        amount,
        year,
        month,
      });
      console.log("FEE IS ",fee)
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