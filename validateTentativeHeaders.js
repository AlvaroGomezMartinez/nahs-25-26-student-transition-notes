/**
 * @fileoverview Header Validation Utility for TENTATIVE-Version2 Sheet
 * 
 * This utility helps validate that the outputColumnOrder configuration
 * matches the actual headers in the TENTATIVE-Version2 sheet.
 * 
 * @author Alvaro Gomez
 * @version 1.0.0
 * @since 2025-08-03
 */

/**
 * Validates that the TENTATIVE_SHEET_CONFIG.outputColumnOrder matches
 * the actual headers in the TENTATIVE-Version2 sheet.
 * 
 * Run this function to check if your configuration is correct.
 * 
 * @returns {Object} Validation results
 */
function validateTentativeHeaders() {
  try {
    console.log('=== TENTATIVE-Version2 Header Validation ===');
    
    // Get the actual sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(SHEET_NAMES.TENTATIVE_V2);
    
    if (!sheet) {
      return {
        success: false,
        error: `Sheet "${SHEET_NAMES.TENTATIVE_V2}" not found`
      };
    }
    
    // Get actual headers from row 1
    const lastCol = sheet.getLastColumn();
    const actualHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    // Get expected headers from configuration
    const expectedHeaders = TENTATIVE_SHEET_CONFIG.outputColumnOrder;
    
    console.log(`Actual columns in sheet: ${actualHeaders.length}`);
    console.log(`Expected columns in config: ${expectedHeaders.length}`);
    console.log('');
    
    // Compare headers
    const mismatches = [];
    const maxLength = Math.max(actualHeaders.length, expectedHeaders.length);
    
    for (let i = 0; i < maxLength; i++) {
      const actual = actualHeaders[i] || '[MISSING]';
      const expected = expectedHeaders[i] || '[MISSING]';
      
      if (actual !== expected) {
        mismatches.push({
          column: i + 1,
          columnLetter: String.fromCharCode(65 + (i % 26)), // A, B, C, etc.
          actual: actual,
          expected: expected
        });
      }
    }
    
    // Report results
    if (mismatches.length === 0) {
      console.log('✅ SUCCESS: All headers match perfectly!');
      return {
        success: true,
        actualCount: actualHeaders.length,
        expectedCount: expectedHeaders.length,
        mismatches: []
      };
    } else {
      console.log(`❌ FOUND ${mismatches.length} HEADER MISMATCHES:`);
      console.log('');
      
      mismatches.forEach(mismatch => {
        console.log(`Column ${mismatch.column} (${mismatch.columnLetter}):`);
        console.log(`  Actual:   "${mismatch.actual}"`);
        console.log(`  Expected: "${mismatch.expected}"`);
        console.log('');
      });
      
      return {
        success: false,
        actualCount: actualHeaders.length,
        expectedCount: expectedHeaders.length,
        mismatches: mismatches
      };
    }
    
  } catch (error) {
    console.error('Error validating headers:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Quick function to just show the actual headers in TENTATIVE-Version2
 */
function showActualTentativeHeaders() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(SHEET_NAMES.TENTATIVE_V2);
    
    if (!sheet) {
      console.log(`❌ Sheet "${SHEET_NAMES.TENTATIVE_V2}" not found`);
      return;
    }
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    console.log('=== Actual TENTATIVE-Version2 Headers ===');
    headers.forEach((header, index) => {
      const letter = String.fromCharCode(65 + (index % 26));
      console.log(`${letter}: "${header}"`);
    });
    
    return headers;
  } catch (error) {
    console.error('Error reading headers:', error);
  }
}
