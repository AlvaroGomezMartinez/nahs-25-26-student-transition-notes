/**
 * This function references the "W/D Other" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet and creates a map of student IDs to student data.
 *
 * @see loadWDOther.js
 * @returns {allWDOtherMap8} A map where the key is the Student ID the values are an object containing student data from the rows in Withdrawn.
 */
function getWDOtherSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("W/D Other");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var allWDOtherMap8 = new Map();

  for (var i = 1; i < data.length; i++) {
    var studentId = data[i][headers.indexOf("STUDENT ID")];

    // Skip rows where the studentId is empty or undefined
    if (!studentId) {
      continue;
    }

    var studentData = {};
    for (var j = 0; j < headers.length; j++) {
      studentData[headers[j]] = data[i][j];
    }

    if (allWDOtherMap8.has(studentId)) {
      allWDOtherMap8.get(studentId).push(studentData);
    } else {
      allWDOtherMap8.set(studentId, [studentData]);
    }
  }

  // Logger.log("W/D Other Data: " + JSON.stringify([...allWDOtherMap8]));
  return allWDOtherMap8;
}
