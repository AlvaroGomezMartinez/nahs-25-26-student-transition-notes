/**
 * Imports student and guardian email information from the "ContactInfo" sheet into the "TENTATIVE" sheet.
 * This function fetches email data in batches from the "ContactInfo" sheet and processes it to map 
 * student IDs to their emails, guardian names, and guardian emails. The processed data is then inserted 
 * into corresponding columns in the "TENTATIVE" sheet.
 *
 * @function
 * @name importEmails
 * 
 * @summary
 * Imports Student Email, Guardian 1 Email, and Guardian Name from the "ContactInfo" sheet into the 
 * "TENTATIVE" sheet.
 *
 * @description
 * This function is called by `importDataToDestination` to transfer email information from "ContactInfo" 
 * to "TENTATIVE". It processes the data in batches to avoid memory issues with large datasets. 
 * The processed data includes the Student Email (column BY), Guardian Name (column BZ), 
 * and Guardian Email (column CA) in the "TENTATIVE" sheet. 
 * Data is fetched starting from row 2 to the last row in "ContactInfo".
 * 
 * @global
 * SpreadsheetApp - The Google Apps Script service for working with Google Sheets.
 *
 * @see importDataToDestination
 */
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

/**
 * Processes a batch of email data and inserts corresponding student and guardian information 
 * into the "TENTATIVE" sheet.
 * 
 * @function
 * @name processBatch
 * 
 * @summary
 * Maps Student IDs to email and guardian information, then inserts that data into the "TENTATIVE" sheet.
 *
 * @param {Array<Array>} batchData - A 2D array representing rows of data fetched from "ContactInfo". 
 * Each row contains values for Student ID, Guardian Name, Guardian Email, and Student Email.
 * 
 * @param {Sheet} tentativeSheet - The Google Sheets sheet object representing the "TENTATIVE" sheet.
 * This sheet is where the processed email information will be inserted.
 *
 * @description
 * For each row in the batch, the function creates a map of Student IDs to email and guardian information. 
 * It then compares the Student IDs in the "TENTATIVE" sheet and inserts the corresponding data 
 * (Student Email, Guardian Name, and Guardian Email) in the appropriate columns: 
 * BY (Student Email), BZ (Guardian Name), and CA (Guardian Email).
 */
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
