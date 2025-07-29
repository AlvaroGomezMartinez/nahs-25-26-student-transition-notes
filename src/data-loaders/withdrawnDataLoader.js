/**
 * Withdrawn Students Data Loader
 * 
 * Loads data about withdrawn students (used for filtering)
 */

class WithdrawnDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.WITHDRAWN, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads withdrawn students data
   * This replaces the original getWithdrawnStudentsSheet function
   * @returns {Map} Map where keys are student IDs and values are withdrawn data
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
