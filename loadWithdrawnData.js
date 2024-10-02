/**
 * This function references the "Withdrawn" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet and creates a map of student IDs to student data.
 * 
 * @see loadTENTATIVE2(TESTING).js
 * @returns {allWithdrawnStudentsMap5} A map where the key is the Student ID the values are an object containing student data from the rows in Withdrawn.
 */
function getWithdrawnStudentsSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Withdrawn",
  );
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var allWithdrawnStudentsMap5 = new Map();

  for (var i = 1; i < data.length; i++) {
    var studentId = data[i][headers.indexOf("STUDENT ID")];

    var studentData = {};
    for (var j = 0; j < headers.length; j++) {
      studentData[headers[j]] = data[i][j];
    }

    if (allWithdrawnStudentsMap5.has(studentId)) {
      allWithdrawnStudentsMap5.get(studentId).push(studentData);
    } else {
      allWithdrawnStudentsMap5.set(studentId, [studentData]);
    }
  }

  // Logger.log("Withdrawn Data: " + JSON.stringify([...allWithdrawnStudentsMap5]));
  return allWithdrawnStudentsMap5;
}
