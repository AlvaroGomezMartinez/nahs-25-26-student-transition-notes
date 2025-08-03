/**
 * @fileoverview W/D Other Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading data about
 * students in the W/D Other category from the W/D Other tracking sheet.
 * It supports filtering operations and status tracking for students who
 * have special withdrawal or transition circumstances requiring separate handling.
 * 
 * The W/D Other category includes students with unique transition situations
 * that require special processing or exclusion from standard workflows.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Loads W/D Other students data for specialized tracking and filtering.
 * 
 * This specialized data loader handles students in the W/D Other category,
 * which includes students with unique withdrawal or transition circumstances
 * that require special handling. It provides filtering capabilities and
 * status tracking for these exceptional cases.
 * 
 * **Key Features:**
 * - **Special Category Tracking**: Handles W/D Other classification students
 * - **Filtering Support**: Enables special processing for exceptional cases
 * - **Status Classification**: Maintains detailed status information
 * - **Exception Handling**: Supports non-standard transition scenarios
 * - **Compliance Tracking**: Ensures proper documentation of special cases
 * 
 * @class WDOtherDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Load W/D Other students for special processing
 * const loader = new WDOtherDataLoader();
 * const wdOtherData = loader.loadData();
 * console.log(`Found ${wdOtherData.size} W/D Other students`);
 * 
 * @example
 * // Check if student requires special handling
 * const loader = new WDOtherDataLoader();
 * const wdOtherStudents = loader.loadData();
 * const requiresSpecialHandling = wdOtherStudents.has('123456');
 * if (requiresSpecialHandling) {
 *   console.log('Student requires special W/D Other processing');
 * }
 * 
 * @since 2.0.0
 */
class WDOtherDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.WD_OTHER, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads W/D Other students data
   * This replaces the original getWDOtherSheet function
   * @returns {Map} Map where keys are student IDs and values are W/D Other data
   */
  loadData() {
    try {
      console.log('Loading W/D Other students data...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading W/D Other students data:', error);
      return new Map();
    }
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original getWDOtherSheet function
 * @returns {Map} A map where the key is the Student ID and values are W/D Other data
 */
function getWDOtherSheet() {
  const loader = new WDOtherDataLoader();
  return loader.loadData();
}
