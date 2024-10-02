/**
 * This function references the "Schedules" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet and creates a map of student IDs to student data.
 *
 * @see loadSchedules.js
 * @returns {schedulesMap6} A map where the key is the Student ID the values are an object containing student data from the rows in Schedules.
 */
function schedulesSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Schedules");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var schedulesMap6 = new Map();

  for (var i = 1; i < data.length; i++) {
    var rowData = data[i];
    var studentId = rowData[headers.indexOf("Student Id")];

    // Create an object with key-value pairs for each row
    var studentData = {};
    headers.forEach((header, index) => {
      studentData[header] = rowData[index];
    });

    if (studentId) {
      if (schedulesMap6.has(studentId)) {
        schedulesMap6.get(studentId).push(studentData);
      } else {
        schedulesMap6.set(studentId, [studentData]);
      }
    } else {
      Logger.log(`Schedules: Empty student ID at row ${i + 1}`);
    }
  }

  return schedulesMap6;
}
