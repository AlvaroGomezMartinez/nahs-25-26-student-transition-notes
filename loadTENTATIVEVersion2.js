/**
 * This is the main function that is used to build and write the roster to the TENTATIVE-Version2 sheet.
 * It builds the roster by loading and processing student data from eight separate Google sheets.
 * The function filters and merges the separate maps.
 * The function has five triggers set to run each weekday between 1:00 - 2:00 AM.
 */
function loadTENTATIVEVersion2() {
  
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TENTATIVE-Version2");
    var dataRange = sheet.getDataRange();
    var data = dataRange.getValues();
    var backgrounds = dataRange.getBackgrounds();

    // Store student IDs and their row colors
    var studentColors = {};
    for (var i = 0; i < data.length; i++) {
      var studentId = data[i][3];
      if (studentId) {  // Check if student ID exists
        studentColors[studentId] = backgrounds[i];
      }
    }

    const TentativeVer2 = getStudentsFromTENTATIVESheet();
    const Registrations_SY_24_25 = loadRegistrationsData();
    const ContactInfo = loadContactData();
    const Entry_Withdrawal = loadEntryWithdrawalData();
    const Schedules = schedulesSheet();
    const Form_Responses_1 = getStudentsFromFormResponses1Sheet();
    const Withdrawn = getWithdrawnStudentsSheet();
    const Attendance = loadStudentAttendanceData();
    const WDOther = getWDOtherSheet();
    // const holidayDates = NISDHolidayLibrary.getHolidayDates();

    // Load Entry_Withdrawal and filter out any students in the Withdrawn sheet
    let firstFilteredResults = filterOutMatchesFromMapA(
      Entry_Withdrawal,
      Withdrawn,
    );

    let secondFilteredResults = filterOutMatchesFromMapA(
      firstFilteredResults,
      WDOther,
    );

    /**
     * TODO: Check if this function is needed. It seems to be doing the same thing as the
     * filterOutMatchesFromMapA function which is called by firstFilteredResults above.
     *
     */
    const updatedActiveStudentDataMap = new Map();

    // Iterate through firstFilteredResults (Table A) to add all students
    secondFilteredResults.forEach((entry) => {
      // Extract the studentId and dataArray from the entry
      const studentId = entry[0]["Student Id"];
      const dataArray = entry;

      // Add the student to the map with the data from firstFilteredResults
      updatedActiveStudentDataMap.set(studentId, {
        FirstFilteredData: dataArray,
      });
    });

    // Iterate through TENTATIVE2_TESTING (Table B)
    TentativeVer2.forEach((entryDataArray, studentId) => {
      let withdrawnData = null;

      // Loop through firstFilteredResults (Table A) and find the studentId in the keys
      secondFilteredResults.forEach((entry) => {
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

    writeToTENTATIVEVersion2Sheet(
      updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap,
    );

    // Reapply the colors to the correct rows by matching student IDs
    var newDataRange = sheet.getDataRange();
    var newData = newDataRange.getValues();
    for (var j = 0; j < newData.length; j++) {
      var newStudentId = newData[j][3]; // Assuming student ID is in column D (index 3)
      if (newStudentId && studentColors[newStudentId]) {
        var range = sheet.getRange(j + 1, 1, 1, newData[0].length);
        range.setBackgrounds([studentColors[newStudentId]]);
      }
    }

    ensureCheckboxesInColumnBX();

}

function ensureCheckboxesInColumnBX() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TENTATIVE-Version2");
  var lastRow = sheet.getLastRow();
  var bxRange = sheet.getRange(1, 76, lastRow); // Column BX is the 76th column

  // Get current validations for the entire range in one call
  var validations = bxRange.getDataValidations();
  var needsValidation = false;

  // Check if any cell lacks a checkbox validation
  for (var i = 0; i < validations.length; i++) {
    if (!validations[i][0] || validations[i][0].getCriteriaType() !== SpreadsheetApp.DataValidationCriteria.CHECKBOX) {
      needsValidation = true;
      break;
    }
  }

  // Apply checkbox validation to the whole range if needed
  if (needsValidation) {
    var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    bxRange.setDataValidation(checkboxRule); // Set checkbox validation in a single call
  }
}


