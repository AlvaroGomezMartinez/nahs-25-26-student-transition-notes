/**
 * Student Attendance Data Loader
 * 
 * Loads attendance and enrollment data for students from external spreadsheet
 */

class AttendanceDataLoader extends BaseDataLoader {
  constructor() {
    // Use external spreadsheet ID for attendance data
    const externalSpreadsheetId = EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE;
    // Use STUDENT_ID_STU variant since attendance sheet uses "STU ID" column
    super(SHEET_NAMES.ATTENDANCE, COLUMN_NAMES.STUDENT_ID_STU, false, externalSpreadsheetId);
  }

  /**
   * Loads student attendance data from external spreadsheet
   * This replaces the original loadStudentAttendanceData function
   * @returns {Map} Map where keys are student IDs and values are attendance data
   */
  loadData() {
    try {
      console.log('Loading student attendance data from external spreadsheet...');
      console.log('External spreadsheet ID:', EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE);
      return super.loadData();
    } catch (error) {
      console.error('Error loading student attendance data:', error);
      console.error('Note: Attendance data is expected to be in an external spreadsheet');
      console.error('Please verify the EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE configuration');
      return new Map();
    }
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original loadStudentAttendanceData function
 * @returns {Map} A map where the key is the Student ID and values are attendance data
 */
function loadStudentAttendanceData() {
  const loader = new AttendanceDataLoader();
  return loader.loadData();
}
