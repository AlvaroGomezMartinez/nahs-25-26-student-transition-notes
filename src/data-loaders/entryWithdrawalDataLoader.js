/**
 * @fileoverview Entry Withdrawal Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading student entry
 * and withdrawal data from the Entry/Withdrawal tracking sheet. It handles
 * critical transition timing information including enrollment dates, withdrawal
 * dates, and transition status tracking essential for student movement coordination.
 * 
 * The entry/withdrawal data provides the official record of student transitions
 * and is used to determine current enrollment status and transition timing.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Loads student entry and withdrawal data from the Entry/Withdrawal sheet.
 * 
 * This specialized data loader handles official student transition records
 * including entry dates, withdrawal dates, and transition status information.
 * This data is critical for determining current enrollment status and
 * coordinating student transitions between schools or programs.
 * 
 * **Key Features:**
 * - **Transition Tracking**: Official entry and withdrawal date records
 * - **Status Monitoring**: Current enrollment and transition status
 * - **Historical Data**: Complete transition history for each student
 * - **Coordination Support**: Data needed for inter-school transitions
 * - **Compliance Records**: Official documentation for transition processes
 * 
 * @class EntryWithdrawalDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Load entry/withdrawal data
 * const loader = new EntryWithdrawalDataLoader();
 * const transitionData = loader.loadData();
 * console.log(`Loaded transition data for ${transitionData.size} students`);
 * 
 * @example
 * // Check student transition status
 * const loader = new EntryWithdrawalDataLoader();
 * const data = loader.loadData();
 * const studentTransition = data.get('123456');
 * if (studentTransition) {
 *   console.log(`Entry Date: ${studentTransition.ENTRY_DATE}`);
 *   console.log(`Status: ${studentTransition.TRANSITION_STATUS}`);
 * }
 * 
 * @since 2.0.0
 */
class EntryWithdrawalDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.ENTRY_WITHDRAWAL, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads entry/withdrawal data
   * This replaces the original loadEntryWithdrawalData function
   * @returns {Map} Map where keys are student IDs and values are entry/withdrawal data
   */
  loadData() {
    try {
      console.log('Loading entry/withdrawal data...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading entry/withdrawal data:', error);
      return new Map();
    }
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original loadEntryWithdrawalData function
 * @returns {Map} A map where the key is the Student ID and values are entry/withdrawal data
 */
function loadEntryWithdrawalData() {
  const loader = new EntryWithdrawalDataLoader();
  return loader.loadData();
}
