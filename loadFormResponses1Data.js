/**
 * This function references the "Form Responses 1" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet and creates a map of student IDs to student data.
 *
 * @returns {Map} A map where the key is the Student ID the values are an object containing student data from the rows in "Form Responses 1".
 */
function getStudentsFromFormResponses1Sheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var allResponsesMap4 = new Map();

  // The "Student" column that I need is the second occurrence of "Student" in the headers
  var studentColumnIndex = headers.lastIndexOf("Student");

  for (var i = 1; i < data.length; i++) {
    var student = data[i][studentColumnIndex];
    var match = student.match(/\((\d{6})\)/);
    var studentId = match ? match[1] : null;

    var studentData = {};
    for (var j = 0; j < headers.length; j++) {
      studentData[headers[j]] = data[i][j];
    }

    if (allResponsesMap4.has(studentId)) {
        allResponsesMap4.get(studentId).push(studentData);
    } else {
        allResponsesMap4.set(studentId, [studentData]);
    }
    }

  // Logger.log("TENTATIVE Data: " + JSON.stringify([...allStudentsMap]));
  return allResponsesMap4;
}
