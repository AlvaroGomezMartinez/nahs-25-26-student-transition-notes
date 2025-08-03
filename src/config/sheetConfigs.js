/**
 * @fileoverview Sheet Configuration Mappings for the NAHS system.
 * 
 * This module defines the structure and column mappings for each Google Sheet
 * used in the student transition system. It provides configuration objects
 * that specify sheet names, required columns, key columns, and output formats
 * for consistent data handling across all components.
 * 
 * These configurations ensure proper data validation, column mapping, and
 * output formatting for all sheet-based operations in the system.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof Config
 */

/**
 * Configuration object for the TENTATIVE-Version2 sheet.
 * 
 * Defines the structure, required columns, and output format for the primary
 * student transition tracking sheet. This configuration ensures consistent
 * data handling and proper validation for the main workflow sheet.
 * 
 * @constant {Object} TENTATIVE_SHEET_CONFIG
 * @memberof Config.SheetConfigs
 * 
 * @property {string} name - The sheet name identifier
 * @property {string} keyColumn - Primary key column for data mapping
 * @property {Array<string>} requiredColumns - Columns that must be present
 * @property {Array<string>} outputColumnOrder - Order for data output operations
 * 
 * @example
 * // Use configuration for validation
 * const config = TENTATIVE_SHEET_CONFIG;
 * if (sheetHeaders.includes(config.keyColumn)) {
 *   console.log('Key column found:', config.keyColumn);
 * }
 * 
 * @since 2.0.0
 */
const TENTATIVE_SHEET_CONFIG = {
  name: SHEET_NAMES.TENTATIVE_V2,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  requiredColumns: [
    COLUMN_NAMES.STUDENT_ID,
    COLUMN_NAMES.STUDENT_FIRST_NAME,
    COLUMN_NAMES.STUDENT_LAST_NAME,
    COLUMN_NAMES.GRADE
  ],
  outputColumnOrder: [
    'DATE ADDED TO SPREADSHEET',
    'Student Last Name',
    'Student First Name',
    'STUDENT ID',
    'GRADE',
    // @todo Check if I need to include the rest of the columns from TENTATIVE_Version2
    // ... full column order would go here
  ]
};

/**
 * Configuration for the Registrations sheet
 */
const REGISTRATIONS_SHEET_CONFIG = {
  name: SHEET_NAMES.REGISTRATIONS,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  requiredColumns: [
    COLUMN_NAMES.STUDENT_ID,
    COLUMN_NAMES.PLACEMENT_DAYS,
    COLUMN_NAMES.HOME_CAMPUS
  ]
};

/**
 * Configuration for the Schedules sheet
 */
const SCHEDULES_SHEET_CONFIG = {
  name: SHEET_NAMES.SCHEDULES,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  requiredColumns: [
    COLUMN_NAMES.STUDENT_ID,
    COLUMN_NAMES.TEACHER_NAME,
    COLUMN_NAMES.COURSE_TITLE,
    COLUMN_NAMES.PERIOD
  ],
  filterColumn: COLUMN_NAMES.WITHDRAW_DATE, // Filter out rows where this is not empty
  allowMultipleRecords: true // Students can have multiple schedule records
};

/**
 * Configuration for Form Responses 1 sheet
 */
const FORM_RESPONSES_SHEET_CONFIG = {
  name: SHEET_NAMES.FORM_RESPONSES_1,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  emailColumn: 'Email Address',
  studentColumn: 'Student',
  allowMultipleRecords: true
};

/**
 * Configuration for Contact Info sheet
 */
const CONTACT_INFO_SHEET_CONFIG = {
  name: SHEET_NAMES.CONTACT_INFO,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  requiredColumns: [
    COLUMN_NAMES.STUDENT_EMAIL,
    COLUMN_NAMES.PARENT_NAME,
    COLUMN_NAMES.GUARDIAN_EMAIL
  ]
};

/**
 * Configuration for Entry/Withdrawal sheet
 */
const ENTRY_WITHDRAWAL_SHEET_CONFIG = {
  name: SHEET_NAMES.ENTRY_WITHDRAWAL,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  requiredColumns: [
    COLUMN_NAMES.STUDENT_ID,
    COLUMN_NAMES.ENTRY_DATE,
    COLUMN_NAMES.STUDENT_NAME_FULL
  ]
};

/**
 * Configuration for Withdrawn students sheet
 */
const WITHDRAWN_SHEET_CONFIG = {
  name: SHEET_NAMES.WITHDRAWN,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  purpose: 'FILTER' // Used to filter out students, not for data
};

/**
 * Configuration for W/D Other sheet
 */
const WD_OTHER_SHEET_CONFIG = {
  name: SHEET_NAMES.WD_OTHER,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  purpose: 'FILTER' // Used to filter out students, not for data
};

/**
 * Configuration for Attendance sheet
 */
const ATTENDANCE_SHEET_CONFIG = {
  name: SHEET_NAMES.ATTENDANCE,
  keyColumn: COLUMN_NAMES.STUDENT_ID,
  requiredColumns: [
    'Days in Attendance',
    'Days in Enrollment'
  ]
};

/**
 * Master configuration object containing all sheet configs
 */
const SHEET_CONFIGS = {
  TENTATIVE: TENTATIVE_SHEET_CONFIG,
  REGISTRATIONS: REGISTRATIONS_SHEET_CONFIG,
  SCHEDULES: SCHEDULES_SHEET_CONFIG,
  FORM_RESPONSES: FORM_RESPONSES_SHEET_CONFIG,
  CONTACT_INFO: CONTACT_INFO_SHEET_CONFIG,
  ENTRY_WITHDRAWAL: ENTRY_WITHDRAWAL_SHEET_CONFIG,
  WITHDRAWN: WITHDRAWN_SHEET_CONFIG,
  WD_OTHER: WD_OTHER_SHEET_CONFIG,
  ATTENDANCE: ATTENDANCE_SHEET_CONFIG
};

/**
 * Helper function to get sheet configuration by name
 * @param {string} sheetName - The name of the sheet
 * @returns {Object} The configuration object for the sheet
 */
function getSheetConfig(sheetName) {
  const config = Object.values(SHEET_CONFIGS).find(config => config.name === sheetName);
  if (!config) {
    throw new Error(`No configuration found for sheet: ${sheetName}`);
  }
  return config;
}
