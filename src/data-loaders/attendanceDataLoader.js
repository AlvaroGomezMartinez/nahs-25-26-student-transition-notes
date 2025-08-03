/**
 * @fileoverview Student Attendance Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading student attendance
 * and enrollment data from external spreadsheets. It handles the unique column
 * naming conventions used in attendance sheets ("STU ID" instead of "STUDENT ID")
 * and provides integration with the external data sources.
 * 
 * The loader connects to attendance tracking systems to gather critical
 * enrollment status information that affects student transition decisions.
 * 
 * @author NAHS Development Team
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Loads student attendance and enrollment data from external spreadsheets.
 * 
 * This specialized data loader handles attendance data that uses different
 * column naming conventions than other data sources. It connects to external
 * spreadsheets containing enrollment and attendance information critical for
 * student transition tracking.
 * 
 * **Key Features:**
 * - **External Spreadsheet Access**: Connects to attendance tracking systems
 * - **Column Variant Handling**: Uses "STU ID" column instead of "STUDENT ID"
 * - **Enrollment Data**: Provides current enrollment status information
 * - **Error Resilience**: Graceful handling of external data source issues
 * 
 * @class AttendanceDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Basic attendance data loading
 * const loader = new AttendanceDataLoader();
 * const attendanceData = loader.loadData();
 * console.log(`Loaded attendance for ${attendanceData.size} students`);
 * 
 * @example
 * // Check enrollment status for specific student
 * const loader = new AttendanceDataLoader();
 * const data = loader.loadData();
 * const studentAttendance = data.get('123456');
 * if (studentAttendance) {
 *   console.log(`Enrollment status: ${studentAttendance.ENROLLMENT_STATUS}`);
 * }
 * 
 * @since 2.0.0
 */
class AttendanceDataLoader extends BaseDataLoader {
  /**
   * Creates a new AttendanceDataLoader instance.
   * 
   * Configures the loader to access attendance data from external spreadsheets
   * using the specialized "STU ID" column naming convention. Sets up connection
   * to the configured attendance data source.
   * 
   * @constructor
   * @memberof AttendanceDataLoader
   * 
   * @example
   * // Create attendance loader
   * const loader = new AttendanceDataLoader();
   * // Loader is configured to use EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE
   * 
   * @since 2.0.0
   */
  constructor() {
    // Use external spreadsheet ID for attendance data
    const externalSpreadsheetId = EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE;
    // Use STUDENT_ID_STU variant since attendance sheet uses "STU ID" column
    super(SHEET_NAMES.ATTENDANCE, COLUMN_NAMES.STUDENT_ID_STU, false, externalSpreadsheetId);
  }

  /**
   * Loads student attendance data from external spreadsheet.
   * 
   * This method connects to the configured external attendance spreadsheet
   * and loads enrollment and attendance data using the "STU ID" column variant.
   * It provides critical enrollment status information needed for student
   * transition decisions.
   * 
   * @function loadData
   * @memberof AttendanceDataLoader
   * 
   * @returns {Map<string, Object>} Map where:
   *   - **Key**: Student ID (string) - Unique student identifier from "STU ID" column
   *   - **Value**: Attendance data object containing enrollment and attendance information
   * 
   * @throws {Error} Throws if external spreadsheet access fails or data structure is invalid
   * 
   * @example
   * // Load attendance data
   * const loader = new AttendanceDataLoader();
   * const attendanceData = loader.loadData();
   * 
   * // Process attendance information
   * attendanceData.forEach((data, studentId) => {
   *   console.log(`Student ${studentId}: ${data.ENROLLMENT_STATUS}`);
   * });
   * 
   * @example
   * // Error handling for external data source
   * try {
   *   const loader = new AttendanceDataLoader();
   *   const data = loader.loadData();
   *   if (data.size === 0) {
   *     console.warn('No attendance data loaded - check external spreadsheet access');
   *   }
   * } catch (error) {
   *   console.error('Failed to load attendance data:', error.message);
   *   // Graceful degradation - continue without attendance data
   * }
   * 
   * @see {@link BaseDataLoader#loadData} For inherited loading functionality
   * @see {@link EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE} For data source configuration
   * 
   * @since 2.0.0
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
 * Loads student attendance data using the AttendanceDataLoader class.
 * 
 * This function provides backward compatibility with existing code that
 * calls the original loadStudentAttendanceData function. It creates an
 * AttendanceDataLoader instance and returns the loaded data.
 * 
 * **Migration Note**: New code should use AttendanceDataLoader class directly
 * for better error handling and configuration options.
 * 
 * @function loadStudentAttendanceData
 * @memberof DataLoaders
 * 
 * @returns {Map<string, Object>} Map where:
 *   - **Key**: Student ID (string) - Unique student identifier
 *   - **Value**: Attendance data object with enrollment and attendance information
 * 
 * @example
 * // Legacy usage (still supported)
 * const attendanceData = loadStudentAttendanceData();
 * console.log(`Loaded attendance for ${attendanceData.size} students`);
 * 
 * @example
 * // Recommended new usage
 * const loader = new AttendanceDataLoader();
 * const attendanceData = loader.loadData();
 * 
 * @see {@link AttendanceDataLoader} For the recommended class-based approach
 * @see {@link AttendanceDataLoader#loadData} For detailed method documentation
 * 
 * @since 2.0.0
 * @deprecated Use AttendanceDataLoader class directly for new code
 */
function loadStudentAttendanceData() {
  const loader = new AttendanceDataLoader();
  return loader.loadData();
}
