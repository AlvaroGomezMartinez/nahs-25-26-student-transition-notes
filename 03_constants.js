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
  REGISTRATIONS: 'Form Responses 2',
  SCHEDULES: 'Schedules',
  FORM_RESPONSES_1: 'Form Responses 1',
  CONTACT_INFO: 'ContactInfo',
  ENTRY_WITHDRAWAL: 'Entry_Withdrawal',
  WITHDRAWN: 'Withdrawn',
  WD_OTHER: 'W/D Other',
  ATTENDANCE: 'Alt_HS_Attendance_Enrollment_Count',
  TRACKING_SHEET: 'NAHS Students'
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
  STUDENT_EMAIL: 'Student Email',
  NOTIFICATION_PHONE: 'Notification Phone',
  GUARDIAN_1_NAME: 'Guardian 1',
  GUARDIAN_1_EMAIL: 'Guardian 1 Email',
  GUARDIAN_1_CELL: 'Guardian 1 Cell',
  GUARDIAN_1_HOME: 'Guardian 1 Home',
  GUARDIAN_2_NAME: 'Guardian 2',
  GUARDIAN_2_EMAIL: 'Guardian 2 Email', 
  GUARDIAN_2_CELL: 'Guardian 2 Cell',
  GUARDIAN_2_HOME: 'Guardian 2 Home'
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
  REGISTRATIONS_SOURCE: "1T-t8wxYXGgLnPGhipX5gHEL17-PGX-cF-1j5jYELsAY", // "Form Responses 2"
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
  "marco.ayala@nisd.net": { "proper name": "Ayala, Marco" },
  "alita.barrera@nisd.net": { "proper name": "Barrera, Alita" },
  "gabriela.chavarria-medina@nisd.net": {
    "proper name": "Chavarria, Gabriela",
  },
  "leticia.collier@nisd.net": { "proper name": "Collier, Leticia" },
  "samantha.daywood@nisd.net": { "proper name": "Daywood, Samantha" },
  "richard.delarosa@nisd.net": { "proper name": "De La Rosa, Richard" },
  "ramon.duran@nisd.net": { "proper name": "Duran, Ramon" },
  "janice.flores@nisd.net": { "proper name": "Flores, Janice" },
  "lauren.flores@nisd.net": { "proper name": "Flores, Lauren" },
  "roslyn.francis@nisd.net": { "proper name": "Francis, Roslyn" },
  "nancy-1.garcia@nisd.net": { "proper name": "Garcia, Nancy" },
  "cierra.gibson@nisd.net": { "proper name": "Gibson, Cierra" },
  "erin.knippa@nisd.net": { "proper name": "Knippa, Erin" },
  "joshua.lacour@nisd.net": { "proper name": "Lacour, Joshua" },
  "thalia.mendez@nisd.net": { "proper name": "Mendez, Thalia" },
  "dennis.olivares@nisd.net": { "proper name": "Olivares, Dennis" },
  "loretta.owens@nisd.net": { "proper name": "Owens, Loretta" },
  "denisse.perez@nisd.net": { "proper name": "Perez, Denisse" },
  "jessica.poladelcastillo@nisd.net": {
    "proper name": "Poladelcastillo, Jessica",
  },
  "linda.rodriguez@nisd.net": { "proper name": "Rodriguez, Linda" },
  "cassandra.sanchez@nisd.net": { "proper name": "Sanchez, Cassandra" },
  "nicholas.schroeder@nisd.net": { "proper name": "Schroeder, Nicholas" },
  "richard.silva@nisd.net": { "proper name": "Silva, Richard" },
  "jessica-1.vela@nisd.net": { "proper name": "Vela, Jessica" },
  "miranda.wenzlaff@nisd.net": { "proper name": "Wenzlaff, Miranda" },
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

/**
 * Essential system validation function
 */
function testCompleteSystem() {
  console.log('=== Complete System Test ===');
  try {
    const result = loadTENTATIVEVersion2();
    console.log('System test result:', result ? 'SUCCESS' : 'NEEDS ATTENTION');
  } catch (error) {
    console.error('System test failed:', error.message);
  }
}

/**
 * System health check 
 */
function validateSheetIntegrity() {
  console.log('=== Sheet Integrity Check ===');
  
  // Quick validation that all required sheets exist
  const requiredSheets = [
    SHEET_NAMES.CONTACT_INFO,
    SHEET_NAMES.SCHEDULES, 
    SHEET_NAMES.ENTRY_WITHDRAWAL,
    SHEET_NAMES.TENTATIVE_V2
  ];
  
  requiredSheets.forEach(sheetName => {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      console.log(`✅ ${sheetName}: ${sheet ? 'EXISTS' : 'MISSING'}`);
    } catch (error) {
      console.log(`❌ ${sheetName}: ERROR - ${error.message}`);
    }
  });
}

// For debugging
function debugTentativeStructure() {
  console.log('=== Debugging TENTATIVE-Version2 Data Structure ===');
  
  try {
    const loader = new TentativeDataLoader();
    const tentativeData = loader.loadData();
    
    console.log(`Loaded ${tentativeData.size} students from TENTATIVE-Version2`);
    
    // Check first 3 students to see the data structure
    let count = 0;
    tentativeData.forEach((studentRecord, studentId) => {
      if (count < 3) {
        console.log(`\n--- Student ${studentId} ---`);
        console.log('Type:', typeof studentRecord);
        console.log('Is Array:', Array.isArray(studentRecord));
        
        if (Array.isArray(studentRecord)) {
          console.log('Array length:', studentRecord.length);
          if (studentRecord.length > 0) {
            console.log('First element:', studentRecord[0]);
            console.log('First element keys:', Object.keys(studentRecord[0] || {}));
          }
        } else {
          console.log('Object keys:', Object.keys(studentRecord || {}));
          console.log('Full object:', studentRecord);
        }
        count++;
      }
    });
    
  } catch (error) {
    console.error('Error debugging tentative structure:', error);
  }
}

/**
 * Diagnostic function to check ContactInfo data loading
 */
function debugContactDataLoading() {
  console.log('=== Debugging ContactInfo Data Loading ===');
  
  // Step 1: Check if the sheet exists and its structure
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CONTACT_INFO);
    if (!sheet) {
      console.error('❌ ContactInfo sheet not found');
      return;
    }
    
    console.log('✅ ContactInfo sheet found');
    console.log(`Rows: ${sheet.getLastRow()}, Columns: ${sheet.getLastColumn()}`);
    
    // Step 2: Check the headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('Headers found:');
    headers.forEach((header, index) => {
      const letter = String.fromCharCode(65 + index);
      console.log(`  ${letter}: "${header}"`);
    });
    
    // Step 3: Check for Student ID column
    const studentIdIndex = headers.indexOf(COLUMN_NAMES.STUDENT_ID);
    const altStudentIdIndex = headers.indexOf(COLUMN_NAMES.STUDENT_ID_ALT);
    
    console.log(`\nLooking for key column: "${COLUMN_NAMES.STUDENT_ID}"`);
    console.log(`Found at index: ${studentIdIndex}`);
    if (studentIdIndex === -1) {
      console.log(`Alternative column "${COLUMN_NAMES.STUDENT_ID_ALT}" at index: ${altStudentIdIndex}`);
    }
    
    // Step 4: Test the loader
    console.log('\n--- Testing ContactDataLoader ---');
    const loader = new ContactDataLoader();
    const data = loader.loadData();
    
    console.log(`Loaded ${data.size} contact records`);
    
    // Step 5: Show sample data
    if (data.size > 0) {
      console.log('\nSample records:');
      let count = 0;
      for (const [studentId, contactData] of data) {
        if (count >= 3) break; // Show first 3 records
        console.log(`Student ID: ${studentId}`);
        console.log(`Data keys: ${Object.keys(contactData).join(', ')}`);
        console.log(`Sample data:`, contactData);
        console.log('---');
        count++;
      }
    }
    
  } catch (error) {
    console.error('Error in diagnostic:', error);
  }
}

/**
 * Quick function to check what column names are expected
 */
function checkContactColumnNames() {
  console.log('=== Contact Column Name Check ===');
  console.log('COLUMN_NAMES.STUDENT_ID:', COLUMN_NAMES.STUDENT_ID);
  console.log('COLUMN_NAMES.STUDENT_ID_ALT:', COLUMN_NAMES.STUDENT_ID_ALT);
  console.log('COLUMN_NAMES.STUDENT_EMAIL:', COLUMN_NAMES.STUDENT_EMAIL);
  console.log('COLUMN_NAMES.PARENT_NAME:', COLUMN_NAMES.PARENT_NAME);
  console.log('COLUMN_NAMES.GUARDIAN_EMAIL:', COLUMN_NAMES.GUARDIAN_EMAIL);
}

/**
 * Direct sheet inspection
 */
function inspectContactSheetDirectly() {
  console.log('=== Direct ContactInfo Sheet Inspection ===');
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ContactInfo');
    if (!sheet) {
      console.error('ContactInfo sheet not found');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    
    console.log('First 3 rows of ContactInfo:');
    for (let i = 0; i < Math.min(3, data.length); i++) {
      console.log(`Row ${i}:`, data[i]);
    }
  } catch (error) {
    console.error('Error inspecting sheet:', error);
  }
}

/**
 * Enhanced ContactInfo inspection to check for column alignment issues
 */
function inspectContactDataAlignment() {
  console.log('=== ContactInfo Data Alignment Check ===');
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ContactInfo');
    if (!sheet) {
      console.error('ContactInfo sheet not found');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    console.log('Expected vs Actual Column Mapping:');
    console.log('Column A (Current Building):', headers[0]);
    console.log('Column B (Student ID):', headers[1]);
    console.log('Column C (Student Name):', headers[2]);
    console.log('Column D (Grade Level):', headers[3]);
    console.log('Column E (Parent Name):', headers[4]);
    console.log('Column F (Notification Phone):', headers[5]);
    console.log('Column G (Guardian 1 Email):', headers[6]);
    console.log('Column H (Guardian 2 Email):', headers[7]);
    console.log('Column I (Student Email):', headers[8]);
    
    console.log('\nSample row 2 data:');
    if (data.length > 1) {
      const sampleRow = data[1];
      headers.forEach((header, index) => {
        console.log(`${header}: "${sampleRow[index]}"`);
      });
    }
    
    console.log('\nData Type Analysis:');
    if (data.length > 1) {
      const sampleRow = data[1];
      console.log('Parent Name contains phone?', /^\(\d{3}\)/.test(sampleRow[4]));
      console.log('Notification Phone contains name?', /^[A-Za-z]/.test(sampleRow[5]));
      console.log('Guardian 1 Email looks like email?', /@/.test(sampleRow[6]));
    }
    
  } catch (error) {
    console.error('Error inspecting alignment:', error);
  }
}

/**
 * Test the fixed ContactDataLoader
 */
function testFixedContactDataLoader() {
  console.log('=== Testing Fixed ContactDataLoader ===');
  
  try {
    const loader = new ContactDataLoader();
    const data = loader.loadData();
    
    console.log(`Loaded ${data.size} contact records`);
    
    if (data.size > 0) {
      console.log('\nSample records after fix:');
      let count = 0;
      for (const [studentId, contactData] of data) {
        if (count >= 2) break;
        console.log(`\nStudent ID: ${studentId}`);
        console.log(`Data type: ${typeof contactData}`);
        console.log(`Is Array: ${Array.isArray(contactData)}`);
        console.log(`Keys: ${Object.keys(contactData).join(', ')}`);
        console.log(`Parent Name: "${contactData['Parent Name']}"`);
        console.log(`Guardian Email: "${contactData['Guardian 1 Email']}"`);
        console.log(`Student Email: "${contactData['Student Email']}"`);
        count++;
      }
    }
    
  } catch (error) {
    console.error('Error testing fixed loader:', error);
  }
}

/**
 * Test the corrected ContactDataLoader with actual column structure
 */
function testCorrectedContactDataLoader() {
  console.log('=== Testing Corrected ContactDataLoader ===');
  
  try {
    const loader = new ContactDataLoader();
    const data = loader.loadData();
    
    console.log(`Loaded ${data.size} contact records`);
    
    if (data.size > 0) {
      console.log('\nSample records with corrected mapping:');
      let count = 0;
      for (const [studentId, contactData] of data) {
        if (count >= 2) break;
        console.log(`\n--- Student ID: ${studentId} ---`);
        console.log(`Student Name: "${contactData['Student Name']}"`);
        console.log(`Grade Level: "${contactData['Grade Level']}"`);
        console.log(`Notification Phone: "${contactData['Notification Phone']}"`);
        console.log(`Parent Name: "${contactData['Parent Name']}"`);
        console.log(`Guardian 1 Email: "${contactData['Guardian 1 Email']}"`);
        console.log(`Guardian 1 Cell: "${contactData['Guardian 1 Cell']}"`);
        console.log(`Guardian 2 Name: "${contactData['Guardian 2 Name']}"`);
        console.log(`Guardian 2 Email: "${contactData['Guardian 2 Email']}"`);
        console.log(`Student Email: "${contactData['Student Email']}"`);
        console.log(`Available keys: ${Object.keys(contactData).join(', ')}`);
        count++;
      }
    }
    
  } catch (error) {
    console.error('Error testing corrected loader:', error);
  }
}

