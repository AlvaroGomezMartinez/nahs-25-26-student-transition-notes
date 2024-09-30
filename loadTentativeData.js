/**
 * This function references the "TENTATIVE" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet and creates a map of student IDs to student data.
 *
 * @returns {allStudentsMap1} A map where the key is the Student ID the values are an object containing student data from the rows in TENTATIVE.
 */
function getStudentsFromTENTATIVESheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "TENTATIVE2(TESTING)",
  );
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var allStudentsMap1 = new Map();

  for (var i = 1; i < data.length; i++) {
    var studentId = data[i][headers.indexOf("STUDENT ID")];

    var studentData = {};
    for (var j = 0; j < headers.length; j++) {
      studentData[headers[j]] = data[i][j];
    }

    allStudentsMap1.set(studentId, studentData);
  }

  // Logger.log("TENTATIVE Data: " + JSON.stringify([...allStudentsMap]));
  return allStudentsMap1;
}
