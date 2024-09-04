/**********************************************************************************
 * The function below (importEmails) gets called by the importDataToDestination   *
 * function in the script file called importIntoTENTATIVE.                        *
 * The function references the sheet called "ContactInfo" and imports the         *
 * Student Email, Guardian 1 Email, and Parent Name values into TENTATIVE.        *
 *                                                                                *
 * Point of contact: Alvaro Gomez                                                 *
 *                   Academic Technology Coach                                    *
 *                   alvaro.gomez@nisd.net                                        *
 *                   Office: +1-210-397-9408                                      *
 *                   Mobile: +1-210-363-1577                                      *
 *                                                                                *
 * Latest update: 09/03/24                                                        *
 **********************************************************************************/

function importEmails() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let emailsSheet = ss.getSheetByName("ContactInfo");
  let tentativeSheet = ss.getSheetByName("TENTATIVE");

  // Fetch only the relevant columns in batches
  let startRow = 2; // Data starts from row 2
  let lastRow = emailsSheet.getLastRow();
  let batchSize = 100; // Adjust the batch size as needed

  while (startRow <= lastRow) {
    let range = emailsSheet.getRange(startRow, 2, batchSize, 8); // Adjust columns as needed
    let batchData = range.getValues();

    // Process the batch
    processBatch(batchData, tentativeSheet);

    startRow += batchSize;
  }
}

function processBatch(batchData, tentativeSheet) {
  let emailMap = {};

  // Create a map of Student IDs to emails and guardian info for the batch
  for (let i = 0; i < batchData.length; i++) {
    let studentId = batchData[i][0];
    let guardianName1 = batchData[i][3];
    let guardianEmail1 = batchData[i][5];
    let studentEmail = batchData[i][7];
    if (studentId || guardianName1 || guardianEmail1 || studentEmail) {
      emailMap[studentId] = {
        studentEmail: studentEmail,
        guardianName: guardianName1,
        guardianEmail: guardianEmail1,
      };
    }
  }

  let lastRow = tentativeSheet.getLastRow();
  let studentIds = tentativeSheet.getRange(2, 4, lastRow - 1).getValues();

  // Insert emails, guardian names, and guardian emails into TENTATIVE sheet for the batch
  for (let i = 0; i < studentIds.length; i++) {
    let studentId = studentIds[i][0];
    if (emailMap.hasOwnProperty(studentId)) {
      let emailInfo = emailMap[studentId];
      tentativeSheet.getRange(i + 2, 77).setValue(emailInfo.studentEmail); // Student Email - Column BY
      tentativeSheet.getRange(i + 2, 78).setValue(emailInfo.guardianName); // Guardian Name - Column BZ
      tentativeSheet.getRange(i + 2, 79).setValue(emailInfo.guardianEmail); // Guardian Email - Column CA
    }
  }
}
