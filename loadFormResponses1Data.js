/**
 * This function references the "Form Responses 1" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet and creates a map of student IDs to student data.
 *
 * @see loadFormResponses1Data.js
 * @returns {Map} A map where the key is the Student ID the values are an object containing student data from the rows in "Form Responses 1".
 */
function getStudentsFromFormResponses1Sheet() {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var allResponsesMap4 = new Map();

  // The "Student" column that I need is the second occurrence of "Student" in the headers
  var studentColumnIndex = headers.lastIndexOf("Student");
  var emailColumnIndex = headers.indexOf("Email Address");

  // Object mapping email addresses to proper names
  const emails = {
    "alvaro.gomez@nisd.net": { "proper name": "Gomez, Alvaro" },
    "marco.ayala@nisd.net": { "proper name": "Ayala, Marco" },
    "alita.barrera@nisd.net": { "proper name": "Barrera, Alita" },
    "gabriela.chavarria-medina@nisd.net": { "proper name": "Chavarria-Medina, Gabriela" },
    "leticia.collier@nisd.net": { "proper name": "Collier, Leticia" },
    "staci.cunningham@nisd.net": { "proper name": "Cunningham, Staci" },
    "samantha.daywood@nisd.net": { "proper name": "Daywood, Samantha" },
    "richard.delarosa@nisd.net": { "proper name": "De La Rosa, Richard" },
    "ramon.duran@nisd.net": { "proper name": "Duran, Ramon" },
    "janice.flores@nisd.net": { "proper name": "Flores, Janice" },
    "lauren.flores@nisd.net": { "proper name": "Flores, Lauren" },
    "roslyn.francis@nisd.net": { "proper name": "Francis, Roslyn" },
    "daniel.galdeano@nisd.net": { "proper name": "Galdeano, Daniel" },
    "nancy-1.garcia@nisd.net": { "proper name": "Garcia, Nancy" },
    "cierra.gibson@nisd.net": { "proper name": "Gibson, Cierra" },
    "lauren.gonzaba@nisd.net": { "proper name": "Gonzaba, Lauren" },
    "teressa.hensley@nisd.net": { "proper name": "Hensley, Teressa" },
    "catherine.huff@nisd.net": { "proper name": "Huff, Catherine" },
    "erin.knippa@nisd.net": { "proper name": "Knippa, Erin" },
    "joshua.lacour@nisd.net": { "proper name": "Lacour, Joshua" },
    "tequila.lewis-dupree@nisd.net": { "proper name": "Lewis-Dupree, Tequila" },
    "thalia.mendez@nisd.net": { "proper name": "Mendez, Thalia" },
    "alexandria.murphy@nisd.net": { "proper name": "Murphy, Alexandria" },
    "dennis.olivares@nisd.net": { "proper name": "Olivares, Dennis" },
    "loretta.owens@nisd.net": { "proper name": "Owens, Loretta" },
    "denisse.perez@nisd.net": { "proper name": "Perez, Denisse" },
    "jessica.poladelcastillo@nisd.net": { "proper name": "Pola Del Castillo, Jessica" },
    "darrell.rice@nisd.net": { "proper name": "Rice, Darrell" },
    "angela.rodriguez@nisd.net": { "proper name": "Rodriguez, Angela" },
    "linda.rodriguez@nisd.net": { "proper name": "Rodriguez, Linda" },
    "jessica-1.vela@nisd.net": { "proper name": "Vela, Jessica" },
    "miranda.wenzlaff@nisd.net": { "proper name": "Wenzlaff, Miranda" },
  };

  var schedulesMap = schedulesSheet();

  for (var i = 1; i < data.length; i++) {
    var student = data[i][studentColumnIndex];
    var email = data[i][emailColumnIndex];
    var match = student.match(/\((\d{6})\)/);
    var studentId = match ? Number(match[1]) : null; // Convert matched student ID to number

    if (studentId !== null) {
      // Check if studentId is valid
      var studentData = {};
      for (var j = 0; j < headers.length; j++) {
        studentData[headers[j]] = data[i][j];
      }

      // Match the email to the proper name and add it to the student data
      if (emails[email]) {
        studentData["Teacher"] = emails[email]["proper name"];
      } else {
        studentData["Teacher"] = "Unknown"; // Default value if email not found
      }

      // Perform a left join with the schedules data
      var scheduleDataArray = schedulesMap.get(studentId) || [];
      var matchingScheduleData = scheduleDataArray.find(
        (schedule) => schedule["Teacher Name"] === studentData["Teacher"],
      );

      if (matchingScheduleData) {
        studentData = { ...studentData, ...matchingScheduleData };
      }

      if (allResponsesMap4.has(studentId)) {
        allResponsesMap4.get(studentId).push(studentData);
      } else {
        allResponsesMap4.set(studentId, [studentData]);
      }
    } else {
      Logger.log(`Form Responses 1: Invalid student ID at row ${i + 1}`);
    }
  }

  // Logger.log("Responses Data: " + JSON.stringify([...allResponsesMap4]));
  return allResponsesMap4;
}