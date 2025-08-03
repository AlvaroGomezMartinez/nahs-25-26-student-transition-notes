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
    // Basic student information
    'DATE ADDED TO SPREADSHEET',
    'LAST',
    'FIRST',
    'STUDENT ID',
    'GRADE',
    
    // 1st Period (6 columns)
    '1st Period - Course Title',
    '1st Period - Teacher Name', 
    '1st Period - Transfer Grade',
    '1st Period - Current Grade',
    '1st Period - How would you assess this student\'s academic growth?',
    '1st Period - Academic and Behavioral Progress Notes',
    
    // 2nd Period (6 columns)
    '2nd Period - Course Title',
    '2nd Period - Teacher Name',
    '2nd Period - Transfer Grade', 
    '2nd Period - Current Grade',
    '2nd Period - How would you assess this student\'s academic progress?',
    '2nd Period - Academic and Behavioral Progress Notes',
    
    // 3rd Period (6 columns)
    '3rd Period - Course Title',
    '3rd Period - Teacher Name',
    '3rd Period - Transfer Grade',
    '3rd Period - Current Grade', 
    '3rd Period - How would you assess this student\'s academic progress?',
    '3rd Period - Academic and Behavioral Progress Notes',
    
    // 4th Period (6 columns)
    '4th Period - Course Title',
    '4th Period - Teacher Name',
    '4th Period - Transfer Grade',
    '4th Period - Current Grade',
    '4th Period - How would you assess this student\'s academic progress?', 
    '4th Period - Academic and Behavioral Progress Notes',
    
    // 5th Period (6 columns)
    '5th Period - Course Title',
    '5th Period - Teacher Name',
    '5th Period - Transfer Grade',
    '5th Period - Current Grade',
    '5th Period - How would you assess this student\'s academic progress?',
    '5th Period - Academic and Behavioral Progress Notes',
    
    // 6th Period (6 columns)
    '6th Period - Course Title',
    '6th Period - Teacher Name',
    '6th Period - Transfer Grade',
    '6th Period - Current Grade',
    '6th Period - How would you assess this student\'s academic progress?',
    '6th Period - Academic and Behavioral Progress Notes',
    
    // 7th Period (6 columns)
    '7th Period - Course Title',
    '7th Period - Teacher Name',
    '7th Period - Transfer Grade',
    '7th Period - Current Grade', 
    '7th Period - How would you assess this student\'s progress?',
    '7th Period - Academic and Behavioral Progress Notes',
    
    // 8th Period (6 columns)
    '8th Period - Course Title',
    '8th Period - Teacher Name',
    '8th Period - Transfer Grade',
    '8th Period - Current Grade',
    '8th Period - How would you assess this student\'s progress?',
    '8th Period - Academic and Behavioral Progress Notes',
    
    // Special Education (6 columns)
    'SE - Special Education Case Manager',
    'SE - What accommodations seem to work well with this student to help them be successful?',
    'SE - What are the student\'s strengths, as far as behavior?',
    'SE - What are the student\'s needs, as far as behavior?  (Pick behavior having most effect on his/her ability to be successful in class.  If there are no concerns, note that.)',
    'SE - What are the student\'s needs, as far as functional skills?  (Include daily living skills, fine/gross motor skills, organizational skills, self-advocacy, attendance, etc.)',
    'SE - Please add any other comments or concerns here:',
    
    // Administrative Information
    'REGULAR CAMPUS',
    'FIRST DAY OF AEP',
    'Anticipated Release Date',
    'Parent Notice Date',
    'Withdrawn Date',
    'Attendance Recovery',
    'COMPASS',
    'Credit Retrieval',
    'Behavior Contract',
    'Campus Mentor',
    'Other Intervention 1',
    'Other Intervention 2',
    'Sect 504',
    'ESL',
    'Additional notes or counseling services and Support',
    'Licensed social worker consultation',
    'Check if you\'re ready to create Transition Letter with Autocrat',
    
    // Contact Information
    'StudentEmail',
    'Guardian Name', 
    'Guardian Email',
    
    // Document Merge Fields
    'Merged Doc ID - Transition Letter',
    'Merged Doc URL - Transition Letter',
    'Link to merged Doc - Transition Letter',
    'Document Merge Status - Transition Letter'
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
