/**
 * Student Attendance Data Loader
 * 
 * Loads attendance and enrollment data for students
 */

class AttendanceDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.ATTENDANCE, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads student attendance data
   * This replaces the original loadStudentAttendanceData function
   * @returns {Map} Map where keys are student IDs and values are attendance data
   */
  loadData() {
    try {
      console.log('Loading student attendance data...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading student attendance data:', error);
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
