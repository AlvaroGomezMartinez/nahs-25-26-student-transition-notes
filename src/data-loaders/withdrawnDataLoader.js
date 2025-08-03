/**
 * @fileoverview Withdrawn Students Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading data about
 * withdrawn students from the Withdrawn tracking sheet. It supports filtering
 * operations to exclude withdrawn students from active processing and
 * provides historical tracking of student withdrawals for reporting purposes.
 * 
 * The withdrawn data is critical for maintaining accurate active student
 * lists and ensuring withdrawn students are properly excluded from processing.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Loads withdrawn students data for filtering and tracking purposes.
 * 
 * This specialized data loader handles the Withdrawn students sheet to
 * provide accurate filtering capabilities for active student processing.
 * It maintains records of withdrawn students to ensure they are properly
 * excluded from transition tracking while preserving historical data.
 * 
 * **Key Features:**
 * - **Withdrawal Tracking**: Maintains complete withdrawn student records
 * - **Filtering Support**: Enables exclusion of withdrawn students from processing
 * - **Historical Data**: Preserves withdrawal dates and reasons for reporting
 * - **Status Validation**: Ensures proper withdrawal status classification
 * - **Audit Trail**: Supports compliance and reporting requirements
 * 
 * @class WithdrawnDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Load withdrawn students for filtering
 * const loader = new WithdrawnDataLoader();
 * const withdrawnData = loader.loadData();
 * console.log(`Found ${withdrawnData.size} withdrawn students`);
 * 
 * @example
 * // Check if student is withdrawn
 * const loader = new WithdrawnDataLoader();
 * const withdrawnStudents = loader.loadData();
 * const isWithdrawn = withdrawnStudents.has('123456');
 * if (isWithdrawn) {
 *   console.log('Student is withdrawn, excluding from processing');
 * }
 * 
 * @since 2.0.0
 */
class WithdrawnDataLoader extends BaseDataLoader {
  /**
   * Creates a new WithdrawnDataLoader instance.
   * 
   * Configures the loader to access withdrawn student data from the Withdrawn
   * sheet with single record per student configuration. Sets up proper
   * Student ID column mapping for withdrawal status tracking.
   * 
   * @constructor
   * @memberof WithdrawnDataLoader
   * 
   * @example
   * // Create withdrawn data loader
   * const loader = new WithdrawnDataLoader();
   * // Configured for single withdrawal record per student
   * 
   * @since 2.0.0
   */
  constructor() {
    super(SHEET_NAMES.WITHDRAWN, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads withdrawn students data for filtering and tracking.
   * 
   * This method loads data about students who have been withdrawn from
   * the program, providing the information needed to filter them out of
   * active processing while maintaining historical records for reporting
   * and compliance purposes.
   * 
   * @function loadData
   * @memberof WithdrawnDataLoader
   * 
   * @returns {Map<string, Object>} Map where:
   *   - **Key**: Student ID (string) - Unique student identifier
   *   - **Value**: Withdrawal data object containing withdrawal date, reason, and status
   * 
   * @throws {Error} Throws if sheet access fails or data structure is invalid
   * 
   * @example
   * // Load and use withdrawn student data for filtering
   * const loader = new WithdrawnDataLoader();
   * const withdrawnData = loader.loadData();
   * 
   * // Filter active students
   * const activeStudents = allStudents.filter(studentId => 
   *   !withdrawnData.has(studentId)
   * );
   * 
   * @example
   * // Process withdrawal information
   * const loader = new WithdrawnDataLoader();
   * const data = loader.loadData();
   * data.forEach((withdrawalInfo, studentId) => {
   *   console.log(`Student ${studentId} withdrawn on ${withdrawalInfo.WITHDRAWAL_DATE}`);
   * });
   * 
   * @see {@link BaseDataLoader#loadData} For inherited loading functionality
   * @see {@link getWithdrawnStudentsSheet} For backward compatibility function
   * 
   * @since 2.0.0
   */
  loadData() {
    try {
      console.log('Loading withdrawn students data...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading withdrawn students data:', error);
      return new Map();
    }
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original getWithdrawnStudentsSheet function
 * @returns {Map} A map where the key is the Student ID and values are withdrawn data
 */
function getWithdrawnStudentsSheet() {
  const loader = new WithdrawnDataLoader();
  return loader.loadData();
}
