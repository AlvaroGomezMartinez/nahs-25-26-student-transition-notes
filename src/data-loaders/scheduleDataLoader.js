/**
 * @fileoverview Schedule Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading student schedule
 * data from the Schedules sheet. It handles course enrollment information,
 * filtering logic for withdrawn courses, and provides current academic
 * schedule data critical for student transition planning.
 * 
 * The schedule data includes current course enrollments, period assignments,
 * and teacher information needed for comprehensive transition tracking.
 * 
 * @author Alvaro Gomez
 * @version 2.0.1
 * @since 2025-10-01
 * @memberof DataLoaders
 */

/**
 * Loads student schedule data from the Schedules sheet.
 * 
 * This specialized data loader handles student course schedules with intelligent
 * filtering to exclude courses that have withdrawal dates. It supports multiple
 * records per student (e.g. each course has its own row, so for an eight period
 * day, there would be eight rows per student) and provides current enrollment status.
 * 
 * **Key Features:**
 * - **Course Schedule Loading**: Current student course enrollments
 * - **Withdrawal Filtering**: Automatically excludes withdrawn courses
 * - **Multiple Records**: Supports multiple courses per student
 * - **Period Information**: Provides class period and timing data
 * - **Teacher Data**: Includes instructor information for each course
 * 
 * @class ScheduleDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Load current student schedules
 * const loader = new ScheduleDataLoader();
 * const scheduleData = loader.loadData();
 * console.log(`Loaded schedules for ${scheduleData.size} students`);
 * 
 * @example
 * // Process student course information
 * const loader = new ScheduleDataLoader();
 * const data = loader.loadData();
 * const studentSchedule = data.get('123456');
 * if (studentSchedule && Array.isArray(studentSchedule)) {
 *   studentSchedule.forEach(course => {
 *     console.log(`Course: ${course.COURSE_NAME}, Period: ${course.PERIOD}`);
 *   });
 * }
 * 
 * @since 2.0.1
 */
class ScheduleDataLoader extends BaseDataLoader {
  /**
   * Creates a new ScheduleDataLoader instance.
   * 
   * Configures the loader to access schedule data from the Schedules sheet
   * with support for multiple records per student (allowMultiple = true).
   * Sets up filtering to exclude courses with withdrawal dates.
   * 
   * @constructor
   * @memberof ScheduleDataLoader
   * 
   * @example
   * // Create schedule loader
   * const loader = new ScheduleDataLoader();
   * // Configured for multiple records per student (one per course)
   * 
   * @since 2.0.0
   */
  constructor() {
    super(SHEET_NAMES.SCHEDULES, COLUMN_NAMES.STUDENT_ID, true);
  }

  /**
   * Loads schedule data from the Schedules sheet.
   * 
   * This method loads current student course schedules with automatic filtering
   * to exclude courses that have withdrawal dates. It supports multiple courses
   * per student and provides comprehensive schedule information for transition
   * planning.
   * 
   * @function loadData
   * @memberof ScheduleDataLoader
   * 
   * @returns {Map<string, Array<Object>>} Map where:
   *   - **Key**: Student ID (string) - Unique student identifier
   *   - **Value**: Array of course objects, each containing schedule details for one course
   * 
   * @throws {Error} Throws if sheet access fails or data structure is invalid
   * 
   * @example
   * // Load and process schedule data
   * const loader = new ScheduleDataLoader();
   * const scheduleData = loader.loadData();
   * 
   * // Display student course load
   * scheduleData.forEach((courses, studentId) => {
   *   console.log(`Student ${studentId} has ${courses.length} active courses`);
   *   courses.forEach(course => {
   *     console.log(`  - ${course.COURSE_NAME} (Period ${course.PERIOD})`);
   *   });
   * });
   * 
   * @example  
   * // Error handling
   * try {
   *   const loader = new ScheduleDataLoader();
   *   const data = loader.loadData();
   *   if (data.size === 0) {
   *     console.warn('No schedule data loaded - check sheet access');
   *   }
   * } catch (error) {
   *   console.error('Failed to load schedule data:', error.message);
   * }
   * 
   * @see {@link BaseDataLoader#loadData} For inherited loading functionality
   * @see {@link processRowData} For withdrawal filtering logic
   * 
   * @since 2.0.0
   */
  loadData() {
    try {
      console.log('Loading schedule data...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading schedule data:', error);
      return new Map();
    }
  }

  /**
   * Custom filtering to exclude courses with withdrawal dates
   * @param {Object} rowData - Row data object
   * @returns {boolean} True if row should be included (no withdrawal date)
   */
  shouldIncludeRow(rowData) {
    const withdrawDate = rowData[COLUMN_NAMES.WITHDRAW_DATE];
    return !withdrawDate || withdrawDate === '' || withdrawDate === null;
  }

  /**
   * Custom processing to filter rows and group by student
   * @param {Array} data - Raw sheet data
   * @param {Array} headers - Column headers
   * @param {number} keyColumnIndex - Index of the key column
   * @returns {Map} Processed schedule data map
   */
  processRows(data, headers, keyColumnIndex) {
    const resultMap = new Map();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const studentId = this.extractKey(row[keyColumnIndex]);
      
      if (studentId === null) continue;

      const rowData = this.createRowObject(row, headers);
      
      // Apply custom filtering
      if (!this.shouldIncludeRow(rowData)) {
        continue;
      }

      if (resultMap.has(studentId)) {
        resultMap.get(studentId).push(rowData);
      } else {
        resultMap.set(studentId, [rowData]);
      }
    }

    return resultMap;
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original schedulesSheet function
 * @returns {Map} A map where the key is the Student ID and values are schedule data arrays
 */
function schedulesSheet() {
  const loader = new ScheduleDataLoader();
  return loader.loadData();
}
