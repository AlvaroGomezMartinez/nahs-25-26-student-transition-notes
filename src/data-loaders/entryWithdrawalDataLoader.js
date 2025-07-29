/**
 * Entry Withdrawal Data Loader
 * 
 * Loads entry and withdrawal data for students
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
