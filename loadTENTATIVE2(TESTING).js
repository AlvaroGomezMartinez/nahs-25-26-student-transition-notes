/**
 * Main function that is used to build and write the roster to the TENTATIVE2(TESTING) sheet.
 * It builds the roster by loading and processing student data from eight separate Google sheets.
 * The function filters and merges the separate maps.
 */
function loadTENTATIVE2_TESTING() {
  const TENTATIVE2_TESTING = getStudentsFromTENTATIVESheet();
  const Registrations_SY_24_25 = loadRegistrationsData();
  const ContactInfo = loadContactData();
  const Entry_Withdrawal = loadEntryWithdrawalData();
  const Schedules = schedulesSheet();
  const Form_Responses_1 = getStudentsFromFormResponses1Sheet();
  const Withdrawn = getWithdrawnStudentsSheet();
  const Attendance = loadStudentAttendanceData();

  // Load Entry_Withdrawal and filter out any students in the Withdrawn sheet
  let firstFilteredResults = filterOutMatchesFromMapA(
    Entry_Withdrawal,
    Withdrawn,
  );

  /**
   * TODO: Check if this function is needed. It seems to be doing the same thing as the
   * filterOutMatchesFromMapA function which is called by firstFilteredResults above.
   *
   */
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
   * This is a helper function, called by const filteredSchedules.
   * Its purpose is to filter a student's course lists (schedules) so that only the active courses
   * are returned. It returns elements from schedules where "Wdraw Date" is empty.
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

      // Filter courses to only include elements with empty "Wdraw Date"
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

  /**
   * TODO: Find a way to handle multiple Form_Responses_1 entries for the same student when they re-enroll.
   */
  const updatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap =
    new Map();
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

  const updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap =
    new Map();
  updatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap.forEach(
    (studentData, studentId) => {
      // Get Entry_Withdrawal data for the current student or null if not found
      const entry_withdrawal = Entry_Withdrawal.get(studentId) || null;
      // Merge the existing student data with contactInfo data
      updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap.set(
        studentId,
        {
          ...studentData,
          Entry_Withdrawal: entry_withdrawal,
        },
      );
    },
  );

  writeToTENTATIVE2_TESTINGSheet(
    updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap,
  );
}
