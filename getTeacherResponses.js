/**
 * Matches and copies academic growth and behavioral progress notes from the "Form Responses 1" sheet
 * to the corresponding columns in the "TENTATIVE" sheet based on student IDs and teacher email addresses.
 * The function processes form responses, extracts student IDs, replaces teacher emails with names,
 * and maps the data to the correct periods and columns in the "TENTATIVE" sheet.
 * 
 * @function
 * @name matchAndCopyValues
 * 
 * @summary
 * Imports academic and behavioral progress notes into the "TENTATIVE" sheet.
 * 
 * @description
 * This function is invoked by the `importDataToDestination` function and processes data from
 * the "Form Responses 1" sheet, matching it to the "TENTATIVE" sheet based on student IDs. 
 * It extracts student IDs from the form responses, replaces teacher emails with their respective names, 
 * and matches academic and behavioral progress notes to the correct student and period in the "TENTATIVE" sheet.
 * 
 * @global
 * SpreadsheetApp - Google Apps Script service to work with Google Sheets.
 * 
 * @see importDataToDestination
 * @see SpreadsheetApp.getActiveSpreadsheet
 * 
 * @example
 * // Called to copy and match values based on responses from "Form Responses 1"
 * matchAndCopyValues();
 */
function matchAndCopyValues() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let responseSheet = spreadsheet.getSheetByName("Form Responses 1");
  let tentativeSheet = spreadsheet.getSheetByName("TENTATIVE");

  // Mapping of email addresses to teacher names
  let emailToName = {
    "alvaro.gomez@nisd.net": "Gomez, Alvaro",
    "marco.ayala@nisd.net": "Ayala, Marco",
    "alita.barrera@nisd.net": "Barrera, Alita",
    "gabriela.chavarria-medina@nisd.net": "Chavarria-Medina, Gabriel",
    "leticia.collier@nisd.net": "Collier, Leticia",
    "staci.cunningham@nisd.net": "Cunningham, Staci",
    "samantha.daywood@nisd.net": "Daywood, Samantha",
    "richard.delarosa@nisd.net": "De La Rosa, Richard",
    "ramon.duran@nisd.net": "Duran Jr, Ramon",
    "janice.flores@nisd.net": "Flores, Janice",
    "lauren.flores@nisd.net": "Flores, Lauren",
    "roslyn.francis@nisd.net": "Francis, Roslyn",
    "daniel.galdeano@nisd.net": "Galdeano, Daniel",
    "nancy-1.garcia@nisd.net": "Garcia, Nancy",
    "cierra.gibson@nisd.net": "Gibson, Cierra",
    "zina.gonzales@nisd.net": "Gonzales, Zina",
    //"teressa.hensley@nisd.net": "",
    "catherine.huff@nisd.net": "Huff, Catherine",
    "erin.knippa@nisd.net": "Knippa, Erin",
    "joshua.lacour@nisd.net": "Lacour, Joshua",
    "thalia.mendez@nisd.net": "Mendez, Thalia",
    "alexandria.murphy@nisd.net": "Murphy, Alexandria",
    "dennis.olivares@nisd.net": "Olivares, Dennis",
    "loretta.owens@nisd.net": "Owens, Loretta",
    "denisse.perez@nisd.net": "Perez, Denisse",
    "jessica.poladelcastillo@nisd.net": "Pola Del Castillo, Jessic",
    //"angela.rodriguez@nisd.net": "",
    "linda.rodriguez@nisd.net": "Rodriguez, Linda",
    "jessica-1.vela@nisd.net": "Vela, Jessica",
    "miranda.wenzlaff@nisd.net": "Wenzlaff, Miranda",
  };

  // Mapping of column numbers to period names
  let colNumbersToPeriod = {
    7: "1st",
    13: "2nd",
    19: "3rd",
    25: "4th",
    31: "5th",
    37: "6th",
    43: "7th",
    49: "8th",
    54: "SE CM",
  };

  let columnNumbers = [
    4, 7, 10, 11, 13, 16, 17, 19, 22, 23, 25, 28, 29, 31, 34, 35, 37, 40, 41,
    43, 46, 47, 49, 52, 53, 54,
  ];
  
  let lastRow = tentativeSheet.getLastRow();
  let lastColumn = columnNumbers[columnNumbers.length - 1];

  // Fetch values from the "TENTATIVE" sheet
  let rangeValues = tentativeSheet
    .getRange(2, 1, lastRow - 1, lastColumn)
    .getValues();

  let rowValues = [];

  // Extract only relevant column values from the "TENTATIVE" sheet
  for (let rowIndex = 0; rowIndex < rangeValues.length; rowIndex++) {
    let row = [];
    for (let i = 0; i < columnNumbers.length; i++) {
      let columnIndex = columnNumbers[i] - 1; // Adjust index to match array indexing
      let value = rangeValues[rowIndex][columnIndex];
      row.push(value);
    }
    rowValues.push(row);
  }

  // Get responses from "Form Responses 1"
  let responsesRowValues = getResponses(responseSheet);

  // Replace emails with names using emailToName object
  for (let i = 0; i < responsesRowValues.length; i++) {
    let email = responsesRowValues[i][1]; // Assuming the email is in index 1 of each array
    if (emailToName.hasOwnProperty(email)) {
      responsesRowValues[i][1] = emailToName[email]; // Replace email with corresponding name
    }
  }

  // Extract and replace 6-digit student IDs
  for (let i = 0; i < responsesRowValues.length; i++) {
    let valueC = responsesRowValues[i][2]; // Assuming the value in Column C is in index 2
    let valueG = responsesRowValues[i][6]; // Assuming the value in Column G is in index 6

    let extractedNumber;

    // Check if value in Column C is empty, and if so, extract from Column G
    if (valueC !== "") {
      extractedNumber = extractNumber(valueC);
    } else {
      extractedNumber = extractNumber(valueG);
    }

    if (extractedNumber) {
      responsesRowValues[i][2] = extractedNumber; // Replace value with extracted number
    }
  }

  // Match and copy values to the "TENTATIVE" sheet
  for (let i = 0; i < responsesRowValues.length; i++) {
    let matchingIndex = -1;
    let valueToMatch = responsesRowValues[i][2]; // Assuming the value is in index 2

    // Find a match in rowValues based on student ID
    for (let j = 0; j < rowValues.length; j++) {
      if (rowValues[j][0].toString() === valueToMatch) {
        matchingIndex = j;
        break;
      }
    }

    if (matchingIndex !== -1) {
      // Determine which action to take based on the period
      let action = responsesRowValues[i][3]; // Assuming the value is in index 3

      // Match period to the correct columns and copy data
      switch (action) {
        case "1st":
          rowValues[matchingIndex][2] = responsesRowValues[i][4];
          rowValues[matchingIndex][3] = responsesRowValues[i][5];
          break;
        case "2nd":
          rowValues[matchingIndex][5] = responsesRowValues[i][4];
          rowValues[matchingIndex][6] = responsesRowValues[i][5];
          break;
        case "3rd":
          rowValues[matchingIndex][8] = responsesRowValues[i][4];
          rowValues[matchingIndex][9] = responsesRowValues[i][5];
          break;
        case "4th":
          rowValues[matchingIndex][11] = responsesRowValues[i][4];
          rowValues[matchingIndex][12] = responsesRowValues[i][5];
          break;
        case "5th":
          rowValues[matchingIndex][14] = responsesRowValues[i][4];
          rowValues[matchingIndex][15] = responsesRowValues[i][5];
          break;
        case "6th":
          rowValues[matchingIndex][17] = responsesRowValues[i][4];
          rowValues[matchingIndex][18] = responsesRowValues[i][5];
          break;
        case "7th":
          rowValues[matchingIndex][20] = responsesRowValues[i][4];
          rowValues[matchingIndex][21] = responsesRowValues[i][5];
          break;
        case "8th":
          rowValues[matchingIndex][23] = responsesRowValues[i][4];
          rowValues[matchingIndex][24] = responsesRowValues[i][5];
          break;
        default:
          // Handle other cases
      }
    }
  }

  // Write the updated values back to the "TENTATIVE" sheet
  for (let j = 0; j < rowValues.length; j++) {
    let ranges = [
      [j + 2, 10], [j + 2, 11], [j + 2, 16], [j + 2, 17],
      [j + 2, 22], [j + 2, 23], [j + 2, 28], [j + 2, 29],
      [j + 2, 34], [j + 2, 35], [j + 2, 40], [j + 2, 41],
      [j + 2, 46], [j + 2, 47], [j + 2, 52], [j + 2, 53],
    ];

    let outputValues = [
      [
        rowValues[j][2], rowValues[j][3], rowValues[j][5], rowValues[j][6], 
        rowValues[j][8], rowValues[j][9], rowValues[j][11], rowValues[j][12], 
        rowValues[j][14], rowValues[j][15], rowValues[j][17], rowValues[j][18], 
        rowValues[j][20], rowValues[j][21], rowValues[j][23], rowValues[j][24],
      ],
    ];

    // Set values for each student
    for (let i = 0; i < ranges.length; i++) {
      let outputRange = tentativeSheet.getRange(ranges[i][0], ranges[i][1]);
      outputRange.setValues([[outputValues[0][i]]]);
    }
  }
}

/**
 * Extracts a number from a given string.
 * Assumes the number is a 6-digit student ID.
 * 
 * @param {string} inputString - The string containing the number.
 * @returns {string|null} - The extracted 6-digit number or null if no number is found.
 */
function extractNumber(inputString) {
  let match = inputString.match(/\b\d{6}\b/);
  return match ? match[0] : null;
}

/**
 * Extracts response data from the "Form Responses 1" sheet.
 * 
 * @param {Sheet} sheet - The Google Sheets object representing "Form Responses 1".
 * @returns {Array<Array>} - A 2D array containing the responses from the sheet.
 */
function getResponses(sheet) {
  let numColumns = sheet.getLastColumn();
  let numRows = sheet.getLastRow();
  let responsesRowValues = [];
  for (let rowIndex = 2; rowIndex <= numRows; rowIndex++) {
    let rowData = sheet.getRange(rowIndex, 1, 1, numColumns).getValues()[0];
    responsesRowValues.push(rowData);
  }
  return responsesRowValues;
}
