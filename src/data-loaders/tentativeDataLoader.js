/**
 * Tentative Data Loader
 * 
 * Loads data from the TENTATIVE-Version2 sheet and converts it to a Map
 * for easier processing.
 */

class TentativeDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.TENTATIVE_V2, COLUMN_NAMES.STUDENT_ID, true);
  }

  /**
   * Loads students from TENTATIVE-Version2 sheet
   * This replaces the original getStudentsFromTENTATIVESheet function
   * @returns {Map} Map where keys are student IDs and values are arrays of student data
   */
  loadData() {
    try {
      console.log('Loading data from TENTATIVE-Version2 sheet...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading tentative data:', error);
      return new Map();
    }
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original getStudentsFromTENTATIVESheet function
 * @returns {Map} A map where the key is the Student ID and values are student data objects
 */
function getStudentsFromTENTATIVESheet() {
  const loader = new TentativeDataLoader();
  return loader.loadData();
}
