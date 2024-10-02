function loadTENTATIVE2_TESTING () {
  const TENTATIVE2_TESTING = getStudentsFromTENTATIVESheet();
  const Registrations_SY_24_25 = loadRegistrationsData();
  const ContactInfo = loadContactData();
  const Entry_Withdrawal = loadEntryWithdrawalData();
  const Schedules = schedulesSheet();
  const Form_Responses_1 = getStudentsFromFormResponses1Sheet();
  const Withdrawn = getWithdrawnStudentsSheet();
  const Attendance = loadStudentAttendanceData();

  // Load Entry_Withdrawal and filter it with Withdrawn
  let firstFilteredResults = filterOutMatchesFromMapA(
    Entry_Withdrawal,
    Withdrawn,
  );

  const updatedActiveStudentDataMap = new Map();
  // Iterate through TENTATIVE2_TESTING (Table B)
  TENTATIVE2_TESTING.forEach((entryDataArray, studentId) => {
    let withdrawnData = null;

    // Loop through firstFilteredResults (Table A) and find the studentId in the keys
    firstFilteredResults.forEach((entry) => {
      // Extract the key (studentId) and value (dataArray) from the entry
      const [key, dataArray] = Object.entries(entry)[0];

      // Check if the key matches the studentId
      if (Number(key) === studentId) {
        withdrawnData = dataArray; // Get the corresponding data for the student
      }
    });

    // Push the results to updatedActiveStudentDataMap
    updatedActiveStudentDataMap.set(studentId, {
      TENTATIVE: entryDataArray,
      // withdrawnData: withdrawnData, // If found, otherwise it remains null
    });
  });

  const updatedUpdatedActiveStudentDataMap = new Map();
  updatedActiveStudentDataMap.forEach((studentData, studentId) => {
    // Get Registrations_SY_24_25 data for the current student or null if not found
    const registrationData = Registrations_SY_24_25.get(studentId) || null;
    // Merge student data with registration data and store it in the updatedUpdatedActiveStudentDataMap map
    updatedUpdatedActiveStudentDataMap.set(studentId, {
      ...studentData,
      Registrations_SY_24_25: registrationData,
    });
  });

  const updatedUpdatedUpdatedActiveStudentDataMap = new Map();
  updatedUpdatedActiveStudentDataMap.forEach((studentData, studentId) => {
    // Get ContactInfo data for the current student or null if not found
    const contactInfo = ContactInfo.get(studentId) || null;
    // Merge the existing student data with contactInfo data
    updatedUpdatedUpdatedActiveStudentDataMap.set(studentId, {
      ...studentData,
      ContactInfo: contactInfo,
    });
  });

  /**
   * Filters the schedules data to only include elements where "Wdraw Date" is empty.
   *
   * @param {Array<Object>} schedules - The schedules data array.
   * @returns {Array<Object>} - Returns a filtered array with only elements where "Wdraw Date" is empty.
   */
  function filterSchedulesWithEmptyWdrawDate(schedules) {
    if (!schedules) return [];
    return schedules.filter((schedule) => schedule["Wdraw Date"] === "");
  }

  const updatedUpdatedUpdatedUpdatedActiveStudentDataMap = new Map();
  updatedUpdatedUpdatedActiveStudentDataMap.forEach(
    (studentData, studentId) => {
      // Get Schedules data for the current student or null if not found
      const schedules = Schedules.get(studentId) || null;

      // Filter schedules to only include elements with empty "Wdraw Date"
      const filteredSchedules = filterSchedulesWithEmptyWdrawDate(schedules);

      // Check if the filtered schedules array is not empty
      if (filteredSchedules.length > 0) {
        // Merge the existing student data with filtered schedules data
        updatedUpdatedUpdatedUpdatedActiveStudentDataMap.set(studentId, {
          ...studentData,
          Schedules: filteredSchedules,
        });
      } else {
        // If no schedules with empty "Wdraw Date", keep the existing student data without schedules
        updatedUpdatedUpdatedUpdatedActiveStudentDataMap.set(
          studentId,
          studentData,
        );
      }
    },
  );

  const updatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap = new Map();
  updatedUpdatedUpdatedUpdatedActiveStudentDataMap.forEach(
    (studentData, studentId) => {
      // Get Attendance data for the current student or null if not found
      const attendance = Attendance.get(studentId) || null;
      // Merge the existing student data with contactInfo data
      updatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap.set(studentId, {
        ...studentData,
        Alt_HS_Attendance_Enrollment_Count: attendance,
      });
    },
  );

  const updatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap = new Map();
  updatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap.forEach(
    (studentData, studentId) => {
      // Get Form_Responses_1 data for the current student or null if not found
      const form_responses1 = Form_Responses_1.get(studentId) || null;
      // Merge the existing student data with contactInfo data
      updatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap.set(
        studentId,
        {
          ...studentData,
          Form_Responses_1: form_responses1,
        },
      );
    },
  );




  // Push it to TENTATIVE2(TESTING)

  // writeToTENTATIVE2_TESTINGSheet(leftJoinResults);

  /* Push values from leftJoinResults to TENTATIVE2(TESTING). The entries in leftJoinResults are "[[Entries]]: Array (153)". Inside each array element is an object "{123456 => Array (13)}". The size of the array can vary depending on the result of the left join, however, this is how I need the data to be pushed to an array so that it can then be added to the sheet called "TENTATIVE2(TESTING)":
  let dataArray = [
    "DATE ADDED TO SPREADSHEET", // This will be the date the row is added to the spreadsheet
    "LAST", // 
    "FIRST",
    "STUDENT ID",
    "GRADE",
    "1st Period - Course Title",
    "1st Period - Teacher Name",
    "1st Period - Transfer Grade",
    "1st Period - Current Grade",
    "1st Period - How would you assess this student's academic growth?",
    "1st Period - Academic and Behavioral Progress Notes",
    "2nd Period - Course Title",
    "2nd Period - Teacher Name",
    "2nd Period - Transfer Grade",
    "2nd Period - Current Grade",
    "2nd Period - How would you assess this student's academic progress?",
    "2nd Period - Academic and Behavioral Progress Notes",
    "3rd Period - Course Title",
    "3rd Period - Teacher Name",
    "3rd Period - Transfer Grade",
    "3rd Period - Current Grade",
    "3rd Period - How would you assess this student's academic progress?",
    "3rd Period - Academic and Behavioral Progress Notes",
    "4th Period - Course Title",
    "4th Period - Teacher Name",
    "4th Period - Transfer Grade",
    "4th Period - Current Grade",
    "4th Period - How would you assess this student's academic progress?",
    "4th Period - Academic and Behavioral Progress Notes",
    "5th Period - Course Title",
    "5th Period - Teacher Name",
    "5th Period - Transfer Grade",
    "5th Period - Current Grade",
    "5th Period - How would you assess this student's academic progress?",
    "5th Period - Academic and Behavioral Progress Notes",
    "6th Period - Course Title",
    "6th Period - Teacher Name",
    "6th Period - Transfer Grade",
    "6th Period - Current Grade",
    "6th Period - How would you assess this student's academic progress?",
    "6th Period - Academic and Behavioral Progress Notes",
    "7th Period - Course Title",
    "7th Period - Teacher Name",
    "7th Period - Transfer Grade",
    "7th Period - Current Grade",
    "7th Period - How would you assess this student's progress?",
    "7th Period - Academic and Behavioral Progress Notes",
    "8th Period - Course Title",
    "8th Period - Teacher Name",
    "8th Period - Transfer Grade",
    "8th Period - Current Grade",
    "8th Period - How would you assess this student's progress?",
    "8th Period - Academic and Behavioral Progress Notes",
    "SE - Special Education Case Manager",
    "SE - What accommodations seem to work well with this student to help them be successful?",
    "SE - What are the student's strengths, as far as behavior?",
    "SE - What are the student's needs, as far as behavior?  (Pick behavior having most effect on his/her ability to be successful in class.  If there are no concerns, note that.)",
    "SE - What are the student's needs, as far as functional skills?  (Include daily living skills, fine/gross motor skills, organizational skills, self-advocacy, attendance, etc.)",
    "SE - Please add any other comments or concerns here:",
    "REGULAR CAMPUS",
    "FIRST DAY OF AEP",
    "Anticipated Release Date",
    "Parent Notice Date",
    "Withdrawn Date",
  ];
  */
}
