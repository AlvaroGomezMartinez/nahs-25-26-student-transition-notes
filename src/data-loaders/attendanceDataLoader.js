/**
 * Student Attendance Data Loader
 * 
 * Loads attendance and enrollment data for students from external spreadsheet
 */

class AttendanceDataLoader extends ExternalDataLoader {
  constructor() {
    super(SHEET_NAMES.ATTENDANCE, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads student attendance data from external spreadsheet
   * This replaces the original loadStudentAttendanceData function
   * @returns {Map} Map where keys are student IDs and values are attendance data
   */
  loadData() {
    try {
      console.log('Loading student attendance data from external spreadsheet...');
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
