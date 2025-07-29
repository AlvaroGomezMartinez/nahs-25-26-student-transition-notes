/**
 * Schedule Data Loader
 * 
 * Loads data from the Schedules sheet and converts it to a Map
 * Filters out courses with withdrawal dates.
 */

class ScheduleDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.SCHEDULES, COLUMN_NAMES.STUDENT_ID, true);
  }

  /**
   * Loads schedule data from the Schedules sheet
   * This replaces the original schedulesSheet function
   * @returns {Map} Map where keys are student IDs and values are arrays of schedule data
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
