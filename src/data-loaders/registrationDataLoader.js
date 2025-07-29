/**
 * Registration Data Loader
 * 
 * Loads data from the Registrations SY 24.25 sheet and converts it to a Map
 * for easier processing.
 */

class RegistrationDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.REGISTRATIONS, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads registration data from the Registrations sheet
   * This replaces the original loadRegistrationsData function
   * @returns {Map} Map where keys are student IDs and values are registration data
   */
  loadData() {
    try {
      console.log('Loading registration data...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading registration data:', error);
      return new Map();
    }
  }

  /**
   * Custom processing to handle latest registration data per student
   * @param {Array} data - Raw sheet data
   * @param {Array} headers - Column headers
   * @param {number} keyColumnIndex - Index of the key column
   * @returns {Map} Processed registration data map
   */
  processRows(data, headers, keyColumnIndex) {
    const resultMap = new Map();
    const latestDates = {};

    // Find latest start date for each student (mimicking original logic)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const studentId = this.extractKey(row[keyColumnIndex]);
      
      if (studentId === null) continue;

      const startDateIndex = headers.indexOf('Start Date');
      if (startDateIndex !== -1) {
        const startDate = new Date(row[startDateIndex]);
        
        if (!latestDates[studentId] || startDate > latestDates[studentId]) {
          latestDates[studentId] = startDate;
          
          const rowData = this.createRowObject(row, headers);
          resultMap.set(studentId, [rowData]);
        }
      }
    }

    return resultMap;
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original loadRegistrationsData function
 * @returns {Map} A map where the key is the Student ID and values are registration data
 */
function loadRegistrationsData() {
  const loader = new RegistrationDataLoader();
  return loader.loadData();
}
