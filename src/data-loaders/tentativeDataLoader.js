/**
 * @fileoverview Tentative Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading student data
 * from the TENTATIVE-Version2 sheet, which serves as the primary data source
 * for student transitions. It handles color preservation for workflow tracking
 * and provides the foundation student data that other loaders will enhance.
 * 
 * @author NAHS Development Team
 * @version 2.0.0 
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Loads student data from the TENTATIVE-Version2 sheet.
 * 
 * This loader serves as the primary data source, establishing the base
 * student list that will be enhanced with data from other sources. It
 * provides specialized functionality for color preservation to maintain
 * user workflow tracking.
 * 
 * @class TentativeDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Basic usage
 * const loader = new TentativeDataLoader();
 * const studentData = loader.loadData();
 * console.log(`Loaded ${studentData.size} students`);
 * 
 * @example  
 * // Load with color preservation
 * const loader = new TentativeDataLoader();
 * const result = loader.loadDataWithColors();
 * console.log(`Data: ${result.data.size} students, Colors: ${Object.keys(result.colors).length} rows`);
 * 
 * @since 2.0.0
 */

class TentativeDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.TENTATIVE_V2, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads students from TENTATIVE-Version2 sheet as the primary source.
   * 
   * This method establishes the base student list that will be enhanced
   * with data from other sources. It uses the inherited BaseDataLoader
   * functionality with TENTATIVE-Version2 specific configuration.
   * 
   * @function loadData
   * @memberof TentativeDataLoader
   * 
   * @returns {Map<string, Object>} Map where:
   *   - **Key**: Student ID (string) - Unique student identifier
   *   - **Value**: Student data object from TENTATIVE-Version2 sheet
   * 
   * @throws {Error} Throws if sheet access fails or data structure is invalid
   * 
   * @example
   * // Standard usage
   * const loader = new TentativeDataLoader();
   * const data = loader.loadData();
   * 
   * // Access specific student
   * const student = data.get('123456');
   * if (student) {
   *   console.log(`${student.FIRST} ${student.LAST} - Grade ${student.GRADE}`);
   * }
   * 
   * @example
   * // Error handling
   * try {
   *   const data = loader.loadData();
   *   if (data.size === 0) {
   *     console.warn('No tentative data found - check sheet access');
   *   }
   * } catch (error) {
   *   console.error('Failed to load tentative data:', error.message);
   * }
   * 
   * @see {@link BaseDataLoader#loadData} For inherited functionality
   * @see {@link loadDataWithColors} For color-aware loading
   * 
   * @since 2.0.0
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
