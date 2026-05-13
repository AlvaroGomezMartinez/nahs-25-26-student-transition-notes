/**
 * @fileoverview Debug utilities for investigating data loader behavior.
 *
 * These functions were used during development to diagnose sheet structure
 * and column mapping issues. They are preserved here for future debugging
 * but are not part of the production system.
 *
 * Run any of these from the Apps Script editor when troubleshooting.
 *
 * @author Alvaro Gomez
 * @since 2.0.0
 */

/**
 * Inspects the TENTATIVE-Version2 data structure loaded by TentativeDataLoader.
 * Useful for verifying the shape of data returned by the loader.
 */
function debugTentativeStructure() {
  console.log('=== Debugging TENTATIVE-Version2 Data Structure ===');

  try {
    const loader = new TentativeDataLoader();
    const tentativeData = loader.loadData();

    console.log(`Loaded ${tentativeData.size} students from TENTATIVE-Version2`);

    let count = 0;
    tentativeData.forEach((studentRecord, studentId) => {
      if (count < 3) {
        console.log(`\n--- Student ${studentId} ---`);
        console.log('Is Array:', Array.isArray(studentRecord));

        if (Array.isArray(studentRecord)) {
          console.log('Array length:', studentRecord.length);
          if (studentRecord.length > 0) {
            console.log('First element keys:', Object.keys(studentRecord[0] || {}));
          }
        } else {
          console.log('Object keys:', Object.keys(studentRecord || {}));
        }
        count++;
      }
    });

  } catch (error) {
    console.error('Error debugging tentative structure:', error);
  }
}

/**
 * Full diagnostic for ContactInfo sheet — checks existence, headers, and loader output.
 */
function debugContactDataLoading() {
  console.log('=== Debugging ContactInfo Data Loading ===');

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CONTACT_INFO);
    if (!sheet) {
      console.error('❌ ContactInfo sheet not found');
      return;
    }

    console.log(`✅ ContactInfo sheet found — ${sheet.getLastRow()} rows, ${sheet.getLastColumn()} columns`);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('Headers:');
    headers.forEach((header, index) => {
      console.log(`  ${String.fromCharCode(65 + index)}: "${header}"`);
    });

    const studentIdIndex    = headers.indexOf(COLUMN_NAMES.STUDENT_ID);
    const altStudentIdIndex = headers.indexOf(COLUMN_NAMES.STUDENT_ID_ALT);
    console.log(`\nKey column "${COLUMN_NAMES.STUDENT_ID}" at index: ${studentIdIndex}`);
    if (studentIdIndex === -1) {
      console.log(`Alternative "${COLUMN_NAMES.STUDENT_ID_ALT}" at index: ${altStudentIdIndex}`);
    }

    const loader = new ContactDataLoader();
    const data   = loader.loadData();
    console.log(`\nLoaded ${data.size} contact records`);

    let count = 0;
    for (const [studentId, contactData] of data) {
      if (count >= 3) break;
      console.log(`\nStudent ID: ${studentId}`);
      console.log(`Keys: ${Object.keys(contactData).join(', ')}`);
      count++;
    }

  } catch (error) {
    console.error('Error in diagnostic:', error);
  }
}

/**
 * Prints the expected column name constants for ContactInfo.
 */
function checkContactColumnNames() {
  console.log('=== Contact Column Name Check ===');
  console.log('STUDENT_ID:',       COLUMN_NAMES.STUDENT_ID);
  console.log('STUDENT_ID_ALT:',   COLUMN_NAMES.STUDENT_ID_ALT);
  console.log('STUDENT_EMAIL:',    COLUMN_NAMES.STUDENT_EMAIL);
  console.log('PARENT_NAME:',      COLUMN_NAMES.PARENT_NAME);
  console.log('GUARDIAN_EMAIL:',   COLUMN_NAMES.GUARDIAN_EMAIL);
}

/**
 * Prints the first 3 raw rows of the ContactInfo sheet.
 */
function inspectContactSheetDirectly() {
  console.log('=== Direct ContactInfo Sheet Inspection ===');
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ContactInfo');
    if (!sheet) { console.error('ContactInfo sheet not found'); return; }

    const data = sheet.getDataRange().getValues();
    for (let i = 0; i < Math.min(3, data.length); i++) {
      console.log(`Row ${i}:`, data[i]);
    }
  } catch (error) {
    console.error('Error inspecting sheet:', error);
  }
}

/**
 * Checks ContactInfo column alignment — useful when data appears in wrong fields.
 */
function inspectContactDataAlignment() {
  console.log('=== ContactInfo Data Alignment Check ===');

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ContactInfo');
    if (!sheet) { console.error('ContactInfo sheet not found'); return; }

    const data    = sheet.getDataRange().getValues();
    const headers = data[0];

    console.log('Column mapping:');
    ['A','B','C','D','E','F','G','H','I'].forEach((letter, i) => {
      console.log(`  ${letter}: "${headers[i]}"`);
    });

    if (data.length > 1) {
      const row = data[1];
      console.log('\nSample row 2:');
      headers.forEach((header, i) => console.log(`  ${header}: "${row[i]}"`));

      console.log('\nData type checks:');
      console.log('  Parent Name contains phone?', /^\(\d{3}\)/.test(row[4]));
      console.log('  Notification Phone contains name?', /^[A-Za-z]/.test(row[5]));
      console.log('  Guardian 1 Email looks like email?', /@/.test(row[6]));
    }

  } catch (error) {
    console.error('Error inspecting alignment:', error);
  }
}

/**
 * Tests ContactDataLoader output — shows key fields for the first 2 records.
 */
function testContactDataLoader() {
  console.log('=== Testing ContactDataLoader ===');

  try {
    const loader = new ContactDataLoader();
    const data   = loader.loadData();

    console.log(`Loaded ${data.size} contact records`);

    let count = 0;
    for (const [studentId, contactData] of data) {
      if (count >= 2) break;
      console.log(`\n--- Student ID: ${studentId} ---`);
      console.log(`Parent Name:      "${contactData['Parent Name']}"`);
      console.log(`Guardian 1 Email: "${contactData['Guardian 1 Email']}"`);
      console.log(`Student Email:    "${contactData['Student Email']}"`);
      console.log(`All keys: ${Object.keys(contactData).join(', ')}`);
      count++;
    }

  } catch (error) {
    console.error('Error testing ContactDataLoader:', error);
  }
}

/**
 * Quick end-to-end system health check.
 */
function validateSheetIntegrity() {
  console.log('=== Sheet Integrity Check ===');

  const requiredSheets = [
    SHEET_NAMES.CONTACT_INFO,
    SHEET_NAMES.SCHEDULES,
    SHEET_NAMES.ENTRY_WITHDRAWAL,
    SHEET_NAMES.TENTATIVE_V2
  ];

  requiredSheets.forEach(sheetName => {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      console.log(`${sheet ? '✅' : '❌'} ${sheetName}: ${sheet ? 'EXISTS' : 'MISSING'}`);
    } catch (error) {
      console.log(`❌ ${sheetName}: ERROR - ${error.message}`);
    }
  });
}
