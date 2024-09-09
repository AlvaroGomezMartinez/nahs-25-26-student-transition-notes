/**********************************************************************************
 *                         nahs-transition-project-24-25a                         *
 *                                                                                *
 * The function below (copySchedulesToTentative) gets called by the               *
 * importDataToDestination function in the script file called                     *
 * importIntoTENTATIVE. The function references the sheet called "Schedules" and  *
 * imports the course titles and teacher names into their respective columns in.  *
 * TENTATIVE.                                                                     *
 *                                                                                *
 * Point of contact: Alvaro Gomez                                                 *
 *                   Academic Technology Coach                                    *
 *                   alvaro.gomez@nisd.net                                        *
 *                   Office: +1-210-397-9408                                      *
 *                   Mobile: +1-210-363-1577                                      *
 *                                                                                *
 * Latest update: 09/03/24                                                        *
 **********************************************************************************/

function copySchedulesToTentative() {
  let sourceSheet = SpreadsheetApp.openById(
    "14-nvlNOLWebnJJOQNZPnglWx0OuE5U-_xEbXGodND6E"
  ).getSheetByName("Schedules");
  let targetSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TENTATIVE");

  let sourceData = sourceSheet.getDataRange().getValues();
  let targetData = targetSheet.getDataRange().getValues();

  let sourceIdColumn = 2; // Assuming student IDs are in column C of sourceSheet
  let targetIdColumn = 3; // Assuming student IDs are in column D of targetSheet

  for (let i = 1; i < sourceData.length; i++) {
    // Start from row 2 to skip headers
    let sourceId = sourceData[i][sourceIdColumn];
    let sourceValueInColumnF = sourceData[i][5]; // Column F, Period (0-based index is 5)
    let sourceValueInColumnH = sourceData[i][7]; // Column H, Course Title (0-based index is 7)

    if (sourceValueInColumnF === 1) {
      // Checks the value in column F (the period)
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 6).setValue(sourceData[i][7]); // Column H in Schedules to Column F in TENTATIVE
          targetSheet.getRange(j + 1, 7).setValue(sourceData[i][13]); // Column N in Schedules to G in TENTATIVE
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnF === 2) {
      // Check the value in column F
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 12).setValue(sourceData[i][7]); // Column H to L
          targetSheet.getRange(j + 1, 13).setValue(sourceData[i][13]); // Column N to M
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnF === 3) {
      // Check the value in column F
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 18).setValue(sourceData[i][7]); // Column H to R
          targetSheet.getRange(j + 1, 19).setValue(sourceData[i][13]); // Column N to S
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnF === 4) {
      // Check the value in column F
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 24).setValue(sourceData[i][7]); // Column H to X
          targetSheet.getRange(j + 1, 25).setValue(sourceData[i][13]); // Column N to Y
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnF === 5) {
      // Check the value in column F
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 30).setValue(sourceData[i][7]); // Column H to AD
          targetSheet.getRange(j + 1, 31).setValue(sourceData[i][13]); // Column N to AE
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnF === 6) {
      // Check the value in column F
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 36).setValue(sourceData[i][7]); // Column H to AJ
          targetSheet.getRange(j + 1, 37).setValue(sourceData[i][13]); // Column N to AK
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnF === 7) {
      // Check the value in column F
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 42).setValue(sourceData[i][7]); // Column H to AP
          targetSheet.getRange(j + 1, 43).setValue(sourceData[i][13]); // Column N to AQ
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnF === 8) {
      // Check the value in column F
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 48).setValue(sourceData[i][7]); // Column H to AV
          targetSheet.getRange(j + 1, 49).setValue(sourceData[i][13]); // Column N to AW
          break; // Exit the loop once a match is found
        }
      }
    }

    if (sourceValueInColumnH === "Case Manag HS") {
      // Check the value in column H
      for (let j = 1; j < targetData.length; j++) {
        // Start from row 2 to skip headers
        let targetId = targetData[j][targetIdColumn];

        if (sourceId === targetId) {
          // Copy specific columns from source to target
          targetSheet.getRange(j + 1, 54).setValue(sourceData[i][13]); // Column N to BB
          break; // Exit the loop once a match is found
        }
      }
    }
  }
}
