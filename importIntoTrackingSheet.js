/**********************************************************************************
 * The function below (importDataToTrackingSheet) calls the registrationsData     *
 * function in the SourceScript file of this project and an object is returned    *
 * that includes all of the students from Registrations SY 23.24. Next,           *
 * importDataToTrackingSheet references Sheet1 (Tracking Sheet) and cross         *
 * references the student IDs from both lists. If a student ID does not exist,    *
 * it will:                                                                       *
 *      1. apend the students to Sheet1, and                                      *
 *      2. sort the list in alphabetical order by last name then first.           *
 *                                                                                *
 * Point of contact: Alvaro Gomez                                                 *
 *                   Academic Technology Coach                                    *
 *                   alvaro.gomez@nisd.net                                        *
 *                   Office: +1-210-397-9408                                      *
 *                   Mobile: +1-210-363-1577                                      *
 *                                                                                *
 * Latest update: 09/03/24                                                        *
 **********************************************************************************/

function importDataToTrackingSheet() {
  let data = registrationsData();
  let destinationSpreadsheetId = "1giJmMGPcDsmp4IOnV4hlGTgXbxQwv2SxM9DuzNehh90";
  let destinationSpreadsheet = SpreadsheetApp.openById(
    destinationSpreadsheetId
  );
  let destinationSheet = destinationSpreadsheet.getSheetByName("NAHS Students");

  // Get existing Student IDs from the destination sheet
  let existingStudentIds = destinationSheet
    .getRange(2, 3, destinationSheet.getLastRow())
    .getValues();
  existingStudentIds = existingStudentIds
    .flat()
    .filter((studentId) => studentId !== ""); // Filter out empty values

  // Array of holiday dates
  let holidays = [
    "2023-09-04",
    "2023-10-09",
    "2023-11-07",
    "2023-11-20",
    "2023-11-21",
    "2023-11-22",
    "2023-11-23",
    "2023-11-24",
    "2023-12-18",
    "2023-12-19",
    "2023-12-20",
    "2023-12-21",
    "2023-12-22",
    "2023-12-25",
    "2023-12-26",
    "2023-12-27",
    "2023-12-28",
    "2023-12-29",
    "2024-01-01",
    "2024-01-02",
    "2024-01-15",
    "2024-02-19",
    "2024-03-11",
    "2024-03-12",
    "2024-03-13",
    "2024-03-14",
    "2024-03-15",
    "2024-03-29",
    "2024-04-26",
    "2024-05-27",
  ];

  for (let i = 0; i < data.length; i++) {
    let rowData = data[i];
    let studentId = rowData["Student ID"];
    let studentRow = findStudentRow(destinationSheet, studentId);

    if (studentRow !== -1) {
      // Student already exists, update remainingDays for existing student
      let startDate = new Date(rowData["Start Date"]);
      let today = new Date();
      let daysPassed = calculateBusinessDays(startDate, today, holidays);
      let totalPlacementDays = rowData["Placement Days"];
      let remainingDays = totalPlacementDays - daysPassed;

      // Update the remainingDays value in the student's row
      destinationSheet.getRange(studentRow, 11).setValue(remainingDays);
    } else {
      if (existingStudentIds.flat().indexOf(studentId) === -1) {
        let startDate = new Date(rowData["Start Date"]);
        let tenDaysMark = new Date(rowData["10 Days Mark"]);
        let projectedExit = new Date(rowData["Projected Exit"]);
        let formattedStartDate = Utilities.formatDate(
          startDate,
          "GMT",
          "M/d/yyyy"
        );
        let formattedTenDaysMark = Utilities.formatDate(
          tenDaysMark,
          "GMT",
          "M/d/yyyy"
        );
        let formattedProjectedExit = Utilities.formatDate(
          projectedExit,
          "GMT",
          "M/d/yyyy"
        );

        // Calculate the number of business days between start date and today
        let today = new Date();
        let daysPassed = calculateBusinessDays(startDate, today, holidays);

        // Calculate remaining days
        let totalPlacementDays = rowData["Placement Days"];
        let remainingDays = totalPlacementDays - daysPassed;

        let valuesToImport = [
          rowData["Student Last Name"],
          rowData["Student First Name"],
          rowData["Student ID"],
          rowData["Grade"],
          rowData["Home Campus"],
          formattedStartDate,
          rowData["Placement Days"],
          rowData["Placement Offense"],
          formattedTenDaysMark,
          formattedProjectedExit,
          remainingDays, // Update with remaining days
        ];

        let hasValidData = valuesToImport
          .slice(0, 10)
          .every(
            (value) => value !== "" && value !== undefined && value !== null
          );

        if (remainingDays > 0 && hasValidData) {
          // Specify the target columns using targetColumnIndices
          let targetRow = [
            valuesToImport[0],
            valuesToImport[1],
            valuesToImport[2],
            valuesToImport[3],
            valuesToImport[4],
            valuesToImport[5],
            valuesToImport[6],
            valuesToImport[7],
            valuesToImport[8],
            valuesToImport[9],
            valuesToImport[10],
          ];

          destinationSheet.appendRow(targetRow);
        }
      }
    }
  }

  // Sort the rows based on columns K, A, then B
  destinationSheet.getRange("A2:K" + destinationSheet.getLastRow()).sort([
    { column: 11, ascending: true }, // Sort by remainingDays (column 11) in ascending order
    { column: 1, ascending: true }, // Then sort by Student Last Name (column 1) in alphabetical order
    { column: 2, ascending: true }, // Then sort by Student First Name (column 2) in alphabetical order
  ]);
}

// Calculate the number of business days between two dates excluding weekends and holidays
function calculateBusinessDays(startDate, endDate, holidays) {
  let days = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    let dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...

    if (
      dayOfWeek !== 0 &&
      dayOfWeek !== 6 &&
      !holidays.includes(currentDate.toDateString())
    ) {
      days++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

// Function to find the row index of a student based on their ID
function findStudentRow(sheet, studentId) {
  let studentIds = sheet.getRange(2, 3, sheet.getLastRow()).getValues();
  for (let i = 0; i < studentIds.length; i++) {
    if (studentIds[i][0] === studentId) {
      return i + 2; // Adding 2 to account for 1-based indexing and header row
    }
  }
  return -1; // Student not found
}
