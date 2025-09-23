/**
 * @fileoverview Quick diagnostic to check the exact column headers in Form Responses 2.
 * 
 * This diagnostic helps identify the exact column name in column F that contains
 * the placement days data.
 * 
 * @author Alvaro Gomez
 * @version 1.0.0
 * @since 2025-08-05
 */

/**
 * Checks the exact column headers in Form Responses 2, particularly column F.
 */
function checkFormResponses2Headers() {
  console.log('=== CHECKING FORM RESPONSES 2 HEADERS ===');
  
  try {
    // Access the external registration spreadsheet
    const externalSpreadsheetId = EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE;
    console.log('External Spreadsheet ID:', externalSpreadsheetId);
    
    const externalSpreadsheet = SpreadsheetApp.openById(externalSpreadsheetId);
    const sheet = externalSpreadsheet.getSheetByName(SHEET_NAMES.REGISTRATIONS); // 'Form Responses 2'
    
    if (!sheet) {
      console.log('❌ Form Responses 2 sheet not found');
      return;
    }
    
    console.log('✅ Form Responses 2 sheet found');
    
    // Get all headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    console.log('\n=== ALL COLUMN HEADERS ===');
    headers.forEach((header, index) => {
      const columnLetter = String.fromCharCode(65 + index); // A, B, C, etc.
      if (index === 5) { // Column F (0-indexed = 5)
        console.log(`*** ${columnLetter}${index + 1}. "${header}" *** (This is column F)`);
      } else {
        console.log(`${columnLetter}${index + 1}. "${header}"`);
      }
    });
    
    // Specifically highlight column F
    if (headers.length > 5) {
      console.log('\n=== COLUMN F DETAILS ===');
      console.log(`Column F header: "${headers[5]}"`);
      console.log(`Header length: ${headers[5].length} characters`);
      console.log(`Header type: ${typeof headers[5]}`);
      
      // Check for common variations
      const columnFHeader = headers[5];
      if (columnFHeader.toLowerCase().includes('placement')) {
        console.log('✅ Column F contains "placement" keyword');
      }
      if (columnFHeader.toLowerCase().includes('days')) {
        console.log('✅ Column F contains "days" keyword');
      }
    } else {
      console.log('❌ Sheet does not have column F');
    }
    
    // Sample some data from column F
    console.log('\n=== SAMPLE DATA FROM COLUMN F ===');
    const sampleSize = Math.min(5, sheet.getLastRow() - 1);
    for (let i = 2; i <= sampleSize + 1; i++) { // Start from row 2 (skip header)
      const cellValue = sheet.getRange(i, 6).getValue(); // Column F = column 6
      console.log(`Row ${i}: "${cellValue}" (${typeof cellValue})`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

/**
 * Quick fix: Updates the script to use the correct column name for placement days.
 * Call this after you identify the correct column header name.
 */
function suggestColumnNameFix(actualColumnName) {
  console.log('=== SUGGESTED FIX ===');
  console.log(`The script is currently looking for: "Placement Days"`);
  console.log(`The actual column name is: "${actualColumnName}"`);
  console.log('');
  console.log('To fix this issue, you need to update the code in:');
  console.log('src/writers/tentativeRowBuilder.js');
  console.log('');
  console.log('Change this line:');
  console.log('  const placementDays = registrationEntry?.["Placement Days"];');
  console.log('');
  console.log('To this:');
  console.log(`  const placementDays = registrationEntry?.["${actualColumnName}"];`);
}