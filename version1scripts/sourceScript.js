/**********************************************************************************
 *                         nahs-transition-project-24-25a                         *
 *                                                                                *
 * The registrationsData function is called by the importIntoTENTATIVE file in    *
 * this project.                                                                  *
 *                                                                                *
 * The registrationsData function references Irma Lopez's (Attendance Secretary,  *
 * NAHS) tracking form (Form Responses 2; Registrations SY 24.25).                *
 *                                                                                *
 * The registrationsData function creates an object (dataObject) with the data    *
 * from the students who are listed on Irma's Form Responses 2 sheet that aren't  *
 * listed in this project's Withdrawn sheet. If a student is in the Withdrawn     *
 * sheet then they will not be added to dataObject.                               *
 *                                                                                *
 * The registrationsData function also adds a key to dataObject called            *
 * '10 Days Mark' that provides the 10th day after placement at NAHS.             *
 * The '10 Days Mark' date is used to send a reminder (see the "reminderEmails")  *
 * to teachers to fill out student progress.                                      *
 *                                                                                *
 * Point of contact: Alvaro Gomez                                                 *
 *                   Academic Technology Coach                                    *
 *                   alvaro.gomez@nisd.net                                        *
 *                   Office: +1-210-397-9408                                      *
 *                   Mobile: +1-210-363-1577                                      *
 *                                                                                *
 * Latest update: 09/18/24                                                        *
 **********************************************************************************/

function registrationsData() {
  let externalSpreadsheetId = "1kAWRpWO4xDtRShLB5YtTtWxTbVg800fuU2RvAlYhrfA"; // Irma's sheet, "Registrations SY 24.25"
  let externalSpreadsheet = SpreadsheetApp.openById(externalSpreadsheetId);
  let externalSpreadsheetId2 = "14-nvlNOLWebnJJOQNZPnglWx0OuE5U-_xEbXGodND6E"; // The "NAHS 24-25 Student Transition Notes" database
  let externalSpreadsheet2 = SpreadsheetApp.openById(externalSpreadsheetId2);

  // Retrieve data from "Form Responses 2" sheet in Irma's spreadsheet
  let sheet1 = externalSpreadsheet.getSheetByName("Form Responses 2");
  let allData = sheet1.getDataRange().getValues();
  let startRow = 2;
  let lastRow = startRow;

  // Iterate through the rows in Irma's sheet starting from Row 2
  for (let i = startRow - 1; i < allData.length; i++) {
    // Checks if the row is blank. The purpose of this is to find the last row of the first table of data in Irma's sheet.
    if (allData[i].every((cell) => cell === "")) {
      break;
    }
    lastRow = i + 1;
  }

  // Calculate the number of rows to include, this skips the second table of data in Irma's sheet
  let numRows = lastRow - startRow + 1;
  let dataRange = sheet1.getRange(startRow, 1, numRows, sheet1.getLastColumn());
  let dataValues1 = dataRange.getValues();

  // Iterate through the dataValues1 array and capitalize the values in index 5
  let capitalizedDataValues1 = dataValues1.map((row) => {
    // Check if the value in index 5 is a string
    if (typeof row[5] === "string") {
      // Capitalize the first letter and concatenate the rest of the string
      row[5] = row[5].charAt(0).toUpperCase() + row[5].slice(1);
    }

    return row;
  });

  // Creates an object that will be used to store the latest date for each unique Student ID (value in index 3)
  let latestDates = {};

  // Iterate through the dataValues1 array and finds the latest start date (index 5) for each unique student ID (index 3).
  capitalizedDataValues1.forEach((row) => {
    let valueInIndex3 = row[3];
    let dateInIndex5 = new Date(row[5]);

    if (
      !latestDates[valueInIndex3] ||
      dateInIndex5 > latestDates[valueInIndex3]
    ) {
      latestDates[valueInIndex3] = dateInIndex5;
    }
  });

  // Filter the capitalizedDataValues1 array based on the latest dates for each unique Student ID (value in index 3).
  // In other words, it will filter out repeating IDs and keep the row with the most recent start date (index 5).
  let filteredDataValues1 = capitalizedDataValues1.filter((row) => {
    let valueInIndex3 = row[3];
    let dateInIndex5 = new Date(row[5]);

    return dateInIndex5.getTime() === latestDates[valueInIndex3].getTime();
  });

  // Retrieve data from "Students not on Registration Doc" sheet
  let sheet2 = externalSpreadsheet2.getSheetByName(
    "Students not on Registration Doc",
  );
  let dataRange2 = sheet2.getRange("A2:I");
  // let dataValues2 = dataRange2.getValues().filter(row => row.some(cell => cell !== '')); // Filter out empty rows
  let dataValues2 = dataRange2.getValues().filter((row) => {
    // Check if any cell in the row is not empty
    if (row.some((cell) => cell !== "")) {
      // If non-empty, only keep rows where the value in index 8 is empty
      return row[8] === "";
    }

    // If the row is totally empty, exclude it
    return false;
  });

  // Add blank elements to each array in dataValues2 so they match up to the same number of elements as filteredDataValues1
  dataValues2.forEach((row) => {
    // Add a blank element at the beginning
    row.unshift("");

    // Add 8 blank elements at the end
    for (let i = 0; i < 7; i++) {
      row.push("");
    }
  });

  // Merge data from both sheets
  let dataValues = filteredDataValues1.concat(dataValues2); // "Students not on Registration Doc"

  let dataObjects = [];
  let holidayDates = [
    "2024-09-02",
    "2024-10-14",
    "2024-11-05",
    "2024-11-25",
    "2024-11-26",
    "2024-11-27",
    "2024-11-28",
    "2024-11-29",
    "2024-12-23",
    "2024-12-24",
    "2024-12-25",
    "2024-12-26",
    "2024-12-27",
    "2024-12-30",
    "2024-12-31",
    "2025-01-01",
    "2025-01-02",
    "2025-01-03",
    "2025-01-06",
    "2025-01-20",
    "2025-02-17",
    "2025-03-10",
    "2025-03-11",
    "2025-03-12",
    "2025-03-13",
    "2025-03-14",
    "2025-04-18",
    "2025-04-21",
    "2025-05-02",
    "2025-05-26",
  ];

  // Open the "Withdrawn" spreadsheet
  let withdrawnSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Withdrawn");
  let withdrawnSheet2 =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("W/D Other");
  let studentsWithSchedules =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Schedules");
  let withdrawnData = withdrawnSheet.getRange("D:D").getValues().flat(); // Get all values in column D of 'Withdrawn'. It's the student IDs
  let nonBlankWithdrawnData = withdrawnData.filter((value) => value !== "");
  nonBlankWithdrawnData.shift();
  let withdrawnData2 = withdrawnSheet2.getRange("D:D").getValues().flat(); // Get all values in column D of 'W/D Other'
  let nonBlankWithdrawnData2 = withdrawnData2.filter((value) => value !== "");
  nonBlankWithdrawnData2.shift();
  let stusWScheds = studentsWithSchedules.getRange("C:C").getValues().flat(); // Get all values in column C of 'Schedules'
  let nonBlankStusWScheds = stusWScheds.filter((value) => value !== "");
  nonBlankStusWScheds.shift();
  let uniqueNonBlankStusWScheds = [...new Set(nonBlankStusWScheds)];

  let allWithdrawnData = nonBlankWithdrawnData.concat(nonBlankWithdrawnData2);
  let uniqueAllWithdrawnData = [...new Set(allWithdrawnData)];

  let superFiltered = uniqueAllWithdrawnData.filter(
    (value) => !uniqueNonBlankStusWScheds.includes(value),
  );

  for (let i = 1; i < dataValues.length; i++) {
    let rowData = dataValues[i];
    let studentID = rowData[3]; // Assuming 'Student ID' is in the 4th column (index 3)

    // Check if studentID exists in the withdrawnData array
    if (!superFiltered.includes(studentID)) {
      // Student ID doesn't exist in both the "Withdrawn" and "W/D Other" sheet, so add it to dataObjects
      let startDate = new Date(rowData[5]); // 'Start Date' is in index 5
      let placementDays = parseInt(rowData[4], 10); // Convert Placement Days to integer
      let newDate = addWorkdays(startDate, 10, holidayDates);
      let projectedExit = calculateProjectedExit(
        startDate,
        placementDays,
        holidayDates,
      );
      let daysLeft = calculateDaysLeft(startDate, placementDays, holidayDates);

      let dataObject = {
        Timestamp: rowData[0],
        "Student Last Name": rowData[1],
        "Student First Name": rowData[2],
        "Student ID": studentID, // Use the extracted student ID
        Grade: rowData[7],
        "Home Campus": rowData[6],
        "Start Date": rowData[5],
        "Placement Days": rowData[4],
        "Placement Offense": rowData[8],
        Eligibility: rowData[9],
        "Behavior Contract": rowData[11],
        // 'Email Address': rowData[11],
        "10 Days Mark": formatDate(newDate), // Format the new date
        "Projected Exit": formatDate(projectedExit), // Format projected exit date
        "Days Left": daysLeft,
      };

      dataObjects.push(dataObject);
    }
  }

  let studentIDs = [];

  for (let i = 0; i < dataObjects.length; i++) {
    studentIDs.push(dataObjects[i]["Student ID"]);
  }

  // The function below is used for testing. Sort the studentIDs array numerically
  // studentIDs.sort(function(a, b) {
  //   return a - b;
  // });
  // let numberOfStudentIDs = studentIDs.length;
  // Logger.log(numberOfStudentIDs);
  // Logger.log("List of Student IDs (Numerical Order): " + studentIDs.join(", "));

  // Optionally, return the objects or do something else with them
  return dataObjects;
}

function addWorkdays(startDate, numWorkdays, holidays) {
  let currentDate = new Date(startDate);
  let workdaysAdded = 1;

  while (workdaysAdded < numWorkdays) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      workdaysAdded++;
    }
  }

  // Ensure the result is not on a holiday
  while (isHoliday(currentDate, holidays)) {
    currentDate.setDate(currentDate.getDate() + 1); // Skip to the next day
  }
  
  return currentDate;
}

// Old function. I am checing the one below it.
// function isWeekend(date) {
//   return date.getDay() === 0 || date.getDay() === 6;
// }
/**
 * Checks if a date is a weekend.
 * @param {Date} date - Date object to check.
 * @return {boolean} - True if weekend, false otherwise.
 */
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday (0) or Saturday (6)
}

// Old function. I am checking the one below it.
// function isHoliday(date, holidays) {
//   return holidays.includes(formatDate(date));
// }
/**
 * Checks if a date is a holiday.
 * @param {Date} date - Date object to check.
 * @param {Array} holidays - Array of holiday strings in "MM/DD/YYYY" format.
 * @return {boolean} - True if holiday, false otherwise.
 */
function isHoliday(date, holidays) {
  const formattedDate = formatDateForHolidays(date); // Format date to "MM/DD/YYYY"
  return holidays.includes(formattedDate);
}

/**
 * Formats a date as "MM/DD/YYYY".
 * @param {Date} date - Date object to format.
 * @return {string} - Formatted date string.
 */
function formatDateForHolidays(date) {
  const month = (date.getMonth() + 1); // Months are 0-based
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

// Old function. I am checking the one below it.
// function formatDate(date) {
//   let year = date.getFullYear();
//   let month = (date.getMonth() + 1).toString().padStart(2, "0");
//   let day = date.getDate().toString().padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }
/**
 * Formats a date as "yyyy-MM-dd".
 * @param {Date} date - Date object to format.
 * @return {string} - Formatted date string.
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateProjectedExit(startDate, placementDays, holidays) {
  let currentDate = new Date(startDate);
  let workdaysAdded = 1;

  while (workdaysAdded < placementDays) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      workdaysAdded++;
    }
  }

  return currentDate;
}

function calculateDaysLeft(startDate, placementDays, holidays) {
  let currentDate = new Date(startDate);
  let workdaysPassed = 0;

  while (currentDate <= new Date()) {
    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      workdaysPassed++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return placementDays - workdaysPassed;
}
