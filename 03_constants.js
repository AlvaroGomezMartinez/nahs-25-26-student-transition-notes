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
  REGISTRATIONS: 'Registrations SY 24.25',
  SCHEDULES: 'Schedules',
  FORM_RESPONSES_1: 'Form Responses 1',
  CONTACT_INFO: 'ContactInfo',
  ENTRY_WITHDRAWAL: 'Entry_Withdrawal',
  WITHDRAWN: 'Withdrawn',
  WD_OTHER: 'W/D Other',
  ATTENDANCE: 'Alt HS Attendance & Enrollment Count',
  TRACKING_SHEET: 'Sheet1'
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
  STUDENT_FIRST_NAME: 'Student First Name',
  STUDENT_LAST_NAME: 'Student Last Name',
  STUDENT_NAME_FULL: 'Student Name(Last, First)',
  GRADE: 'GRADE',
  HOME_CAMPUS: 'Home Campus',
  ENTRY_DATE: 'Entry Date',
  PLACEMENT_DAYS: 'Placement Days',
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
  'katelyn.anderson@nisd.net': { 'proper name': 'Anderson, Katelyn' },
  'casey.beltran@nisd.net': { 'proper name': 'Beltran, Casey' },
  'peter.castaneda@nisd.net': { 'proper name': 'Castaneda, Peter' },
  'oscar.flores@nisd.net': { 'proper name': 'Flores, Oscar' },
  'carolina.flores@nisd.net': { 'proper name': 'Flores, Carolina' },
  'jacob.garcia@nisd.net': { 'proper name': 'Garcia, Jacob' },
  'alvaro.gomez@nisd.net': { 'proper name': 'Gomez, Alvaro' },
  'cynthia.gonzalez@nisd.net': { 'proper name': 'Gonzalez, Cynthia' },
  'julia.lara@nisd.net': { 'proper name': 'Lara, Julia' },
  'luis.martinez@nisd.net': { 'proper name': 'Martinez, Luis' },
  'gabriel.navarro@nisd.net': { 'proper name': 'Navarro, Gabriel' },
  'luis.pedraza@nisd.net': { 'proper name': 'Pedraza, Luis' },
  'katherine.pedroza@nisd.net': { 'proper name': 'Pedroza, Katherine' },
  'bryan.riojas@nisd.net': { 'proper name': 'Riojas, Bryan' },
  'ivan.rodriguez@nisd.net': { 'proper name': 'Rodriguez, Ivan' },
  'jonathan.rodriguez@nisd.net': { 'proper name': 'Rodriguez, Jonathan' },
  'patricia.ruiz@nisd.net': { 'proper name': 'Ruiz, Patricia' },
  'diego.sanchez@nisd.net': { 'proper name': 'Sanchez, Diego' },
  'omar.torres@nisd.net': { 'proper name': 'Torres, Omar' },
  'miranda.wenzlaff@nisd.net': { 'proper name': 'Wenzlaff, Miranda' }
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
