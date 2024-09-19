/**
 * getStudentsFromTENTATIVESheet() references the "TENTATIVE" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet.
 * 
 * @returns {Map} Map of the date the student was added to the spreadsheet with the id as the key.
 */
function getStudentsFromTENTATIVESheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TENTATIVE2(TESTING)");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var allStudentsMap = new Map();

  for (var i = 1; i < data.length; i++) {
    var studentId = data[i][headers.indexOf("STUDENT ID")];

    var studentData = {};
    for (var j = 0; j < headers.length; j++) {
      studentData[headers[j]] = data[i][j];
    }

    allStudentsMap.set(studentId, studentData);
  }

  // Logger.log("TENTATIVE Data: " + JSON.stringify([...allStudentsMap]));
  return allStudentsMap;
}



/**
 * getStudentsFromEntryWithdrawalSheet() references the "Entry_Withdrawal" sheet of the "NAHS 24-25 Student Transition Notes" spreadsheet.
 * 
 * @returns {Map} Map of the grade level, id, name, and entry date with the id as the key. The Map includes all students that enrolled throughout the year; it doesn't filter out the withdrawn students.
 */
function getStudentsFromEntryWithdrawalSheet() {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Entry_Withdrawal");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var emptyHeader = "";
  var studentNameCol = headers.indexOf("Student Name(Last, First)");
  var studentIdCol = headers.indexOf("Student Id");
  var studentGrCol = headers.indexOf("Grd Lvl");
  var firstDayCol = headers.indexOf("Entry Date");
  var withdrawnDateCol = headers.indexOf("Withdraw Date");

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
    var withdrawnDate = Utilities.formatDate(
      data[i][withdrawnDateCol],
      Session.getScriptTimeZone(),
      "M/d/yy",
    )

    // Splits the name at the comma and trims any spaces
    var nameParts = studentName.split(",").map(function (part) {
      return part.trim();
    });
    var lastName = nameParts[0];
    var firstName = nameParts[1];

    // Adds the student to the Map using Student ID as key
    allStudentsMap.set(studentId, [
      emptyHeader,
      lastName,
      firstName,
      studentId,
      studentGr,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      emptyHeader,
      studentEntryDate,
      emptyHeader,
      emptyHeader,
      withdrawnDate,
    ]);
  }

  // Logger.log("Entry_Withdrawal Data: " + [...allStudentsMap]);

  return allStudentsMap;
}

/**
 * The function below references the "Form Responses 2" sheet of the "Registrations SY 24.25" spreadsheet.
 * This data is useful in building the database because it provides data that isn't available in any other report.
 * 
 * @returns {Map} Map of the placement days, home campus, eligibility, educational factors, and behavior contract with the id as the key.
 */
function getDataFromFormResponses2() {
  var sheet = SpreadsheetApp.openById(
    "1kAWRpWO4xDtRShLB5YtTtWxTbVg800fuU2RvAlYhrfA",
  ).getSheetByName("Form Responses 2");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var emptyHeader = "";
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
        hmCampus,
        emptyHeader,
        // add the anticipated release date
        emptyHeader,
        placementDays,
        
        eligibility,
        educationalFactors,
        behaviorContract,
      ]);
    }
  }

  // Logger.log("Irma's Sheet's Data: " + [...allStudentsMap]);

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

  // Logger.log("IDs from Withdrawn: " + [...allStudentsMap]);

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

  // Logger.log("IDs from W/D Other: " + [...allStudentsMap]);

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

function registrationsData2() {
  // Fetch the data from the respective sheets as Maps
  let dataFromTENTATIVE = getStudentsFromTENTATIVESheet(); // Map with Student ID as key (objects as values)
  let dataFromEntryWithdrawal = getStudentsFromEntryWithdrawalSheet(); // Map with Student ID as key (arrays as values)

  // Performing a RIGHT JOIN between dataFromEntryWithdrawal and dataFromTENTATIVE
  let joinedData = rightJoin(dataFromEntryWithdrawal, dataFromTENTATIVE);

  // Now you can perform further operations on joinedData as needed
  Logger.log("Joined Data: " + JSON.stringify([...joinedData]));

  // More logic to manipulate and use the joined data can be added here...
}

/**
 * Function to perform a RIGHT JOIN operation between two Maps.
 * @param {Map} map1 - The left map where values are arrays (Entry_Withdrawal data)
 * @param {Map} map2 - The right map where values are objects (TENTATIVE data)
 * @returns {Map} - A new Map with the result of the RIGHT JOIN.
 */
function rightJoin(map1, map2) {
  let joinedMap = new Map();

  // Array headers for dataFromEntryWithdrawal, replace with actual headers
  let arrayHeaders = [
    "DATE ADDED TO SPREADSHEET",
    "LAST",
    "FIRST",
    "STUDENT ID",
    "GRADE",
    "1st Period - Course Title",
    "1st Period - Teacher Name",
    "1st Period - Transfer Grade",
    "1st Period - Current Grade",
    "1st Period - How would you assess this student's academic growth?",
    "1st Period - Academic and Behavioral Progress Notes",
    "2nd Period - Course Title",
    "2nd Period - Teacher Name",
    "2nd Period - Transfer Grade",
    "2nd Period - Current Grade",
    "2nd Period - How would you assess this student's academic progress?",
    "2nd Period - Academic and Behavioral Progress Notes",
    "3rd Period - Course Title",
    "3rd Period - Teacher Name",
    "3rd Period - Transfer Grade",
    "3rd Period - Current Grade",
    "3rd Period - How would you assess this student's academic progress?",
    "3rd Period - Academic and Behavioral Progress Notes",
    "4th Period - Course Title",
    "4th Period - Teacher Name",
    "4th Period - Transfer Grade",
    "4th Period - Current Grade",
    "4th Period - How would you assess this student's academic progress?",
    "4th Period - Academic and Behavioral Progress Notes",
    "5th Period - Course Title",
    "5th Period - Teacher Name",
    "5th Period - Transfer Grade",
    "5th Period - Current Grade",
    "5th Period - How would you assess this student's academic progress?",
    "5th Period - Academic and Behavioral Progress Notes",
    "6th Period - Course Title",
    "6th Period - Teacher Name",
    "6th Period - Transfer Grade",
    "6th Period - Current Grade",
    "6th Period - How would you assess this student's academic progress?",
    "6th Period - Academic and Behavioral Progress Notes",
    "7th Period - Course Title",
    "7th Period - Teacher Name",
    "7th Period - Transfer Grade",
    "7th Period - Current Grade",
    "7th Period - How would you assess this student's progress?",
    "7th Period - Academic and Behavioral Progress Notes",
    "8th Period - Course Title",
    "8th Period - Teacher Name",
    "8th Period - Transfer Grade",
    "8th Period - Current Grade",
    "8th Period - How would you assess this student's progress?",
    "8th Period - Academic and Behavioral Progress Notes",
    "SE - Special Education Case Manager",
    "SE - What accommodations seem to work well with this student to help them be successful?",
    "SE - What are the student's strengths, as far as behavior?",
    "SE - What are the student's needs, as far as behavior?  (Pick behavior having most effect on his/her ability to be successful in class.  If there are no concerns, note that.)",
    "SE - What are the student's needs, as far as functional skills?  (Include daily living skills, fine/gross motor skills, organizational skills, self-advocacy, attendance, etc.)",
    "SE - Please add any other comments or concerns here:",
    "REGULAR CAMPUS",
    "FIRST DAY OF AEP",
    "Anticipated Release Date",
    "Parent Notice Date",
    "Withdrawn Date",
  ];

  // Iterate over the entries in map1 (Entry_Withdrawal data)
  map1.forEach((arrayData, id) => {
    let matchedObject = convertArrayToObject(arrayData, arrayHeaders);

    // Check if the current ID exists in map2 (TENTATIVE data)
    let tentativeData = map2.get(id);

    if (tentativeData) {
      // Merge the two objects giving precedence to the tentativeData
      let mergedData = { ...matchedObject, ...tentativeData };
      joinedMap.set(id, mergedData);
    } else {
      // If no matching ID in map2, just use the matchedObject
      joinedMap.set(id, matchedObject);
    }
  });

  // Add remaining entries from map2 that were not matched in map1
  map2.forEach((tentativeData, id) => {
    if (!joinedMap.has(id)) {
      joinedMap.set(id, tentativeData);
    }
  });

  return joinedMap;
}

/**
 * Function to convert an array to an object based on given headers.
 * @param {Array} array - The array to convert.
 * @param {Array} headers - An array of headers corresponding to the values in the array.
 * @returns {Object} - The resulting object with headers as keys and array elements as values.
 */
function convertArrayToObject(array, headers) {
  let obj = {};
  headers.forEach((header, index) => {
    obj[header] = array[index];
  });
  return obj;
}


// Run the main function
registrationsData2();


