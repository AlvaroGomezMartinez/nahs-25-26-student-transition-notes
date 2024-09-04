/**********************************************************************************
 * The function below (matchAndCopyValues) gets called by the                     *
 * importDataToDestination function in the script file called                     *
 * importIntoTENTATIVE.                                                           *
 * The function references the sheet called "Form Responses 1" and imports the    *
 * reported academic growth and behavioral progress notes into their respective.  *
 * columns in TENTATIVE.                                                          *
 *                                                                                *
 * Point of contact: Alvaro Gomez                                                 *
 *                   Academic Technology Coach                                    *
 *                   alvaro.gomez@nisd.net                                        *
 *                   Office: +1-210-397-9408                                      *
 *                   Mobile: +1-210-363-1577                                      *
 *                                                                                *
 * Latest update: 09/03/24                                                        *
 **********************************************************************************/

// This is a helper function to extract the 6-digit student ID from the string that is returned in the Google Form that the teachers fill out.
function extractNumber(input) {
  let match = input.match(/\b\d{6}\b/);
  return match ? match[0] : null;
}

function matchAndCopyValues() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let responseSheet = spreadsheet.getSheetByName("Form Responses 1");
  let tentativeSheet = spreadsheet.getSheetByName("TENTATIVE");

  // Object that stores email-to-name mappings
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

  // Object that stores columnNumbers-to-period mappings
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

  let rangeValues = tentativeSheet
    .getRange(2, 1, lastRow - 1, lastColumn)
    .getValues();

  let rowValues = [];

  // Iterate through the fetched values
  for (let rowIndex = 0; rowIndex < rangeValues.length; rowIndex++) {
    let row = [];
    for (let i = 0; i < columnNumbers.length; i++) {
      let columnIndex = columnNumbers[i] - 1; // Adjust index to match array indexing
      let value = rangeValues[rowIndex][columnIndex];
      row.push(value);
    }
    rowValues.push(row);
  }

  let responsesRowValues = getResponses(responseSheet);

  // Replace emails with names using emailToName object
  for (let i = 0; i < responsesRowValues.length; i++) {
    let email = responsesRowValues[i][1]; // Assuming the email is in index 1 of each array
    if (emailToName.hasOwnProperty(email)) {
      responsesRowValues[i][1] = emailToName[email]; // Replace email with corresponding name
    }
  }

  // Extract and replace 6-digit numbers using regular expressions
  for (let i = 0; i < responsesRowValues.length; i++) {
    let valueC = responsesRowValues[i][2]; // Assuming the value in Column C is in index 2 of each array
    let valueG = responsesRowValues[i][6]; // Assuming the value in Column G is in index 6 of each array

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

  // Process each array in responsesRowValues
  for (let i = 0; i < responsesRowValues.length; i++) {
    let matchingIndex = -1;
    let valueToMatch = responsesRowValues[i][2]; // Assuming the value is in index 2 of each array

    //Find a match in rowValues
    for (let j = 0; j < rowValues.length; j++) {
      // Logger.log(typeof(rowValues[j][0]))
      // Logger.log(typeof(valueToMatch))
      if (rowValues[j][0].toString() === valueToMatch) {
        // Assuming the value to match is in index 0 of each array
        matchingIndex = j;
        break;
      }
    }

    if (matchingIndex !== -1) {
      // Determine which action to take based on the value in index 3 of responsesRowValues
      let action = responsesRowValues[i][3]; // Assuming the value is in index 3 of each array

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
        // Handle any other cases
      }
    }
  }

  for (let j = 0; j < rowValues.length; j++) {
    let firstGrowth = rowValues[j][2];
    let firstBehavior = rowValues[j][3];
    let secondGrowth = rowValues[j][5];
    let secondBehavior = rowValues[j][6];
    let thirdGrowth = rowValues[j][8];
    let thirdBehavior = rowValues[j][9];
    let fourthGrowth = rowValues[j][11];
    let fourthBehavior = rowValues[j][12];
    let fifthGrowth = rowValues[j][14];
    let fifthBehavior = rowValues[j][15];
    let sixthGrowth = rowValues[j][17];
    let sixthBehavior = rowValues[j][18];
    let seventhGrowth = rowValues[j][20];
    let seventhBehavior = rowValues[j][21];
    let eighthGrowth = rowValues[j][23];
    let eighthBehavior = rowValues[j][24];

    let ranges = [
      [j + 2, 10],
      [j + 2, 11],
      [j + 2, 16],
      [j + 2, 17],
      [j + 2, 22],
      [j + 2, 23],
      [j + 2, 28],
      [j + 2, 29],
      [j + 2, 34],
      [j + 2, 35],
      [j + 2, 40],
      [j + 2, 41],
      [j + 2, 46],
      [j + 2, 47],
      [j + 2, 52],
      [j + 2, 53],
    ];

    let outputValues = [
      [
        firstGrowth,
        firstBehavior,
        secondGrowth,
        secondBehavior,
        thirdGrowth,
        thirdBehavior,
        fourthGrowth,
        fourthBehavior,
        fifthGrowth,
        fifthBehavior,
        sixthGrowth,
        sixthBehavior,
        seventhGrowth,
        seventhBehavior,
        eighthGrowth,
        eighthBehavior,
      ],
    ];

    for (let i = 0; i < ranges.length; i++) {
      let outputRange = tentativeSheet.getRange(ranges[i][0], ranges[i][1]);
      outputRange.setValues([[outputValues[0][i]]]);
    }
  }
}

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
