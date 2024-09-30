/**
 * Returns a map of student IDs using the data from "Entry_Withdrawal".
 *
 * Note: When a student re-enrolls, at NAHS, the map's entry for that student
 * ID will contain an array with multiple elements, each representing their
 * subsequent placement at NAHS.
 *
 * @file loadEntryWithdrawalData.js
 * @return {Map<number, Array<Object>>} A map of student IDs with the values from "Entry_Withdrawal".
 */
function loadEntryWithdrawalData() {
  const entryWithdrawal = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Entry_Withdrawal")
    .getDataRange()
    .getValues();

  const entryWithdrawalMap = new Map();
  const occurrencesMap = new Map(); // Map to track occurrences of student IDs

  const headers = entryWithdrawal[0];

  for (let i = 1; i < entryWithdrawal.length; i++) {
    const row = entryWithdrawal[i];
    const rowData = {};

    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });

    let studentId = row[1]; // The student ID is in the second column (index 1)
    if (studentId) {
      studentId = String(studentId).trim();

      // Track occurrences of student IDs
      occurrencesMap.set(studentId, (occurrencesMap.get(studentId) || 0) + 1);

      if (entryWithdrawalMap.has(studentId)) {
        entryWithdrawalMap.get(studentId).push(rowData);
      } else {
        entryWithdrawalMap.set(studentId, [rowData]);
      }
    } else {
      Logger.log(`Entry_Withdrawal: Empty student ID at row ${i + 1}`);
    }
  }

  // Add the recidivist status to each student's data
  entryWithdrawalMap.forEach((dataArray, studentId) => {
    const recidivist = occurrencesMap.get(studentId) > 1 ? "YES" : "NO"; // Determine recidivist status
    dataArray.forEach((rowData) => {
      rowData.recidivist = recidivist; // Add the recidivist value to each entry
    });
  });

  // Logger.log(`Total entries in Entry Withdrawal Map: ${entryWithdrawalMap.size}`);
  return entryWithdrawalMap;
}
