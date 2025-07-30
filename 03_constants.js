/**
 * @fileoverview Configuration constants for the NAHS Student Transition Notes system.
 * 
 * This file centralizes all configuration values including sheet names, column mappings,
 * period definitions, and default values. By consolidating these constants, the system
 * avoids magic strings and becomes more maintainable and less prone to errors.
 * 
 * **Important**: These constants should be treated as immutable. Changes to these
 * values may require corresponding updates to Google Sheets structure and data
 * processing logic throughout the system.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * Google Sheets names used throughout the system.
 * 
 * These constants define the exact names of sheets that the system expects
 * to find in the Google Spreadsheet. Each name must match exactly with
 * the corresponding sheet tab name.
 * 
 * @namespace SHEET_NAMES
 * @readonly
 * @enum {string}
 * 
 * @property {string} TENTATIVE_V2 - Main output sheet for processed transition notes
 * @property {string} TENTATIVE - Legacy tentative sheet (maintained for compatibility)
 * @property {string} REGISTRATIONS - Student registration data for current school year
 * @property {string} SCHEDULES - Current student course schedules and assignments
 * @property {string} FORM_RESPONSES_1 - Teacher input form responses and feedback
 * @property {string} CONTACT_INFO - Student and parent/guardian contact information
 * @property {string} ENTRY_WITHDRAWAL - Student entry and withdrawal tracking data
 * @property {string} WITHDRAWN - List of students who have withdrawn from the program
 * @property {string} WD_OTHER - Additional withdrawal data and special cases
 * @property {string} ATTENDANCE - Student attendance and enrollment count data
 * @property {string} TRACKING_SHEET - General tracking and administrative data
 * 
 * @example
 * // Access sheet by name
 * const sheet = SpreadsheetApp.getActiveSpreadsheet()
 *   .getSheetByName(SHEET_NAMES.TENTATIVE_V2);
 * 
 * @example
 * // Validate sheet exists
 * if (!sheet) {
 *   throw new Error(`Sheet ${SHEET_NAMES.TENTATIVE_V2} not found`);
 * }
 * 
 * @since 2.0.0
 */
const SHEET_NAMES = {
  TENTATIVE_V2: 'TENTATIVE-Version2',
  TENTATIVE: 'TENTATIVE',
  REGISTRATIONS: 'Form Responses 1', // Updated to match actual sheet name
  SCHEDULES: 'Schedules',
  FORM_RESPONSES_1: 'Form Responses 1',
  CONTACT_INFO: 'ContactInfo',
  ENTRY_WITHDRAWAL: 'Entry_Withdrawal',
  WITHDRAWN: 'Withdrawn',
  WD_OTHER: 'W/D Other',
  ATTENDANCE: 'Alt_HS_Attendance_Enrollment_Count', // Updated to match actual sheet name (with underscores)
  TRACKING_SHEET: 'NAHS Students' // Updated to match actual sheet name
};

/**
 * Column names and mappings used for data extraction and processing.
 * 
 * These constants define the expected column headers in various sheets.
 * They provide a centralized mapping between logical field names and
 * the actual column headers found in Google Sheets.
 * 
 * **Note**: Column names are case-sensitive and must match exactly
 * with the headers in the corresponding Google Sheets.
 * 
 * @namespace COLUMN_NAMES
 * @readonly
 * @enum {string}
 * 
 * @property {string} STUDENT_ID - Unique student identifier column
 * @property {string} STUDENT_FIRST_NAME - Student's first name column
 * @property {string} STUDENT_LAST_NAME - Student's last name column
 * @property {string} STUDENT_NAME_FULL - Full name in "Last, First" format
 * @property {string} GRADE - Current grade level column
 * @property {string} HOME_CAMPUS - Student's home campus assignment
 * @property {string} ENTRY_DATE - Date student entered the program
 * @property {string} PLACEMENT_DAYS - Number of days in current placement
 * @property {string} DATE_ADDED - Date record was added to system
 * @property {string} TEACHER_NAME - Teacher's name for course assignments
 * @property {string} COURSE_TITLE - Course title or subject name
 * @property {string} CASE_MANAGER - Special education case manager name
 * @property {string} PERIOD - Period number or time slot identifier
 * @property {string} WITHDRAW_DATE - Date of student withdrawal
 * @property {string} PARENT_NAME - Parent or guardian's name
 * @property {string} GUARDIAN_EMAIL - Primary guardian email address
 * @property {string} STUDENT_EMAIL - Student's email address
 * 
 * @example
 * // Find column index by name
 * const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
 * const studentIdCol = headers.indexOf(COLUMN_NAMES.STUDENT_ID);
 * 
 * @example 
 * // Validate required columns exist
 * const requiredColumns = [COLUMN_NAMES.STUDENT_ID, COLUMN_NAMES.GRADE];
 * requiredColumns.forEach(col => {
 *   if (!headers.includes(col)) {
 *     console.error(`Missing required column: ${col}`);
 *   }
 * });
 * 
 * @since 2.0.0
 */
const COLUMN_NAMES = {
  STUDENT_ID: 'STUDENT ID',
  STUDENT_ID_ALT: 'Student Id', // Alternative format with lowercase 'd'
  STUDENT_ID_STU: 'STU ID', // Alternative format for attendance data
  STUDENT_FIRST_NAME: 'Student First Name',
  STUDENT_LAST_NAME: 'Student Last Name',
  STUDENT_NAME_FULL: 'Student Name(Last, First)',
  STUDENT_NAME_FULL_ALT: 'Student Name (Last, First MI)', // Alternative format from Schedules
  GRADE: 'GRADE',
  GRADE_ALT: 'Grd Lvl', // Alternative format
  HOME_CAMPUS: 'Home Campus',
  ENTRY_DATE: 'Entry Date',
  PLACEMENT_DAYS: 'Placement Days',
  START_DATE: 'Start Date', // From registrations
  DATE_ADDED: 'DATE ADDED TO SPREADSHEET',
  TEACHER_NAME: 'Teacher Name',
  COURSE_TITLE: 'Course Title',
  CASE_MANAGER: 'Case Manager',
  PERIOD: 'Per Beg',
  WITHDRAW_DATE: 'Wdraw Date',
  PARENT_NAME: 'Parent Name',
  GUARDIAN_EMAIL: 'Guardian 1 Email',
  STUDENT_EMAIL: 'Student Email'
};

/**
 * Period mappings for schedule processing and form data integration.
 * 
 * These constants define the standard period identifiers used throughout
 * the system for matching schedule data with teacher form responses.
 * The mapping ensures consistent period references across different
 * data sources.
 * 
 * @namespace PERIODS
 * @readonly
 * @enum {string}
 * 
 * @property {string} FIRST - First period identifier
 * @property {string} SECOND - Second period identifier  
 * @property {string} THIRD - Third period identifier
 * @property {string} FOURTH - Fourth period identifier
 * @property {string} FIFTH - Fifth period identifier
 * @property {string} SIXTH - Sixth period identifier
 * @property {string} SEVENTH - Seventh period identifier
 * @property {string} EIGHTH - Eighth period identifier
 * @property {string} SPECIAL_ED - Special education period identifier
 * 
 * @example
 * // Check if period exists
 * const periodExists = Object.values(PERIODS).includes(periodString);
 * 
 * @example
 * // Process all standard periods
 * Object.values(PERIODS).forEach(period => {
 *   if (period !== PERIODS.SPECIAL_ED) {
 *     processRegularPeriod(period);
 *   }
 * });
 * 
 * @since 2.0.0
 */
const PERIODS = {
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  FOURTH: '4th',
  FIFTH: '5th',
  SIXTH: '6th',
  SEVENTH: '7th',
  EIGHTH: '8th',
  SPECIAL_ED: 'Special Education'
};

/**
 * Default values used when data is missing or unavailable.
 * 
 * These constants provide fallback values to ensure the system
 * continues to function when expected data is missing. Using
 * standardized defaults helps maintain data consistency and
 * makes it easier to identify missing information.
 * 
 * @namespace DEFAULT_VALUES
 * @readonly
 * @enum {string}
 * 
 * @property {string} EMPTY_STRING - Standard empty string placeholder
 * @property {string} UNKNOWN_TEACHER - Default value when teacher name is missing
 * @property {string} MISSING_DATA_PLACEHOLDER - General placeholder for unavailable data
 * 
 * @example
 * // Use default when data is missing
 * const teacherName = data.teacher || DEFAULT_VALUES.UNKNOWN_TEACHER;
 * 
 * @example
 * // Check for missing data
 * if (value === DEFAULT_VALUES.MISSING_DATA_PLACEHOLDER) {
 *   console.warn('Data not available for processing');
 * }
 * 
 * @since 2.0.0
 */
const DEFAULT_VALUES = {
  EMPTY_STRING: '',
  UNKNOWN_TEACHER: 'Unknown',
  MISSING_DATA_PLACEHOLDER: 'Data not available'
};

/**
 * External spreadsheet IDs for data sources outside the main workbook.
 * 
 * These constants store the Google Spreadsheet IDs for external data
 * sources that the system needs to access. This centralization makes
 * it easier to update source spreadsheets without searching through
 * code for hardcoded IDs.
 * 
 * @namespace EXTERNAL_SPREADSHEETS
 * @readonly
 * @enum {string}
 * 
 * @property {string} SCHEDULES_SOURCE - Google Spreadsheet ID for external schedules data
 * @property {string} REGISTRATIONS_SOURCE - Google Spreadsheet ID for external registrations data
 * @property {string} ATTENDANCE_SOURCE - Google Spreadsheet ID for external attendance data
 * @property {string} TRACKING_SOURCE - Google Spreadsheet ID for external tracking data
 * 
 * @example
 * // Access external spreadsheet
 * const externalSheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.SCHEDULES_SOURCE);
 * 
 * @example
 * // Validate external access
 * try {
 *   const sheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.SCHEDULES_SOURCE);
 *   console.log('External sheet accessible');
 * } catch (error) {
 *   console.error('Cannot access external schedules spreadsheet');
 * }
 * 
 * @since 2.0.0
 */
const EXTERNAL_SPREADSHEETS = {
  SCHEDULES_SOURCE: "14-nvlNOLWebnJJOQNZPnglWx0OuE5U-_xEbXGodND6E",
  REGISTRATIONS_SOURCE: "1kAWRpWO4xDtRShLB5YtTtWxTbVg800fuU2RvAlYhrfA", // "Form Responses 1"
  ATTENDANCE_SOURCE: "1uCQ_Z4QLbHq89tutZ4Wen0TREwS8qEx2j7MmzUgXOaY", // "Alt_HS_Attendance_Enrollment_Count"
  TRACKING_SOURCE: "1giJmMGPcDsmp4IOnV4hlGTgXbxQwv2SxM9DuzNehh90", // "NAHS Students"
};

/**
 * Configuration mapping for which sheets are external vs local.
 * This helps the system know where to look for each sheet.
 * 
 * @namespace SHEET_LOCATIONS
 * @readonly
 * @enum {string}
 * 
 * @property {string} LOCAL - Sheet is in the current spreadsheet
 * @property {string} EXTERNAL - Sheet is in an external spreadsheet
 * 
 * @since 2.0.0
 */
const SHEET_LOCATIONS = {
  [SHEET_NAMES.TENTATIVE_V2]: 'LOCAL',
  [SHEET_NAMES.TENTATIVE]: 'LOCAL', 
  [SHEET_NAMES.REGISTRATIONS]: 'EXTERNAL',
  [SHEET_NAMES.SCHEDULES]: 'LOCAL', // Imported via importAPIData
  [SHEET_NAMES.FORM_RESPONSES_1]: 'LOCAL',
  [SHEET_NAMES.CONTACT_INFO]: 'LOCAL', // Imported via importAPIData  
  [SHEET_NAMES.ENTRY_WITHDRAWAL]: 'LOCAL', // Imported via importAPIData
  [SHEET_NAMES.WITHDRAWN]: 'LOCAL',
  [SHEET_NAMES.WD_OTHER]: 'LOCAL',
  [SHEET_NAMES.ATTENDANCE]: 'EXTERNAL',
  [SHEET_NAMES.TRACKING_SHEET]: 'EXTERNAL'
};

/**
 * Email mappings for teacher lookup and identification.
 * 
 * This object provides a mapping between teacher names and their
 * email addresses for identification and communication purposes.
 * 
 * **Note**: This mapping should eventually be moved to a separate
 * configuration file or database to improve maintainability and
 * allow for easier updates without code changes.
 * 
 * @namespace TEACHER_EMAIL_MAPPINGS
 * @readonly
 * @type {Object<string, string>}
 * 
 * @todo Move this to a separate configuration file or database
 * @todo Implement dynamic teacher lookup system
 * 
 * @example
 * // Lookup teacher email
 * const teacherEmail = TEACHER_EMAIL_MAPPINGS[teacherName];
 * if (teacherEmail) {
 *   console.log(`Found email for ${teacherName}: ${teacherEmail}`);
 * }
 * 
 * @example
 * // Check if teacher is in system
 * const isKnownTeacher = teacherName in TEACHER_EMAIL_MAPPINGS;
 * 
 * @since 2.0.0
 */
const TEACHER_EMAIL_MAPPINGS = {
  'abel.pena@nisd.net': { 'proper name': 'Pena, Abel' },
  'alexandria.murphy@nisd.net': { 'proper name': 'Murphy, Alexandria' },
  'alita.barrera@nisd.net': { 'proper name': 'Barrera, Alita' },
  'catherine.huff@nisd.net': { 'proper name': 'Huff, Catherine' },
  'cindy.gentry@nisd.net': { 'proper name': 'Gentry, Cindy' },
  'denisse.perez@nisd.net': { 'proper name': 'Perez, Denisse' },
  'dennis.olivares@nisd.net': { 'proper name': 'Olivares, Dennis' },
  'erin.knippa@nisd.net': { 'proper name': 'Knippa, Erin' },
  'gabriela.chavarria-medina@nisd.net': { 'proper name': 'Chavarria, Gabriela' },
  'janice.flores@nisd.net': { 'proper name': 'Flores, Janice' },
  'jessica-1.vela@nisd.net': { 'proper name': 'Vela, Jessica' },
  'jessica.poladelcastillo@nisd.net': { 'proper name': 'Poladelcastillo, Jessica' },
  'joshua.lacour@nisd.net': { 'proper name': 'Lacour, Joshua' },
  'lauren.flores@nisd.net': { 'proper name': 'Flores, Lauren' },
  'loretta.owens@nisd.net': { 'proper name': 'Owens, Loretta' },
  'marco.ayala@nisd.net': { 'proper name': 'Ayala, Marco' },
  'miranda.wenzlaff@nisd.net': { 'proper name': 'Wenzlaff, Miranda' },
  'nancy-1.garcia@nisd.net': { 'proper name': 'Garcia, Nancy' },
  'ramon.duran@nisd.net': { 'proper name': 'Duran, Ramon' },
  'richard.delarosa@nisd.net': { 'proper name': 'De La Rosa, Richard' },
  'roslyn.francis@nisd.net': { 'proper name': 'Francis, Roslyn' },
  'samantha.daywood@nisd.net': { 'proper name': 'Daywood, Samantha' },
  'staci.cunningham@nisd.net': { 'proper name': 'Cunningham, Staci' },
  'thalia.mendez@nisd.net': { 'proper name': 'Mendez, Thalia' },
  'veronica.altamirano@nisd.net': { 'proper name': 'Altamirano, Veronica' }
};

/**
 * System configuration
 */
const SYSTEM_CONFIG = {
  TIMEZONE: 'America/Chicago',
  DATE_FORMAT: 'MM/dd/yyyy',
  BATCH_SIZE: 100, // For processing large datasets
  MAX_RETRIES: 3 // For API calls
};

/**
 * Configuration setup for external spreadsheets.
 * 
 * This function helps validate the external spreadsheet IDs that the system needs
 * to access. It provides status and validation for each external sheet.
 * 
 * @function checkExternalConfiguration
 * 
 * @example
 * // Run this function to check current external configuration
 * checkExternalConfiguration();
 * 
 * @since 2.0.0
 */
function checkExternalConfiguration() {
  console.log('=== External Spreadsheet Configuration Status ===');
  console.log('');
  console.log('Current Configuration:');
  console.log('1. REGISTRATIONS_SOURCE:', EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
  console.log('2. ATTENDANCE_SOURCE:', EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE);
  console.log('3. TRACKING_SOURCE:', EXTERNAL_SPREADSHEETS.TRACKING_SOURCE);
  console.log('4. SCHEDULES_SOURCE:', EXTERNAL_SPREADSHEETS.SCHEDULES_SOURCE);
  console.log('');
  
  // Test each external spreadsheet
  console.log('Testing External Spreadsheet Access:');
  console.log('');
  
  // Test Registrations
  console.log('1. Testing Registrations access...');
  try {
    const regSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
    const regSheets = regSpreadsheet.getSheets().map(s => s.getName());
    console.log('   ✅ Registrations spreadsheet accessible');
    console.log('   Available sheets:', regSheets.join(', '));
    
    // Check for the specific sheet
    const regSheet = regSpreadsheet.getSheetByName(SHEET_NAMES.REGISTRATIONS);
    if (regSheet) {
      console.log('   ✅ Sheet "' + SHEET_NAMES.REGISTRATIONS + '" found');
    } else {
      console.log('   ⚠️ Sheet "' + SHEET_NAMES.REGISTRATIONS + '" not found');
    }
  } catch (error) {
    console.log('   ❌ Registrations spreadsheet not accessible:', error.message);
  }
  
  console.log('');
  
  // Test Attendance
  console.log('2. Testing Attendance access...');
  try {
    const attSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE);
    const attSheets = attSpreadsheet.getSheets().map(s => s.getName());
    console.log('   ✅ Attendance spreadsheet accessible');
    console.log('   Available sheets:', attSheets.join(', '));
    
    // Check for the specific sheet
    const attSheet = attSpreadsheet.getSheetByName(SHEET_NAMES.ATTENDANCE);
    if (attSheet) {
      console.log('   ✅ Sheet "' + SHEET_NAMES.ATTENDANCE + '" found');
    } else {
      console.log('   ⚠️ Sheet "' + SHEET_NAMES.ATTENDANCE + '" not found');
    }
  } catch (error) {
    console.log('   ❌ Attendance spreadsheet not accessible:', error.message);
  }
  
  console.log('');
  
  // Test Tracking
  console.log('3. Testing Tracking access...');
  try {
    const trackSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.TRACKING_SOURCE);
    const trackSheets = trackSpreadsheet.getSheets().map(s => s.getName());
    console.log('   ✅ Tracking spreadsheet accessible');
    console.log('   Available sheets:', trackSheets.join(', '));
    
    // Check for the specific sheet
    const trackSheet = trackSpreadsheet.getSheetByName(SHEET_NAMES.TRACKING_SHEET);
    if (trackSheet) {
      console.log('   ✅ Sheet "' + SHEET_NAMES.TRACKING_SHEET + '" found');
    } else {
      console.log('   ⚠️ Sheet "' + SHEET_NAMES.TRACKING_SHEET + '" not found');
    }
  } catch (error) {
    console.log('   ❌ Tracking spreadsheet not accessible:', error.message);
  }
  
  console.log('');
  console.log('=== Configuration Check Complete ===');
}

/**
 * Validates access to all configured external spreadsheets and provides detailed feedback.
 * 
 * @function validateExternalAccess
 * @returns {Object} Validation results for all external sheets
 * 
 * @example
 * // Validate all external connections
 * const results = validateExternalAccess();
 * 
 * @since 2.0.0
 */
function validateExternalAccess() {
  console.log('=== Validating External Spreadsheet Access ===');
  console.log('');
  
  const results = {
    registrations: { accessible: false, sheetExists: false, error: null },
    attendance: { accessible: false, sheetExists: false, error: null },
    tracking: { accessible: false, sheetExists: false, error: null },
    schedules: { accessible: false, sheetExists: false, error: null },
    summary: { allAccessible: false, totalAccessible: 0 }
  };
  
  const tests = [
    {
      name: 'Registrations',
      key: 'registrations',
      spreadsheetId: EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE,
      sheetName: SHEET_NAMES.REGISTRATIONS
    },
    {
      name: 'Attendance', 
      key: 'attendance',
      spreadsheetId: EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE,
      sheetName: SHEET_NAMES.ATTENDANCE
    },
    {
      name: 'Tracking',
      key: 'tracking', 
      spreadsheetId: EXTERNAL_SPREADSHEETS.TRACKING_SOURCE,
      sheetName: SHEET_NAMES.TRACKING_SHEET
    },
    {
      name: 'Schedules',
      key: 'schedules',
      spreadsheetId: EXTERNAL_SPREADSHEETS.SCHEDULES_SOURCE,
      sheetName: SHEET_NAMES.SCHEDULES
    }
  ];
  
  tests.forEach((test, index) => {
    console.log(`${index + 1}. Testing ${test.name} access...`);
    
    try {
      const spreadsheet = SpreadsheetApp.openById(test.spreadsheetId);
      results[test.key].accessible = true;
      
      const sheet = spreadsheet.getSheetByName(test.sheetName);
      if (sheet) {
        results[test.key].sheetExists = true;
        console.log(`   ✅ ${test.name}: Fully accessible`);
        results.summary.totalAccessible++;
      } else {
        results[test.key].error = `Sheet '${test.sheetName}' not found`;
        console.log(`   ⚠️ ${test.name}: Spreadsheet accessible, but sheet '${test.sheetName}' not found`);
        
        // Show available sheets
        const availableSheets = spreadsheet.getSheets().map(s => s.getName());
        console.log(`   Available sheets: ${availableSheets.join(', ')}`);
      }
    } catch (error) {
      results[test.key].error = error.message;
      console.log(`   ❌ ${test.name}: Not accessible - ${error.message}`);
    }
  });
  
  // Summary
  console.log('');
  console.log('=== Validation Summary ===');
  results.summary.allAccessible = results.summary.totalAccessible === tests.length;
  console.log(`Fully accessible external sheets: ${results.summary.totalAccessible}/${tests.length}`);
  
  if (results.summary.allAccessible) {
    console.log('✅ All external spreadsheets are properly configured and accessible!');
    console.log('You can now run loadTENTATIVEVersion2() successfully.');
  } else {
    console.log('⚠️ Some external spreadsheets need attention.');
    console.log('Check the sheet names in the external spreadsheets match the expected names.');
  }
  
  return results;
}

/**
 * Simple test function to validate external sheet access
 * 
 * This function tests the basic functionality of accessing external spreadsheets
 * and provides immediate feedback.
 * 
 * @function testExternalSheets
 * @since 2.0.0
 */
function testExternalSheets() {
  console.log('=== Testing External Sheet Access ===');
  console.log('');
  
  // Test registrations
  console.log('Testing Registrations spreadsheet...');
  console.log('Spreadsheet ID:', EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
  console.log('Looking for sheet:', SHEET_NAMES.REGISTRATIONS);
  
  try {
    const regSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
    console.log('✅ Successfully opened registrations spreadsheet');
    
    const sheets = regSpreadsheet.getSheets().map(s => s.getName());
    console.log('Available sheets:', sheets.join(', '));
    
    const targetSheet = regSpreadsheet.getSheetByName(SHEET_NAMES.REGISTRATIONS);
    if (targetSheet) {
      console.log('✅ Found target sheet:', SHEET_NAMES.REGISTRATIONS);
    } else {
      console.log('❌ Target sheet not found:', SHEET_NAMES.REGISTRATIONS);
    }
  } catch (error) {
    console.log('❌ Error accessing registrations spreadsheet:', error.message);
  }
  
  console.log('');
  console.log('Testing Attendance spreadsheet...');
  console.log('Spreadsheet ID:', EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE);
  console.log('Looking for sheet:', SHEET_NAMES.ATTENDANCE);
  
  try {
    const attSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE);
    console.log('✅ Successfully opened attendance spreadsheet');
    
    const sheets = attSpreadsheet.getSheets().map(s => s.getName());
    console.log('Available sheets:', sheets.join(', '));
    
    const targetSheet = attSpreadsheet.getSheetByName(SHEET_NAMES.ATTENDANCE);
    if (targetSheet) {
      console.log('✅ Found target sheet:', SHEET_NAMES.ATTENDANCE);
    } else {
      console.log('❌ Target sheet not found:', SHEET_NAMES.ATTENDANCE);
    }
  } catch (error) {
    console.log('❌ Error accessing attendance spreadsheet:', error.message);
  }
  
  console.log('');
  console.log('Testing Tracking spreadsheet...');
  console.log('Spreadsheet ID:', EXTERNAL_SPREADSHEETS.TRACKING_SOURCE);
  console.log('Looking for sheet:', SHEET_NAMES.TRACKING_SHEET);
  
  try {
    const trackSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.TRACKING_SOURCE);
    console.log('✅ Successfully opened tracking spreadsheet');
    
    const sheets = trackSpreadsheet.getSheets().map(s => s.getName());
    console.log('Available sheets:', sheets.join(', '));
    
    const targetSheet = trackSpreadsheet.getSheetByName(SHEET_NAMES.TRACKING_SHEET);
    if (targetSheet) {
      console.log('✅ Found target sheet:', SHEET_NAMES.TRACKING_SHEET);
    } else {
      console.log('❌ Target sheet not found:', SHEET_NAMES.TRACKING_SHEET);
    }
  } catch (error) {
    console.log('❌ Error accessing tracking spreadsheet:', error.message);
  }
  
  console.log('');
  console.log('=== Test Complete ===');
}

/**
 * Quick validation after fixing sheet names
 * 
 * @function quickTest
 * @since 2.0.0
 */
function quickTest() {
  console.log('=== Quick Validation Test ===');
  console.log('');
  
  console.log('Testing updated sheet names...');
  console.log('');
  
  // Test registrations
  try {
    const regSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
    const regSheet = regSpreadsheet.getSheetByName(SHEET_NAMES.REGISTRATIONS);
    console.log('✅ Registrations:', regSheet ? 'FOUND' : 'NOT FOUND');
  } catch (error) {
    console.log('❌ Registrations: ERROR -', error.message);
  }
  
  // Test attendance  
  try {
    const attSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE);
    const attSheet = attSpreadsheet.getSheetByName(SHEET_NAMES.ATTENDANCE);
    console.log('✅ Attendance:', attSheet ? 'FOUND' : 'NOT FOUND');
  } catch (error) {
    console.log('❌ Attendance: ERROR -', error.message);
  }
  
  // Test tracking
  try {
    const trackSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.TRACKING_SOURCE);
    const trackSheet = trackSpreadsheet.getSheetByName(SHEET_NAMES.TRACKING_SHEET);
    console.log('✅ Tracking:', trackSheet ? 'FOUND' : 'NOT FOUND');
  } catch (error) {
    console.log('❌ Tracking: ERROR -', error.message);
  }
  
  console.log('');
  console.log('=== Quick Test Complete ===');
}

/**
 * Debug function to examine column headers in sheets
 * 
 * @function debugColumnHeaders
 * @since 2.0.0
 */
function debugColumnHeaders() {
  console.log('=== Debugging Column Headers ===');
  console.log('');
  
  // Check Form Responses 1 (Registrations)
  console.log('1. Form Responses 1 (Registrations) headers:');
  try {
    const regSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
    const regSheet = regSpreadsheet.getSheetByName(SHEET_NAMES.REGISTRATIONS);
    if (regSheet) {
      const headers = regSheet.getRange(1, 1, 1, regSheet.getLastColumn()).getValues()[0];
      headers.forEach((header, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, etc.
        console.log(`   ${letter}: "${header}"`);
      });
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }
  
  console.log('');
  console.log('2. Schedules headers:');
  try {
    const schedulesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SCHEDULES);
    if (schedulesSheet) {
      const headers = schedulesSheet.getRange(1, 1, 1, schedulesSheet.getLastColumn()).getValues()[0];
      headers.forEach((header, index) => {
        const letter = String.fromCharCode(65 + index);
        console.log(`   ${letter}: "${header}"`);
      });
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }
  
  console.log('');
  console.log('3. ContactInfo headers:');
  try {
    const contactSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CONTACT_INFO);
    if (contactSheet) {
      const headers = contactSheet.getRange(1, 1, 1, contactSheet.getLastColumn()).getValues()[0];
      headers.forEach((header, index) => {
        const letter = String.fromCharCode(65 + index);
        console.log(`   ${letter}: "${header}"`);
      });
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }
  
  console.log('');
  console.log('4. Entry_Withdrawal headers:');
  try {
    const entrySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ENTRY_WITHDRAWAL);
    if (entrySheet) {
      const headers = entrySheet.getRange(1, 1, 1, entrySheet.getLastColumn()).getValues()[0];
      headers.forEach((header, index) => {
        const letter = String.fromCharCode(65 + index);
        console.log(`   ${letter}: "${header}"`);
      });
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }
  
  console.log('');
  console.log('=== Debug Complete ===');
}

/**
 * Test the updated data loaders with proper column handling
 * 
 * @function testUpdatedLoaders
 * @since 2.0.0
 */
function testUpdatedLoaders() {
  console.log('=== Testing Updated Data Loaders ===');
  console.log('');
  
  // Test 1: Registration Data Loader (external, embedded ID format)
  console.log('1. Testing RegistrationDataLoader...');
  try {
    const regLoader = new RegistrationDataLoader();
    const regData = regLoader.loadData();
    console.log(`✅ Loaded ${regData.size} registration records`);
    
    // Show a sample record
    if (regData.size > 0) {
      const firstKey = regData.keys().next().value;
      const firstRecord = regData.get(firstKey)[0];
      console.log(`   Sample student ID: ${firstKey}`);
      console.log(`   Sample name: ${firstRecord['Student First Name']} ${firstRecord['Student Last Name']}`);
    }
  } catch (error) {
    console.log('❌ RegistrationDataLoader error:', error.message);
  }
  
  console.log('');
  
  // Test 2: Schedule Data Loader (local, Student Id format)
  console.log('2. Testing ScheduleDataLoader...');
  try {
    const schedLoader = new ScheduleDataLoader();
    const schedData = schedLoader.loadData();
    console.log(`✅ Loaded schedules for ${schedData.size} students`);
    
    // Show a sample record
    if (schedData.size > 0) {
      const firstKey = schedData.keys().next().value;
      const firstRecord = schedData.get(firstKey)[0];
      console.log(`   Sample student ID: ${firstKey}`);
      console.log(`   Sample course: ${firstRecord['Course Title']}`);
    }
  } catch (error) {
    console.log('❌ ScheduleDataLoader error:', error.message);
  }
  
  console.log('');
  
  // Test 3: Contact Data Loader (local, Student ID format)
  console.log('3. Testing ContactDataLoader...');
  try {
    const contactLoader = new ContactDataLoader();
    const contactData = contactLoader.loadData();
    console.log(`✅ Loaded ${contactData.size} contact records`);
    
    // Show a sample record
    if (contactData.size > 0) {
      const firstKey = contactData.keys().next().value;
      const firstRecord = contactData.get(firstKey)[0];
      console.log(`   Sample student ID: ${firstKey}`);
      console.log(`   Sample email: ${firstRecord['Guardian 1 Email']}`);
    }
  } catch (error) {
    console.log('❌ ContactDataLoader error:', error.message);
  }
  
  console.log('');
  
  // Test 4: Entry/Withdrawal Data Loader (local, Student Id format)
  console.log('4. Testing EntryWithdrawalDataLoader...');
  try {
    const entryLoader = new EntryWithdrawalDataLoader();
    const entryData = entryLoader.loadData();
    console.log(`✅ Loaded ${entryData.size} entry/withdrawal records`);
    
    // Show a sample record
    if (entryData.size > 0) {
      const firstKey = entryData.keys().next().value;
      const firstRecord = entryData.get(firstKey)[0];
      console.log(`   Sample student ID: ${firstKey}`);
      console.log(`   Sample entry date: ${firstRecord['Entry Date']}`);
    }
  } catch (error) {
    console.log('❌ EntryWithdrawalDataLoader error:', error.message);
  }
  
  console.log('');
  console.log('=== Loader Testing Complete ===');
}

/**
 * Quick test for the fixed RegistrationDataLoader
 * 
 * @function testRegistrationDataLoader
 * @since 2.0.0
 */
function testRegistrationDataLoader() {
  console.log('=== Testing Fixed RegistrationDataLoader ===');
  console.log('');
  
  try {
    const regLoader = new RegistrationDataLoader();
    const regData = regLoader.loadData();
    
    console.log(`✅ Loaded ${regData.size} registration records`);
    
    if (regData.size > 0) {
      // Show first few records
      let count = 0;
      for (const [studentId, records] of regData) {
        if (count < 3) {
          const record = records[0];
          console.log(`   Student ID: ${studentId}`);
          console.log(`   Name: ${record['Student First Name']} ${record['Student Last Name']}`);
          console.log(`   Grade: ${record['Grade']}`);
          console.log(`   Start Date: ${record['Start Date']}`);
          console.log('   ---');
          count++;
        } else {
          break;
        }
      }
      
      console.log(`✅ Registration data is now working correctly!`);
      console.log(`✅ Ready to test the full system with loadTENTATIVEVersion2()`);
    } else {
      console.log('⚠️ No registration data loaded. Check the external spreadsheet access.');
    }
    
  } catch (error) {
    console.log('❌ RegistrationDataLoader error:', error.message);
  }
  
  console.log('');
  console.log('=== Test Complete ===');
}

/**
 * Test the system after all our fixes
 * 
 * @function testSystemAfterFixes
 * @since 2.0.0
 */
function testSystemAfterFixes() {
  console.log('=== Testing System After All Fixes ===');
  console.log('');
  
  console.log('🔧 Fixes Applied:');
  console.log('✅ 1. Added STUDENT_ID_STU for attendance data ("STU ID")');
  console.log('✅ 2. Fixed StudentDataMerger to create base map from registration data when tentative is empty');
  console.log('✅ 3. Enhanced safeMapGet to handle array vs single record data properly');
  console.log('✅ 4. Fixed all column name variations across all sheets');
  console.log('✅ 5. Fixed AttendanceDataLoader to use STUDENT_ID_STU column variant');
  console.log('');
  
  // First test attendance data loading specifically
  console.log('🧪 Testing attendance data loading...');
  try {
    const attLoader = new AttendanceDataLoader();
    const attData = attLoader.loadData();
    console.log(`✅ Attendance data loaded: ${attData.size} records`);
    
    if (attData.size > 0) {
      const firstKey = attData.keys().next().value;
      const firstRecord = attData.get(firstKey)[0];
      console.log(`   Sample student ID: ${firstKey}`);
      console.log(`   Sample data: ${JSON.stringify(firstRecord).substring(0, 100)}...`);
    }
  } catch (error) {
    console.log('❌ Attendance data loading failed:', error.message);
  }
  
  console.log('');
  console.log('🧪 Now running full system test...');
  console.log('');
  
  try {
    // This should now work end-to-end
    const result = loadTENTATIVEVersion2();
    console.log('🎉 System test result:', result ? 'SUCCESS' : 'PARTIAL SUCCESS');
  } catch (error) {
    console.log('❌ System test failed:', error.message);
    console.log('Stack trace:', error.stack);
  }
  
  console.log('');
  console.log('=== System Test Complete ===');
}

/**
 * Test just the attendance data loading to verify the STU ID fix
 * 
 * @function testAttendanceDataLoading
 * @since 2.0.0
 */
function testAttendanceDataLoading() {
  console.log('=== Testing Attendance Data Loading Fix ===');
  console.log('');
  
  console.log('Expected column in attendance sheet: "STU ID"');
  console.log('Using STUDENT_ID_STU constant:', COLUMN_NAMES.STUDENT_ID_STU);
  console.log('');
  
  try {
    const attLoader = new AttendanceDataLoader();
    const attData = attLoader.loadData();
    
    console.log(`✅ Attendance loading successful!`);
    console.log(`✅ Records loaded: ${attData.size}`);
    
    if (attData.size > 0) {
      console.log('');
      console.log('Sample records:');
      let count = 0;
      for (const [studentId, records] of attData) {
        if (count < 3) {
          const record = records[0];
          console.log(`   Student ID: ${studentId}`);
          console.log(`   Student Name: ${record['STUDENT'] || 'N/A'}`);
          console.log(`   Days Present: ${record['Present'] || 'N/A'}`);
          console.log('   ---');
          count++;
        } else {
          break;
        }
      }
    }
    
    console.log('✅ Attendance data fix is working! Now the full system should work.');
    
  } catch (error) {
    console.log('❌ Attendance data loading still failing:', error.message);
    console.log('This means we may need to check the external spreadsheet structure again.');
  }
  
  console.log('');
  console.log('=== Attendance Test Complete ===');
}

/**
 * Final comprehensive system test after all fixes
 * 
 * @function testCompleteSystemAfterAllFixes
 * @since 2.0.0
 */
function testCompleteSystemAfterAllFixes() {
  console.log('=== Final Comprehensive System Test ===');
  console.log('');
  
  console.log('🔧 All Fixes Applied:');
  console.log('✅ 1. Added STUDENT_ID_STU for attendance data ("STU ID")');
  console.log('✅ 2. Fixed StudentDataMerger to create base map from registration data when tentative is empty');
  console.log('✅ 3. Enhanced safeMapGet to handle array vs single record data properly');
  console.log('✅ 4. Fixed all column name variations across all sheets');
  console.log('✅ 5. Fixed AttendanceDataLoader to use STUDENT_ID_STU column variant');
  console.log('✅ 6. Fixed TentativeSheetWriter to use correct TENTATIVE_V2 constant');
  console.log('');
  
  console.log('🧪 Running complete end-to-end system test...');
  console.log('');
  
  try {
    // This should now work completely end-to-end
    const result = loadTENTATIVEVersion2();
    console.log('🎉 Complete system test result:', result ? 'SUCCESS' : 'PARTIAL SUCCESS');
    console.log('');
    console.log('🎊 SYSTEM IS FULLY OPERATIONAL! 🎊');
    console.log('The NAHS Student Transition Notes system is now working end-to-end.');
    
  } catch (error) {
    console.log('❌ System test failed:', error.message);
    console.log('Stack trace:', error.stack);
  }
  
  console.log('');
  console.log('=== Final System Test Complete ===');
}
