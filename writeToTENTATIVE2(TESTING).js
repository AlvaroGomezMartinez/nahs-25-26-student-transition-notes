/**
 * Writes the data from leftJoinResults to the "TENTATIVE2(TESTING)" sheet.
 */
function writeToTENTATIVE2_TESTINGSheet(leftJoinResults) {
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
  if (!leftJoinResults) {
    console.error("leftJoinResults is undefined.");
    return; // Exit the function if it's undefined
  }

  if (typeof leftJoinResults !== "object" || !("forEach" in leftJoinResults)) {
    console.error("leftJoinResults is not iterable:", leftJoinResults);
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
   * @todo Update the function to reference the correct value references from the leftJoinResults object.
   * @param {*} studentData 
   * @returns 
   */
//   function calculateExpectedWithdrawDate(studentData) {
//     const formattedEntryDate = studentData.entryData
//       ? studentData.entryData[0]["Entry Date"]
//       : null;
//     const placementDays = studentData.registration
//       ? studentData.registration[0]["Placement Days"]
//       : null;
//     const daysInEnrl = studentData.attendance
//       ? studentData.attendance[0][5]
//       : null; // Days in Enrl
//     const daysInAtt = studentData.attendance
//       ? studentData.attendance[0][4]
//       : null; // Days in Att

//     // Validate dates
//     if (!formattedEntryDate || isNaN(new Date(formattedEntryDate).getTime())) {
//       console.error("Invalid formatted entry date:", formattedEntryDate);
//       return null; // Return null if the entry date is invalid
//     }

//     if (!placementDays || !daysInEnrl || !daysInAtt) {
//       return null; // Return null if any required data is missing
//     }

//     // Convert formattedEntryDate to the expected format
//     const entryDateString = formatDateToMMDDYYYY(formattedEntryDate);

//     const additionalDays = [daysInAtt, daysInEnrl];
//     // Call the updated function with individual values
//     return NAHS_EXPECTED_WITHDRAW_DATE(
//       entryDateString,
//       placementDays,
//       holidayDates,
//       additionalDays,
//     );
//   }

  leftJoinResults.forEach(
    (studentData, studentId) => {
      const entryData = studentData[3] ? studentData[3] : null;

      // Ensure entryData is defined
      if (!entryData) {
        console.error("Entry data is missing for Student ID:", studentId);
        return; // Skip this student if entry data is not available
      }

      const formattedEntryDate = entryData["Entry Date"];
      const gradeString = entryData["Grd Lvl"];
      const formattedGrade = gradeString
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

      // Extract the needed data fields in the specified order
      outputData.push([
        entryData["Student Name"], // Name
        studentData.registration
          ? studentData.registration[0]["Home Campus"]
          : null, // Home Campus
        formattedGrade, // Grade
        studentId, // Student ID
        studentData.registration
          ? studentData.registration[0]["Placement Offense"]
          : null, // Offense
        formattedEntryDate, // Start Date
        studentData.registration
          ? studentData.registration[0]["Placement Days"]
          : null, // Placement Days
        studentData.attendance ? studentData.attendance[0][4] : null, // Days in Att
        studentData.attendance ? studentData.attendance[0][5] : null, // Days in Enrl
        estimatedDaysLeft, // Estimated Days Left
        studentData.withdrawnData
          ? studentData.withdrawnData[0]["Review Date"]
          : null, // Review Date
        estimatedExitDay || null, // Estimated Exit Day
        studentData.entryData ? studentData.entryData[0]["recidivist"] : null, // Recidivist
        studentData.registration
          ? studentData.registration[0]["Eligibilty"]
          : null, // Eligibility
        studentData.registration
          ? studentData.registration[0]["Educational Factors"]
          : null, // Educational Factors
        studentData.registration
          ? studentData.registration[0]["Behavior Contract"]
          : null, // Behavior Contract
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
