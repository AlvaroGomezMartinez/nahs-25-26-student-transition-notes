/**
 * Configuration constants for the NAHS Student Transition Notes system
 * 
 * This file centralizes all configuration values to avoid magic strings
 * and make the system more maintainable.
 */

/**
 * Google Sheets names used in the system
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
 * Column names and mappings
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
 * Period mappings for schedule processing
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
 * Default values for missing data
 */
const DEFAULT_VALUES = {
  EMPTY_STRING: '',
  UNKNOWN_TEACHER: 'Unknown',
  MISSING_DATA_PLACEHOLDER: 'Data not available'
};

/**
 * External spreadsheet IDs
 */
const EXTERNAL_SPREADSHEETS = {
  SCHEDULES_SOURCE: '14-nvlNOLWebnJJOQNZPnglWx0OuE5U-_xEbXGodND6E'
};

/**
 * Email mappings for teacher lookup
 * TODO: Move this to a separate configuration file or database
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
