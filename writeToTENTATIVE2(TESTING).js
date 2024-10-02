/**
 * Writes the data from updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap to the "TENTATIVE2(TESTING)" sheet.
 */
function writeToTENTATIVE2_TESTINGSheet(updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap) {
  const activeSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TENTATIVE2(TESTING)");

  // Clear existing data from Row 2 downwards
  const lastRow = activeSheet.getLastRow();
  if (lastRow > 1) {
    activeSheet
      .getRange(2, 1, lastRow - 1, activeSheet.getLastColumn())
      .clear();
  }

  // Check if the input is defined and log its content
  if (!updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap) {
    console.error("updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap is undefined.");
    return; // Exit the function if it's undefined
  }

  if (typeof updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap !== "object" || !("forEach" in updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap)) {
    console.error("leftJoinResults is not iterable:", updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap);
    return; // Exit the function if it's not iterable
  }

  // Prepare the data in the desired order
  const outputData = [];

  function formatDateToMMDDYYYY(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Check for invalid date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`; // Format: YYYY-MM-DD
  }

  /**
   * Calculates the expected withdraw date for the student.
   * @todo Update the function to reference the correct value references from the updatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap object.
   * @param {*} studentData 
   * @returns 
   */
  function calculateExpectedWithdrawDate(studentData) {
    const formattedEntryDate = studentData["Entry_Withdrawal"]
      ? studentData["Entry_Withdrawal"][0]["Entry Date"]
      : null;
    const placementDays = studentData["Registrations_SY_24_25"]
      ? studentData["Registrations_SY_24_25"][0]["Placement Days"]
      : null;
    const daysInEnrl = studentData["Alt_HS_Attendance_Enrollment_Count"]
      ? studentData["Alt_HS_Attendance_Enrollment_Count"][0][5]
      : null; // Days in Enrl
    const daysInAtt = studentData["Alt_HS_Attendance_Enrollment_Count"]
      ? studentData["Alt_HS_Attendance_Enrollment_Count"][0][4]
      : null; // Days in Att

    // Validate dates
    if (!formattedEntryDate || isNaN(new Date(formattedEntryDate).getTime())) {
      console.error("Invalid formatted entry date:", formattedEntryDate);
      return null; // Return null if the entry date is invalid
    }

    if (!placementDays || !daysInEnrl || !daysInAtt) {
      return null; // Return null if any required data is missing
    }

    // Convert formattedEntryDate to the expected format
    const entryDateString = formatDateToMMDDYYYY(formattedEntryDate);

    const additionalDays = [daysInAtt, daysInEnrl];
    // Call the updated function with individual values
    return NAHS_EXPECTED_WITHDRAW_DATE(
      entryDateString,
      placementDays,
      holidayDates,
      additionalDays,
    );
  }

  updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap.forEach(
    (studentData, studentId) => {
      // Access the Entry_Withdrawal array
      const entryWithdrawalArray = studentData["Entry_Withdrawal"];
      // Access the TENTATIVE array
      const tentativeArray = studentData["TENTATIVE"];
      // Access the Registrations_SY_24_25 array
      const registrationArray = studentData["Registrations_SY_24_25"];
      // Access the ContactInfo array
      const contactInfoArray = studentData["ContactInfo"];
      // Access the Schedules array
      const schedulesArray = studentData["Schedules"];
      // Access the Attendance & Enrollment array
      const attendanceArray = studentData["Alt_HS_Attendance_Enrollment_Count"];
      // Access the Form_Responses_1 array
      const formResponses1Array = studentData["Form_Responses_1"];

      // Ensure the Entry_Withdrawal array is defined and has at least one element
      if (
        !studentData["Entry_Withdrawal"] ||
        studentData["Entry_Withdrawal"][0].length === 0
      ) {
        console.error(
          "Entry_Withdrawal data is missing for Student ID:",
          studentId,
        );
        return; // Skip this student if Entry_Withdrawal data is not available
      }

      // Access the first element of the Entry_Withdrawal array
      const entryData = studentData["Entry_Withdrawal"][0];

      // Ensure entryData is defined
      if (!entryData) {
        console.error("Entry data is missing for Student ID:", studentId);
        return; // Skip this student if entry data is not available
      }

      // Continue with the rest of your logic
      const formattedEntryDate = entryData["Entry Date"];
      const gradeString = entryData["Grd Lvl"];
      const formattedGrade =
        typeof gradeString === "string" && gradeString
          ? gradeString.split("-")[0].trim().replace(/^0+/, "")
          : null;

      // Validate the entry date
      const entryDateString = new Date(formattedEntryDate);
      if (isNaN(entryDateString)) {
        console.error(
          "Invalid entry date for Student ID:",
          studentId,
          "Date:",
          formattedEntryDate,
        );
        return; // Skip this entry if the date is invalid
      }

      // Calculate Expected Withdraw Date
      const estimatedExitDay = calculateExpectedWithdrawDate(studentData); // Call the function to get the expected withdraw date

      // Calculate Estimated Days Left
      const placementDays = studentData.registration
        ? studentData.registration[0]["Placement Days"]
        : null;
      const daysInAttendance = studentData.attendance
        ? studentData.attendance[0][4]
        : null;
      const estimatedDaysLeft =
        placementDays !== null && daysInAttendance !== null
          ? placementDays - daysInAttendance
          : null;

      const fullName =
        studentData["Entry_Withdrawal"][0]["Student Name(Last, First)"];
      const [lastName, firstName] = fullName
        .split(",")
        .map((name) => name.trim());

      /**
       * Checks if the string or number contains the word "504".
       *
       * @param {string|number|null} value - The value to check.
       * @returns {string} - "Yes" if the value contains "504", otherwise "No".
       */
      function contains504(value) {
        const str =
          value !== null && value !== undefined ? value.toString() : "";
        return str.includes("504") ? "Yes" : "No";
      }

      /**
       * Checks if the string or number contains the word "ESL".
       *
       * @param {string|number|null} value - The value to check.
       * @returns {string} - "Yes" if the value contains "ESL", otherwise "No".
       */
      function containsESL(value) {
        const str =
          value !== null && value !== undefined ? value.toString() : "";
        return str.includes("ESL") ? "Yes" : "No";
      }

      const educationalFactors =
        studentData.Registrations_SY_24_25 &&
        studentData.Registrations_SY_24_25[0] &&
        studentData.Registrations_SY_24_25[0]["Educational Factors"] !==
          undefined
          ? studentData.Registrations_SY_24_25[0]["Educational Factors"]
          : null;

      const contains504Result = contains504(educationalFactors);
      const containsESLResult = containsESL(educationalFactors);

      const contactInfo =
        studentData.TENTATIVE &&
        studentData.ContactInfo &&
        Array.isArray(studentData.ContactInfo) &&
        studentData.ContactInfo.length > 0
          ? studentData.ContactInfo[0]
          : null;

      const mergedDocId = contactInfo
        ? contactInfo[0]["Merged Doc ID - Transition Letter"]
        : null;
      const mergedDocUrl = contactInfo
        ? contactInfo[0]["Merged Doc URL - Transition Letter"]
        : null;
      const linkToMergedDoc = contactInfo
        ? contactInfo[0]["Link to merged Doc - Transition Letter"]
        : null;
      const documentMergeStatus = contactInfo
        ? contactInfo[0]["Document Merge Status - Transition Letter"]
        : null;

      // Extract the needed data fields in the specified order
      outputData.push([
        studentData.TENTATIVE
          ? studentData["TENTATIVE"][0]["DATE ADDED TO SPREADSHEET"]
          : null, // @TODO ADD A FUNCTION TO CHECK IF THIS VALUE IS BLANK, IF IT IS THEN ADD THE CURRENT DATE & TIME IF IT ISN'T BLANK THEN BRING IN THE DATA
        lastName, // "LAST"
        firstName, // "FIRST"
        studentData["Entry_Withdrawal"]
          ? studentData["Entry_Withdrawal"][0]["Student Id"]
          : null, // "STUDENT ID",
        studentData["Entry_Withdrawal"]
          ? studentData["Entry_Withdrawal"][0]["Grd Lvl"]
          : null, // "GRADE",

        // "1st Period - Course Title",
        // "1st Period - Teacher Name",
        // "1st Period - Transfer Grade",
        // "1st Period - Current Grade",
        // "1st Period - How would you assess this student's academic growth?",
        // "1st Period - Academic and Behavioral Progress Notes",

        // "2nd Period - Course Title",
        // "2nd Period - Teacher Name",
        // "2nd Period - Transfer Grade",
        // "2nd Period - Current Grade",
        // "2nd Period - How would you assess this student's academic progress?",
        // "2nd Period - Academic and Behavioral Progress Notes",

        // "3rd Period - Course Title",
        // "3rd Period - Teacher Name",
        // "3rd Period - Transfer Grade",
        // "3rd Period - Current Grade",
        // "3rd Period - How would you assess this student's academic progress?",
        // "3rd Period - Academic and Behavioral Progress Notes",

        // "4th Period - Course Title",
        // "4th Period - Teacher Name",
        // "4th Period - Transfer Grade",
        // "4th Period - Current Grade",
        // "4th Period - How would you assess this student's academic progress?",
        // "4th Period - Academic and Behavioral Progress Notes",

        // "5th Period - Course Title",
        // "5th Period - Teacher Name",
        // "5th Period - Transfer Grade",
        // "5th Period - Current Grade",
        // "5th Period - How would you assess this student's academic progress?",
        // "5th Period - Academic and Behavioral Progress Notes",

        // "6th Period - Course Title",
        // "6th Period - Teacher Name",
        // "6th Period - Transfer Grade",
        // "6th Period - Current Grade",
        // "6th Period - How would you assess this student's academic progress?",
        // "6th Period - Academic and Behavioral Progress Notes",

        // "7th Period - Course Title",
        // "7th Period - Teacher Name",
        // "7th Period - Transfer Grade",
        // "7th Period - Current Grade",
        // "7th Period - How would you assess this student's progress?",
        // "7th Period - Academic and Behavioral Progress Notes",

        // "8th Period - Course Title",
        // "8th Period - Teacher Name",
        // "8th Period - Transfer Grade",
        // "8th Period - Current Grade",
        // "8th Period - How would you assess this student's progress?",
        // "8th Period - Academic and Behavioral Progress Notes",

        // "SE - Special Education Case Manager",
        // "SE - What accommodations seem to work well with this student to help them be successful?",
        // "SE - What are the student's strengths, as far as behavior?",
        // "SE - What are the student's needs, as far as behavior?  (Pick behavior having most effect on his/her ability to be successful in class.  If there are no concerns, note that.)",
        // "SE - What are the student's needs, as far as functional skills?  (Include daily living skills, fine/gross motor skills, organizational skills, self-advocacy, attendance, etc.)",
        // "SE - Please add any other comments or concerns here:",

        studentData.Registrations_SY_24_25
          ? studentData.Registrations_SY_24_25[0]["Home Campus"]
          : null, // "REGULAR CAMPUS",
        formattedEntryDate, // "FIRST DAY OF AEP",
        estimatedExitDay || null, // "Anticipated Release Date",
        "", // "Parent Notice Date",
        "", // "Withdrawn Date",
        "", // "Attendance Recovery",
        studentData.Registrations_SY_24_25
          ? studentData.Registrations_SY_24_25[0]["Eligibilty"]
          : null, // "COMPASS",
        "", // "Credit Retrieval",
        studentData.Registrations_SY_24_25
          ? studentData.Registrations_SY_24_25[0]["Behavior Contract"]
          : null, // "Behavior Contract",
        "", // "Campus Mentor",
        "", // "Other Intervention 1",
        "", // "Other Intervention 2",
        contains504Result, // "504",
        containsESLResult, // "ESL",
        "", // "Additional notes or counseling services and Support",
        "", // "Licensed social worker consultation",
        "", // "Check if you're ready to create Transition Letter with Autocrat",
        studentData.ContactInfo
          ? studentData.ContactInfo[0]["Student Email"]
          : null, // "Student Email",
        studentData.ContactInfo
          ? studentData.ContactInfo[0]["Parent Name"]
          : null, // "Guardian Name",
        studentData.ContactInfo
          ? studentData.ContactInfo[0]["Guardian 1 Email"]
          : null, // "Guardian Email",
        mergedDocId, // "Merged Doc ID - Transition Letter"
        mergedDocUrl, // "Merged Doc URL - Transition Letter"
        linkToMergedDoc, // "Link to merged Doc - Transition Letter"
        documentMergeStatus, // "Document Merge Status - Transition Letter"
      ]);
    },
  );

  // Write the prepared data to the "Active" sheet starting from Row 2
  if (outputData.length > 0) {
    activeSheet
      .getRange(2, 1, outputData.length, outputData[0].length)
      .setValues(outputData);
  }
}
