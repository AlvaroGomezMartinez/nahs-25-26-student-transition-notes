/**
 * Tentative Data Loader
 * 
 * Loads data from the TENTATIVE-Version2 sheet and converts it to a Map
 * for easier processing.
 */

class TentativeDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.TENTATIVE_V2, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads students from TENTATIVE-Version2 sheet as the primary source
   * This establishes the base student list that will be enhanced
   * with other data
   * @returns {Map} Map where keys are student IDs and values are arrays of student data
   */
  loadData() {
    try {
      console.log(
        "Loading PRIMARY student data from TENTATIVE-Version2 sheet..."
      );
      const data = super.loadData();
      console.log(
        `Loaded ${data.size} students from TENTATIVE-Version2 (primary source)`
      );
      return data;
    } catch (error) {
      console.error("Error loading tentative data:", error);
      return new Map();
    }
  }

  /**
   * Captures row colors for user's workflow tracking
   */
  loadDataWithColors() {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        SHEET_NAMES.TENTATIVE_V2
      );
      if (!sheet) {
        console.error(`Sheet '${SHEET_NAMES.TENTATIVE_V2}' not found`);
        return { data: new Map(), colors: {} };
      }

      const data = this.loadData();
      const colors = this.captureRowColors(sheet);

      return { data, colors };
    } catch (error) {
      console.error("Error loading data with colors:", error);
      return { data: new Map(), colors: {} };
    }
  }

  /**
   * Captures existing row colors for workflow preservation
   */
  captureRowColors(sheet) {
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const backgrounds = dataRange.getBackgrounds();

    const studentColors = {};

    for (let i = 1; i < values.length; i++) {
      // Skip header row
      const studentId = values[i][3]; // Column D contains student ID
      if (studentId) {
        studentColors[studentId] = backgrounds[i];
      }
    }

    return studentColors;
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
