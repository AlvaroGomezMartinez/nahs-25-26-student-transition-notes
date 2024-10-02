/**
 * Creates a map of student attendance data using the data from the "Alt_HS_Attendance_Enrollment_Count" sheet
 * found in the NAHS Criteria Sheet.
 *
 * @see loadStudentAttendanceData.js
 * @return {Map<number, Object>} A map where the key is the student id and the value contains the student's name, days in attendance, and days in enrollment.
 */
function loadStudentAttendanceData() {
  const spreadsheetId = "1gaGyH312ad85wpyfH6dGbyNiS4NddqH6NvzTG6RPGPA"; // NAHS Criteria Sheet ID
  const sheetName = "Alt_HS_Attendance_Enrollment_Count";
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);

  const dataRange = sheet.getDataRange();
  const dataValues = dataRange.getValues();

  const studentAttendanceDataMap = new Map();

  const headers = dataValues[0];

  for (let i = 1; i < dataValues.length; i++) {
    const rowData = dataValues[i];
    let studentID = rowData[2];

    headers.forEach((header, index) => {
      rowData[header] = rowData[index];
    });

    if (studentID) {
      studentID = Number(studentID); // Ensure student ID is a number
      studentAttendanceDataMap.set(studentID, [rowData]);
    } else {
      Logger.log(
        `Alt_HS_Attendance_Enrollment_Count: Empty student ID at row ${i + 1}`,
      );
    }
  }

  return studentAttendanceDataMap;
}
