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
    var studentId = data[i][headers.indexOf("Student Id")];

    var studentData = {};
    for (var j = 0; j < headers.length; j++) {
      studentData[headers[j]] = data[i][j];
    }

    if (schedulesMap6.has(studentId)) {
      schedulesMap6.get(studentId).push(studentData);
    } else {
      schedulesMap6.set(studentId, [studentData]);
    }
  }

  // Logger.log("Withdrawn Data: " + JSON.stringify([...schedulesMap6]));
  return schedulesMap6;
}
