/**
 * getStudentsFromEntryWithdrawalSheet() references the "Entry_Withdrawal" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet.
 * 
 * @returns {Map} Map of the grade level, id, name, and entry date with the id as the key.
 */
function getStudentsFromEntryWithdrawalSheet() {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Entry_Withdrawal");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var studentNameCol = headers.indexOf("Student Name(Last, First)");
  var studentIdCol = headers.indexOf("Student Id");
  var studentGrCol = headers.indexOf("Grd Lvl");
  var firstDayCol = headers.indexOf("Entry Date");

  var allStudentsMap = new Map();

  // Loops through the data rows (starting at 1 to skip the header)
  for (var i = 1; i < data.length; i++) {
    var studentName = data[i][studentNameCol];
    var studentId = data[i][studentIdCol];
    var studentGr = data[i][studentGrCol];
    var studentEntryDate = Utilities.formatDate(
      data[i][firstDayCol],
      Session.getScriptTimeZone(),
      "M/d/yy",
    );

    // Splits the name at the comma and trims any spaces
    var nameParts = studentName.split(",").map(function (part) {
      return part.trim();
    });
    var lastName = nameParts[0];
    var firstName = nameParts[1];

    // Adds the student to the Map using Student ID as key
    allStudentsMap.set(studentId, [
      lastName,
      firstName,
      studentId,
      studentGr,
      studentEntryDate,
    ]);
  }

  Logger.log("Entry_Withdrawal Data: " + [...allStudentsMap]);

  return allStudentsMap;
}

/**
 * The function below references the "Form Responses 2" sheet of the "Registrations SY 24.25" spreadsheet.
 * 
 * @returns {Map} Map of the placement days, home campus, eligibility, educational factors, and behavior contract with the id as the key.
 */
function getDataFromFormResponses2() {
  var sheet = SpreadsheetApp.openById(
    "1kAWRpWO4xDtRShLB5YtTtWxTbVg800fuU2RvAlYhrfA",
  ).getSheetByName("Form Responses 2");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var studentIdCol = headers.indexOf("Student ID");
  var placementDaysCol = headers.indexOf("Placement Days");
  var homeCampusCol = headers.indexOf("Home Campus");
  var eligibilityCol = headers.indexOf("Eligibilty");
  var edFactorsCol = headers.indexOf("Educational Factors");
  var behaviorContractCol = headers.indexOf("Behavior Contract");

  var allStudentsMap = new Map();

  // Loops through the data rows (starting at 1 to skip the header)
  for (var i = 1; i < data.length; i++) {
    var studentId = data[i][studentIdCol];
    var placementDays = data[i][placementDaysCol];
    var hmCampus = data[i][homeCampusCol];
    var eligibility = data[i][eligibilityCol];
    var educationalFactors = data[i][edFactorsCol];
    var behaviorContract = data[i][behaviorContractCol];

    // Adds the student to the Map using the Student ID as key
    if (typeof studentId === "number") {
      allStudentsMap.set(studentId, [
        placementDays,
        hmCampus,
        eligibility,
        educationalFactors,
        behaviorContract,
      ]);
    }
  }

  // Log the map for all students
  Logger.log("Irma's Sheet's Data: " + [...allStudentsMap]);

  return allStudentsMap;
}

/**
 * The function below references the "Withdrawn" sheet of the "NAHS 24-25 Student Transition Notes".
 * 
 * @returns {Map} Map of the id with the id as the key.
 */
function getIdsFromWithdrawnSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Withdrawn");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var studentIdCol = headers.indexOf("STUDENT ID");

  var allStudentsMap = new Map();

  // Loop through the data rows (start at 1 to skip the header)
  for (var i = 1; i < data.length; i++) {
    var studentId = data[i][studentIdCol];
    if (studentId !== "") {
      // Add the id to the Map using STUDENT ID as the key
      allStudentsMap.set(studentId, studentId);
    }
  }

  // Log the map for all students
  Logger.log("IDs from Withdrawn: " + [...allStudentsMap]);

  return allStudentsMap;
}

/**
 * The function below references the "W/D Other" sheet of the "NAHS 24-25 Student Transition Notes".
 * 
 * @calls the getStudentsFromEntryWithdrawalSheet() function and then cross-references the last and first names from "W/D Other" with the names returned by getStudentsFromEntryWithdrawalSheet to fill in any missing ids from the list of names in "W/D Other".
 * 
 * @returns {Map} Map of the last name, first name, and student id with the id as the key.
 */
function getIdsFromWDOtherSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("W/D Other");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var studentIdCol = headers.indexOf("STUDENT ID");
  var lastNameCol = headers.indexOf("LAST");
  var firstNameCol = headers.indexOf("FIRST");

  var allStudentsMap = new Map();
  var studentDataMap = getStudentsFromEntryWithdrawalSheet();

  // Loop through the data rows in "W/D Other" (start at 1 to skip the header)
  for (var i = 1; i < data.length; i++) {
    var studentId = data[i][studentIdCol];
    var lastName = data[i][lastNameCol].toLowerCase();
    var firstName = data[i][firstNameCol].toLowerCase();

    if (studentId === "") {
      // Look up the lastname in the "Entry_Withdrawal" map and find the id
      var foundId = findStudentIdByFullName(
        lastName,
        firstName,
        studentDataMap,
      );
      if (foundId) {
        studentId = foundId; // Inserts the matching student ID from "Entry_Withdrawal" in the current row
        allStudentsMap.set(studentId, studentId);
      }
    } else {
      // Add the id that's allready in "W/D Other" to the Map using STUDENT ID as the key
      allStudentsMap.set(studentId, studentId);
    }
  }

  // Log the Map for all students
  Logger.log("IDs from W/D Other: " + [...allStudentsMap]);

  return allStudentsMap;
}

/**
 * @helper This function helps the getIdsFromWDOtherSheet() function by searching for a matching last name then if found it will look for a matching first name. It looks within the "Entry_Withdrawal" data Map.
 * 
 * @returns {string} The student ID if found, otherwise null.
 */
function findStudentIdByFullName(lastName, firstName, studentDataMap) {
  for (let [studentId, studentData] of studentDataMap) {
    // studentData[0] is the last name, studentData[1] is the first name in the second function's Map
    if (
      studentData[0].toLowerCase() === lastName &&
      studentData[1].toLowerCase() === firstName
    ) {
      return studentData[2]; // studentData[2] is the student ID
    }
  }
  return null; // Return null if no match is found. Consider using regex in the future to account for name typos in the "W/D Other" sheet.
}

function registrationsData2(){
  let dataFromEntryWithdrawal = getStudentsFromEntryWithdrawalSheet(); // A Map of the "Entry_Withdrawal" sheet's data
  let dataFromIrmasSheet = getDataFromFormResponses2(); // A Map of the data from Irma's sheet
  let dataFromWithdrawnSheet = getIdsFromWithdrawnSheet(); // A Map of the student ids in the "Withdrawn" sheet
  let dataFromWDOtherSheet = getIdsFromWDOtherSheet(); // A Map of the student ids in the "W/D Other" sheet

  let rawDate = new Date();
  let dateAddedToSpreadsheet =
    rawDate.toLocaleDateString("en-US", {
      weekday: "short", // Day of the week
      month: "short", // Month
      day: "numeric", // Day of the month
      year: "numeric", // Year
    }) +
    " " +
    rawDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  /**
   * @todo Add the logic to do the SQL-like JOINs on the data from the different sheets.
   */
}