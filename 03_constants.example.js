/**
 * @fileoverview Configuration constants for the Student Transition Notes system.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is a template. To configure the system for your environment:
 *
 *   1. Copy this file:  cp 03_constants.example.js 03_constants.js
 *   2. Open 03_constants.js and replace every placeholder marked with
 *      YOUR_... with your actual values.
 *   3. Never commit 03_constants.js — it is listed in .gitignore.
 *
 * Placeholders to fill in:
 *   • EXTERNAL_SPREADSHEETS  — Google Spreadsheet IDs for your data sources
 *   • TEACHER_EMAIL_MAPPINGS — Staff email addresses and display names
 * ─────────────────────────────────────────────────────────────────────────────
 *
 */

/**
 * Google Sheets names used throughout the system.
 * These must match the exact tab names in your Google Spreadsheet.
 *
 * @namespace SHEET_NAMES
 * @readonly
 * @enum {string}
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
 * Column names are case-sensitive and must match the headers in your sheets.
 *
 * @namespace COLUMN_NAMES
 * @readonly
 * @enum {string}
 */
const COLUMN_NAMES = {
  STUDENT_ID: "STUDENT ID",
  STUDENT_ID_ALT: "Student Id",       // Alternative format with lowercase 'd'
  STUDENT_ID_STU: "STU ID",           // Alternative format for attendance data
  STUDENT_FIRST_NAME: "Student First Name",
  STUDENT_LAST_NAME: "Student Last Name",
  // Backwards-compatible aliases used across older services
  FIRST: "FIRST",
  LAST: "LAST",
  STUDENT_NAME_FULL: "Student Name(Last, First)",
  STUDENT_NAME_FULL_ALT: "Student Name (Last, First MI)", // Alternative format from Schedules
  GRADE: "GRADE",
  GRADE_ALT: "Grd Lvl",              // Alternative format
  HOME_CAMPUS: "Home Campus",
  ENTRY_DATE: "Entry Date",
  PLACEMENT_DAYS: "Placement Days",
  START_DATE: "Start Date",           // From registrations
  FIRST_DAY_OF_AEP: "FIRST DAY OF AEP",
  DATE_ADDED: "DATE ADDED TO SPREADSHEET",
  TEACHER_NAME: "Teacher Name",
  COURSE_TITLE: "Course Title",
  CASE_MANAGER: "Case Manager",
  PERIOD: "Per Beg",
  WITHDRAW_DATE: "Wdraw Date",
  PARENT_NAME: "Parent Name",
  GUARDIAN_EMAIL: "Guardian 1 Email",
  STUDENT_EMAIL: "Student Email",
  NOTIFICATION_PHONE: "Notification Phone",
  GUARDIAN_1_NAME: "Guardian 1",
  GUARDIAN_1_EMAIL: "Guardian 1 Email",
  GUARDIAN_1_CELL: "Guardian 1 Cell",
  GUARDIAN_1_HOME: "Guardian 1 Home",
  GUARDIAN_2_NAME: "Guardian 2",
  GUARDIAN_2_EMAIL: "Guardian 2 Email",
  GUARDIAN_2_CELL: "Guardian 2 Cell",
  GUARDIAN_2_HOME: "Guardian 2 Home",
  RECIDIVIST: "Repeat NAHS Student",
  ELIGIBILITY: "Eligibilty",
  EDUCATIONAL_FACTORS: "Educational Factors",
  BEHAVIOR_CONTRACT: "Behavior Contract"
};

/**
 * Period mappings for schedule processing and form data integration.
 *
 * @namespace PERIODS
 * @readonly
 * @enum {string}
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
  TENTH: '10th',
  SPECIAL_ED: 'Special Education'
};

/**
 * Default values used when data is missing or unavailable.
 *
 * @namespace DEFAULT_VALUES
 * @readonly
 * @enum {string}
 */
const DEFAULT_VALUES = {
  EMPTY_STRING: '',
  UNKNOWN_TEACHER: 'Unknown',
  MISSING_DATA_PLACEHOLDER: 'Data not available'
};

/**
 * External spreadsheet IDs for data sources outside the main workbook.
 *
 * ⚠️  REPLACE EACH PLACEHOLDER with the actual Google Spreadsheet ID.
 * Find the ID in the spreadsheet URL:
 *   https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
 *
 * @namespace EXTERNAL_SPREADSHEETS
 * @readonly
 * @enum {string}
 */
const EXTERNAL_SPREADSHEETS = {
  SCHEDULES_SOURCE:      "YOUR_SCHEDULES_SPREADSHEET_ID",
  REGISTRATIONS_SOURCE:  "YOUR_REGISTRATIONS_SPREADSHEET_ID",  // "Form Responses 2"
  ATTENDANCE_SOURCE:     "YOUR_ATTENDANCE_SPREADSHEET_ID",      // "Alt_HS_Attendance_Enrollment_Count"
  TRACKING_SOURCE:       "YOUR_TRACKING_SPREADSHEET_ID",        // "NAHS Students"
};

/**
 * Configuration mapping for which sheets are external vs local.
 *
 * @namespace SHEET_LOCATIONS
 * @readonly
 * @enum {string}
 */
const SHEET_LOCATIONS = {
  [SHEET_NAMES.TENTATIVE_V2]:    'LOCAL',
  [SHEET_NAMES.TENTATIVE]:       'LOCAL',
  [SHEET_NAMES.REGISTRATIONS]:   'EXTERNAL',
  [SHEET_NAMES.SCHEDULES]:       'LOCAL',    // Imported via importAPIData
  [SHEET_NAMES.FORM_RESPONSES_1]:'LOCAL',
  [SHEET_NAMES.CONTACT_INFO]:    'LOCAL',    // Imported via importAPIData
  [SHEET_NAMES.ENTRY_WITHDRAWAL]:'LOCAL',    // Imported via importAPIData
  [SHEET_NAMES.WITHDRAWN]:       'LOCAL',
  [SHEET_NAMES.WD_OTHER]:        'LOCAL',
  [SHEET_NAMES.ATTENDANCE]:      'EXTERNAL',
  [SHEET_NAMES.TRACKING_SHEET]:  'EXTERNAL'
};

/**
 * Email-to-name mappings for teacher lookup and identification.
 *
 * ⚠️  REPLACE EACH PLACEHOLDER with real staff email addresses and names.
 * Format:  "firstname.lastname@yourdomain.org": { "proper name": "Last, First" }
 *
 * @namespace TEACHER_EMAIL_MAPPINGS
 * @readonly
 * @type {Object<string, {proper name: string}>}
 *
 * @todo Move this to a separate configuration file or database
 * @todo Implement dynamic teacher lookup system
 */
const TEACHER_EMAIL_MAPPINGS = {
  "teacher1@yourdomain.org": { "proper name": "Last1, First1" },
  "teacher2@yourdomain.org": { "proper name": "Last2, First2" },
  // Add additional staff entries here...
};

/**
 * System configuration
 */
const SYSTEM_CONFIG = {
  TIMEZONE: 'America/Chicago',
  DATE_FORMAT: 'MM/dd/yyyy',
  BATCH_SIZE: 100,  // For processing large datasets
  MAX_RETRIES: 3    // For API calls
};

// ─── Utility / validation functions ──────────────────────────────────────────
// The functions below (checkExternalConfiguration, validateExternalAccess,
// testExternalSheets, quickTest, debugColumnHeaders, testUpdatedLoaders) are
// identical to those in 03_constants.js and are included here so the example
// file is self-contained and runnable after setup.

/**
 * Prints the current external spreadsheet IDs and tests access to each one.
 * Run this from the Apps Script editor after filling in your IDs.
 *
 * @function checkExternalConfiguration
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

  const tests = [
    { label: 'Registrations', id: EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE, sheet: SHEET_NAMES.REGISTRATIONS },
    { label: 'Attendance',    id: EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE,    sheet: SHEET_NAMES.ATTENDANCE },
    { label: 'Tracking',      id: EXTERNAL_SPREADSHEETS.TRACKING_SOURCE,      sheet: SHEET_NAMES.TRACKING_SHEET },
    { label: 'Schedules',     id: EXTERNAL_SPREADSHEETS.SCHEDULES_SOURCE,     sheet: SHEET_NAMES.SCHEDULES },
  ];

  console.log('Testing External Spreadsheet Access:');
  tests.forEach(({ label, id, sheet }, i) => {
    console.log(`${i + 1}. Testing ${label} access...`);
    try {
      const ss = SpreadsheetApp.openById(id);
      console.log(`   ✅ ${label} spreadsheet accessible`);
      const target = ss.getSheetByName(sheet);
      console.log(target
        ? `   ✅ Sheet "${sheet}" found`
        : `   ⚠️ Sheet "${sheet}" not found. Available: ${ss.getSheets().map(s => s.getName()).join(', ')}`
      );
    } catch (e) {
      console.log(`   ❌ ${label} not accessible: ${e.message}`);
    }
    console.log('');
  });

  console.log('=== Configuration Check Complete ===');
}

/**
 * Validates access to all configured external spreadsheets.
 *
 * @function validateExternalAccess
 * @returns {Object} Validation results for all external sheets
 */
function validateExternalAccess() {
  console.log('=== Validating External Spreadsheet Access ===');
  console.log('');

  const results = {
    registrations: { accessible: false, sheetExists: false, error: null },
    attendance:    { accessible: false, sheetExists: false, error: null },
    tracking:      { accessible: false, sheetExists: false, error: null },
    schedules:     { accessible: false, sheetExists: false, error: null },
    summary:       { allAccessible: false, totalAccessible: 0 }
  };

  const tests = [
    { name: 'Registrations', key: 'registrations', spreadsheetId: EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE, sheetName: SHEET_NAMES.REGISTRATIONS },
    { name: 'Attendance',    key: 'attendance',    spreadsheetId: EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE,    sheetName: SHEET_NAMES.ATTENDANCE },
    { name: 'Tracking',      key: 'tracking',      spreadsheetId: EXTERNAL_SPREADSHEETS.TRACKING_SOURCE,      sheetName: SHEET_NAMES.TRACKING_SHEET },
    { name: 'Schedules',     key: 'schedules',     spreadsheetId: EXTERNAL_SPREADSHEETS.SCHEDULES_SOURCE,     sheetName: SHEET_NAMES.SCHEDULES },
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
        const available = spreadsheet.getSheets().map(s => s.getName());
        console.log(`   ⚠️ ${test.name}: Spreadsheet accessible, but sheet '${test.sheetName}' not found`);
        console.log(`   Available sheets: ${available.join(', ')}`);
      }
    } catch (error) {
      results[test.key].error = error.message;
      console.log(`   ❌ ${test.name}: Not accessible - ${error.message}`);
    }
  });

  console.log('');
  console.log('=== Validation Summary ===');
  results.summary.allAccessible = results.summary.totalAccessible === tests.length;
  console.log(`Fully accessible external sheets: ${results.summary.totalAccessible}/${tests.length}`);
  if (results.summary.allAccessible) {
    console.log('✅ All external spreadsheets are properly configured and accessible!');
  } else {
    console.log('⚠️ Some external spreadsheets need attention.');
  }

  return results;
}
