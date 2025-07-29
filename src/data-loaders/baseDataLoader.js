/**
 * Base class for data loaders
 * 
 * Provides common functionality for loading data from Google Sheets
 * and converting it to Maps for easier processing.
 */

class BaseDataLoader {
  /**
   * Creates a new BaseDataLoader
   * @param {string} sheetName - Name of the sheet to load from
   * @param {string} keyColumn - Column name to use as the key for the Map
   * @param {boolean} allowMultipleRecords - Whether to allow multiple records per key
   */
  constructor(sheetName, keyColumn, allowMultipleRecords = false) {
    this.sheetName = sheetName;
    this.keyColumn = keyColumn;
    this.allowMultipleRecords = allowMultipleRecords;
  }

  /**
   * Loads data from the sheet and returns a Map
   * @returns {Map} Map where keys are student IDs and values are student data
   */
  loadData() {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.sheetName);
      if (!sheet) {
        console.error(`Sheet '${this.sheetName}' not found`);
        return new Map();
      }

      const data = sheet.getDataRange().getValues();
      if (data.length === 0) {
        console.warn(`Sheet '${this.sheetName}' is empty`);
        return new Map();
      }

      const headers = data[0];
      const keyColumnIndex = headers.indexOf(this.keyColumn);
      
      if (keyColumnIndex === -1) {
        console.error(`Key column '${this.keyColumn}' not found in sheet '${this.sheetName}'`);
        return new Map();
      }

      return this.processRows(data, headers, keyColumnIndex);
    } catch (error) {
      console.error(`Error loading data from sheet '${this.sheetName}':`, error);
      return new Map();
    }
  }

  /**
   * Processes rows and creates the Map structure
   * @param {Array} data - Raw sheet data
   * @param {Array} headers - Column headers
   * @param {number} keyColumnIndex - Index of the key column
   * @returns {Map} Processed data map
   */
  processRows(data, headers, keyColumnIndex) {
    const resultMap = new Map();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const keyValue = this.extractKey(row[keyColumnIndex]);
      
      if (keyValue === null || keyValue === undefined) {
        console.warn(`Invalid key value at row ${i + 1} in sheet '${this.sheetName}'`);
        continue;
      }

      const rowData = this.createRowObject(row, headers);
      
      if (this.allowMultipleRecords) {
        if (resultMap.has(keyValue)) {
          resultMap.get(keyValue).push(rowData);
        } else {
          resultMap.set(keyValue, [rowData]);
        }
      } else {
        if (resultMap.has(keyValue)) {
          console.warn(`Duplicate key '${keyValue}' found in sheet '${this.sheetName}'. Using latest value.`);
        }
        resultMap.set(keyValue, [rowData]);
      }
    }

    return resultMap;
  }

  /**
   * Extracts the key from a cell value (override in subclasses if needed)
   * @param {*} cellValue - The cell value
   * @returns {*} The extracted key
   */
  extractKey(cellValue) {
    // For student ID columns, try to extract numeric ID
    if (this.keyColumn === COLUMN_NAMES.STUDENT_ID) {
      return extractStudentId(cellValue);
    }
    return cellValue;
  }

  /**
   * Creates a row object from row data and headers
   * @param {Array} row - Row data
   * @param {Array} headers - Column headers
   * @returns {Object} Row object with headers as keys
   */
  createRowObject(row, headers) {
    const rowData = {};
    for (let j = 0; j < headers.length; j++) {
      rowData[headers[j]] = row[j];
    }
    return rowData;
  }

  /**
   * Applies custom filtering logic (override in subclasses)
   * @param {Object} rowData - Row data object
   * @returns {boolean} True if row should be included
   */
  shouldIncludeRow(rowData) {
    return true; // Default: include all rows
  }
}
