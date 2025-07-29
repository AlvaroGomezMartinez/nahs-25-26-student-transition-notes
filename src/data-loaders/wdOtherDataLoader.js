/**
 * WD Other Data Loader
 * 
 * Loads data from the W/D Other sheet (used for filtering)
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
