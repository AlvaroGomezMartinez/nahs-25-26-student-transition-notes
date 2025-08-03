/**
 * @fileoverview Configuration helper for setting up external spreadsheet access.
 * 
 * This file provides utilities to help configure external spreadsheet IDs
 * and validate external sheet access.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * Configuration setup for external spreadsheets.
 * 
 * This function helps set up the external spreadsheet IDs that the system needs
 * to access. It provides instructions and validation for each external sheet.
 * 
 * @function setupExternalConfiguration
 * 
 * @example
 * // Run this function to get configuration instructions
 * setupExternalConfiguration();
 * 
 * @since 2.0.0
 */
function setupExternalConfiguration() {
  console.log('=== External Spreadsheet Configuration Setup ===');
  console.log('');
  console.log('The NAHS system needs access to the following external spreadsheets:');
  console.log('');
  
  console.log('1. REGISTRATIONS_SOURCE:');
  console.log('   - Sheet name: "Registrations SY 24.25"');
  console.log('   - Current ID: EXTERNAL_SPREADSHEET_ID_FOR_REGISTRATIONS');
  console.log('   - Status: ❌ Not configured');
  console.log('   - Action: Update EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE in 03_constants.js');
  console.log('');
  
  console.log('2. ATTENDANCE_SOURCE:');
  console.log('   - Sheet name: "Alt HS Attendance & Enrollment Count"');
  console.log('   - Current ID: EXTERNAL_SPREADSHEET_ID_FOR_ATTENDANCE');
  console.log('   - Status: ❌ Not configured');
  console.log('   - Action: Update EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE in 03_constants.js');
  console.log('');
  
  console.log('3. TRACKING_SOURCE:');
  console.log('   - Sheet name: "Sheet1"');
  console.log('   - Current ID: EXTERNAL_SPREADSHEET_ID_FOR_TRACKING');
  console.log('   - Status: ❌ Not configured');
  console.log('   - Action: Update EXTERNAL_SPREADSHEETS.TRACKING_SOURCE in 03_constants.js');
  console.log('');
  
  console.log('To configure each external spreadsheet:');
  console.log('1. Open the external spreadsheet in Google Sheets');
  console.log('2. Copy the spreadsheet ID from the URL (between /d/ and /edit)');
  console.log('3. Replace the placeholder ID in 03_constants.js');
  console.log('');
  
  console.log('Example:');
  console.log('From URL: https://docs.google.com/spreadsheets/d/1ABC123DEF456/edit');
  console.log('Spreadsheet ID: 1ABC123DEF456');
  console.log('');
  
  console.log('After configuration, run validateExternalAccess() to test connectivity.');
}

/**
 * Validates access to all configured external spreadsheets.
 * 
 * This function tests connectivity to each external spreadsheet and
 * reports on the accessibility and sheet existence.
 * 
 * @function validateExternalAccess
 * @returns {Object} Validation results for all external sheets
 * 
 * @example
 * // Validate all external connections
 * const results = validateExternalAccess();
 * console.log('Validation results:', results);
 * 
 * @since 2.0.0
 */
function validateExternalAccess() {
  console.log('=== Validating External Spreadsheet Access ===');
  console.log('');
  
  const results = {
    registrations: { configured: false, accessible: false, sheetExists: false },
    attendance: { configured: false, accessible: false, sheetExists: false },
    tracking: { configured: false, accessible: false, sheetExists: false },
    overall: { allConfigured: false, allAccessible: false }
  };
  
  // Test Registrations
  console.log('1. Testing Registrations access...');
  if (EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE && 
      !EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE.includes('EXTERNAL_SPREADSHEET_ID_FOR_')) {
    results.registrations.configured = true;
    try {
      const loader = new RegistrationDataLoader();
      const validation = loader.validateAccess();
      results.registrations.accessible = validation.canAccessSpreadsheet;
      results.registrations.sheetExists = validation.sheetExists;
      
      if (validation.sheetExists) {
        console.log('   ✅ Registrations: Accessible');
      } else {
        console.log('   ⚠️ Registrations: Spreadsheet accessible, but sheet not found');
        console.log('   Error:', validation.error);
      }
    } catch (error) {
      console.log('   ❌ Registrations: Not accessible');
      console.log('   Error:', error.message);
    }
  } else {
    console.log('   ❌ Registrations: Not configured');
  }
  
  // Test Attendance
  console.log('2. Testing Attendance access...');
  if (EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE && 
      !EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE.includes('EXTERNAL_SPREADSHEET_ID_FOR_')) {
    results.attendance.configured = true;
    try {
      const loader = new AttendanceDataLoader();
      const validation = loader.validateAccess();
      results.attendance.accessible = validation.canAccessSpreadsheet;
      results.attendance.sheetExists = validation.sheetExists;
      
      if (validation.sheetExists) {
        console.log('   ✅ Attendance: Accessible');
      } else {
        console.log('   ⚠️ Attendance: Spreadsheet accessible, but sheet not found');
        console.log('   Error:', validation.error);
      }
    } catch (error) {
      console.log('   ❌ Attendance: Not accessible');
      console.log('   Error:', error.message);
    }
  } else {
    console.log('   ❌ Attendance: Not configured');
  }
  
  // Test Tracking
  console.log('3. Testing Tracking access...');
  if (EXTERNAL_SPREADSHEETS.TRACKING_SOURCE && 
      !EXTERNAL_SPREADSHEETS.TRACKING_SOURCE.includes('EXTERNAL_SPREADSHEET_ID_FOR_')) {
    results.tracking.configured = true;
    try {
      const loader = new TrackingDataLoader();
      const validation = loader.validateAccess();
      results.tracking.accessible = validation.canAccessSpreadsheet;
      results.tracking.sheetExists = validation.sheetExists;
      
      if (validation.sheetExists) {
        console.log('   ✅ Tracking: Accessible');
      } else {
        console.log('   ⚠️ Tracking: Spreadsheet accessible, but sheet not found');
        console.log('   Error:', validation.error);
      }
    } catch (error) {
      console.log('   ❌ Tracking: Not accessible');
      console.log('   Error:', error.message);
    }
  } else {
    console.log('   ❌ Tracking: Not configured');
  }
  
  // Summary
  console.log('');
  console.log('=== Summary ===');
  const configuredCount = Object.values(results).slice(0, 3).filter(r => r.configured).length;
  const accessibleCount = Object.values(results).slice(0, 3).filter(r => r.sheetExists).length;
  
  results.overall.allConfigured = configuredCount === 3;
  results.overall.allAccessible = accessibleCount === 3;
  
  console.log(`Configured: ${configuredCount}/3`);
  console.log(`Accessible: ${accessibleCount}/3`);
  
  if (results.overall.allAccessible) {
    console.log('✅ All external spreadsheets are properly configured and accessible!');
  } else if (results.overall.allConfigured) {
    console.log('⚠️ All external spreadsheets are configured but some are not accessible.');
    console.log('Please check permissions and sheet names.');
  } else {
    console.log('❌ External spreadsheets need configuration.');
    console.log('Run setupExternalConfiguration() for instructions.');
  }
  
  return results;
}

/**
 * Quick configuration checker that logs current status.
 * 
 * @function checkExternalConfiguration
 * @since 2.0.0
 */
function checkExternalConfiguration() {
  console.log('=== External Configuration Status ===');
  console.log('Registrations:', EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
  console.log('Attendance:', EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE);
  console.log('Tracking:', EXTERNAL_SPREADSHEETS.TRACKING_SOURCE);
}
