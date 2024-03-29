
const Students= require('../models/student.model');
const Attendance=require('../models/attendance.model');
// Mark attendance for a student
exports.markAttendance = async (req, res) => {
    try {
      const { studentId, date, status, classType } = req.body;
  
      // Check if the student with the provided ID exists
      const student = await Students.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Create a new attendance record
      const attendanceRecord = new Attendance({
        student: studentId,
        date,
        status,
        classType,
      });
  
      // Save the attendance record
      await attendanceRecord.save();
  
      res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
      console.error('Error marking attendance:', error);
      res.status(500).json({ message: 'Failed to mark attendance' });
    }
  };
  
  // Mark attendance for multiple students in a group
  exports.markAttendanceGroup = async (req, res) => {
    try {
      const { attendanceRecords } = req.body;
  
      // Validate and process each attendance record
      const results = await Promise.all(
        attendanceRecords.map(async (record) => {
          const { studentId, date, status, classType } = record;
  
          // Check if the student with the provided ID exists
          const student = await Students.findById(studentId);
          if (!student) {
            return { success: false, message: `Student with ID ${studentId} not found` };
          }
  
          // Create a new attendance record
          const attendanceRecord = new Attendance({
            student: studentId,
            date,
            status,
            classType,
          });
  
          // Save the attendance record
          await attendanceRecord.save();
  
          return { success: true, message: `Attendance marked for student with ID ${studentId}` };
        })
      );
  
      res.status(201).json({ message: 'Attendance marked for multiple students', results });
    } catch (error) {
      console.error('Error marking group attendance:', error);
      res.status(500).json({ message: 'Failed to mark group attendance' });
    }
  };
  



  exports.getAttendanceByDate = async (req, res, next) => {
    console.log("HELLO")
    try {
      const dateParam = req.query.date; // Get the date from the query parameter
  
      // Convert the date parameter to a Date object
      const date = new Date(dateParam);
  
      // Query the database to retrieve attendance records for the specified date
      const attendanceList = await Attendance.find({ date });
  
      // Send the attendance list as a response
      res.status(200).json({ attendanceList });
    } catch (error) {
      console.error('Error fetching attendance by date:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  // Get attendance list based on class
exports.getAttendanceByClass = async (req, res) => {
    try {
      const { classType } = req.params;
  
      // Find attendance records for the specified class type
      const attendanceList = await Attendance.find({ classType });
  
      res.status(200).json({ attendanceList });
    } catch (error) {
      console.error('Error fetching attendance by class:', error);
      res.status(500).json({ message: 'Failed to fetch attendance by class' });
    }
  };

  
  // Get attendance list for a single student
exports.getAttendanceForStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      // Find attendance records for the specified student
      const attendanceList = await Attendance.find({ student: studentId });
  
      res.status(200).json({ attendanceList });
    } catch (error) {
      console.error('Error fetching attendance for student:', error);
      res.status(500).json({ message: 'Failed to fetch attendance for student' });
    }
  };
  

// get based on date and type 
  // exports.getAttendance = async (req, res, next) => {
  //   try {
  //     const dateParam = req.query.date;
  //     const classTypeParam = req.query.classType;
  //     const statusParam = req.query.status;
  //     // Check if the 'date' parameter is provided (mandatory)
  //     if (!dateParam) {
  //       return res.status(400).json({ message: 'Date is mandatory' });
  //     }
  
  //     // Convert the date parameter to a Date object
  //     const date = new Date(dateParam);
  
  //     // Define a query object for MongoDB based on both date and classType
  //     const query = { date };
  
  //     if (classTypeParam) {
  //       query.classType = classTypeParam;
  //     }
  
  //     if (statusParam) {
  //       query.status = statusParam;
  //     }
  //     // Query the database to retrieve attendance records based on date and optionally class type
  //     const attendanceList = await Attendance.find(query);
  
  //     // Send the attendance list as a response
  //     res.status(200).json({ attendanceList });
  //   } catch (error) {
  //     console.error('Error fetching attendance:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // };
  


  exports.getAttendance = async (req, res, next) => {
    try {
      const dateParam = req.query.date;
      const classTypeParam = req.query.classType;
      const statusParam = req.query.status;
  
      // Check if the 'date' parameter is provided (mandatory)
      if (!dateParam) {
        return res.status(400).json({ message: 'Date is mandatory' });
      }
  
      // Convert the date parameter to a Date object
      const date = new Date(dateParam);
  
      // Define a query object for MongoDB based on date, classType, and status
      const query = { date };
  
      if (classTypeParam) {
        query.classType = classTypeParam;
      }
  
      if (statusParam) {
        query.status = statusParam;
      }
  
      // Use the $lookup aggregation to join Attendance with Students
      const attendanceList = await Attendance.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'students', // Name of the Students collection
            localField: 'student',
            foreignField: '_id',
            as: 'studentDetails',
          },
        },
        {
          $unwind: '$studentDetails', // Unwind the array created by $lookup
        },
        {
          $project: {
            _id: 0, // Exclude the _id field if not needed
            date: 1,
            classType: 1,
            status: 1,
            first_name: '$studentDetails.first_name',
            last_name: '$studentDetails.last_name',
            email: '$studentDetails.email',
            class:'$studentDetails.class',
            father_name:'$studentDetails.father_name',
            roll_number:'$studentDetails.roll_number',
            class_alias:'$studentDetails.class_alias'
            // 'studentDetails.first_name': 1, // Include first_name in the result
            // 'studentDetails.last_name': 1, // Include last_name in the result
            // 'studentDetails.email': 1, // Include email in the result
          },
        },
      ]);
        console.log(attendanceList)
      // Send the attendance list with student details as a response
      res.status(200).json({ attendanceList });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Get attendance based on class and date (both are optional)
exports.getAttendanceByClassAndDate = async (req, res, next) => {
  try {
    const { class: className, date } = req.query;

    let query = {};

    // Check if the 'class' parameter is provided
    if (className) {
      query['student.class'] = className;
    }

    // Check if the 'date' parameter is provided
    if (date) {
      query['date'] = new Date(date);
    }

    // Find the attendance records that match the query
    const attendanceList = await Attendance.find(query)
      .populate({
        path: 'student',
        select: 'first_name last_name email class', // Add other fields you want to select
      })
      .exec();

    // Send the attendance list as a response
    res.status(200).json({ attendanceList });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.getStudentsAttendanceStatus = async (req, res) => {
  try {
    const { attendanceDate } = req.query;

    const studentsWithAttendanceStatus = await Students.aggregate([
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'student',
          as: 'attendance',
        },
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          father_name:1,
          email: 1,
          photoUrl:1,
          class: 1,
          roll_number:1,
          class_alias:1,
          morning_status: {
            $ifNull: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$attendance',
                          as: 'attend',
                          cond: {
                            $and: [
                              { $eq: ['$$attend.date', new Date(attendanceDate)] },
                              { $eq: ['$$attend.classType', 'morning'] },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                  null,
                ],
              },
              null,
            ],
          },
          evening_status: {
            $ifNull: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$attendance',
                          as: 'attend',
                          cond: {
                            $and: [
                              { $eq: ['$$attend.date', new Date(attendanceDate)] },
                              { $eq: ['$$attend.classType', 'evening'] },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                  null,
                ],
              },
              null,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          father_name:1,
          photoUrl:1,
          email: 1,
          roll_number:1,
          class: 1,
          class_alias:1,
          morning_status: { $ifNull: ['$morning_status.status', null] },
          evening_status: { $ifNull: ['$evening_status.status', null] },
        },
      },
      {
        $sort: {
          class: 1,
          roll_number: 1,
        },
      },
    ]);

    console.log(studentsWithAttendanceStatus);
    res.status(200).json(studentsWithAttendanceStatus);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudentsAttendanceReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const studentsWithAttendanceStatus = await Students.aggregate([
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'student',
          as: 'attendance',
        },
      },
      {
        $unwind: '$attendance',
      },
      {
        $match: {
          'attendance.date': {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
          },
        },
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            date: '$attendance.date',
          },
          first_name: { $first: '$first_name' },
          last_name: { $first: '$last_name' },
          father_name: { $first: '$father_name' },
          email: { $first: '$email' },
          // photoUrl: { $first: '$photoUrl' },
          class: { $first: '$class' },
          class_alias:{$first: '$class_alias' },
          roll_number: { $first: '$roll_number' },
          morning_status: {
            $max: {
              $cond: [
                { $eq: ['$attendance.classType', 'morning'] },
                '$attendance.status',
                null,
              ],
            },
          },
          evening_status: {
            $max: {
              $cond: [
                { $eq: ['$attendance.classType', 'evening'] },
                '$attendance.status',
                null,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: '$_id._id',
          first_name: 1,
          last_name: 1,
          father_name: 1,
          email: 1,
          // photoUrl: 1,
          class: 1,
          class_alias:1,
          roll_number: 1,
          morning_status: 1,
          evening_status: 1,
          date: '$_id.date',
        },
      },
      {
        $sort: {
          date: 1,
          class: 1,
          roll_number: 1,
        },
      },
    ]);

    console.log(studentsWithAttendanceStatus);
    res.status(200).json(studentsWithAttendanceStatus);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*

 mattendanceStatus: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$attendance',
                        as: 'attend',
                        cond: {
                          $and: [
                            {
                              $eq: [
                                { $dateToString: { format: '%Y-%m-%d', date: '$$attend.date' } },
                                attendanceDate,
                              ],
                            },
                            { $eq: [{ $strcasecmp: ['$$attend.status', 'present'] }, 0] },
                            { $eq: ['$attendance.classType', 'morning'] },

                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: 'Present',
              else: 'Absent',
            },
          },
          eattendanceStatus: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$attendance',
                        as: 'attend',
                        cond: {
                          $and: [
                            {
                              $eq: [
                                { $dateToString: { format: '%Y-%m-%d', date: '$$attend.date' } },
                                attendanceDate,
                              ],
                            },
                            { $eq: [{ $strcasecmp: ['$$attend.status', 'present'] }, 0] },
                            { $eq: ['$attendance.classType', 'evening'] },

                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: 'Present',
              else: 'Absent',
            },
          },

*/