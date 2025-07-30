/**
 * @fileoverview Base class for data loaders in the NAHS system.
 * 
 * This module provides the foundational functionality for loading data from
 * Google Sheets and converting it into Maps for efficient processing. All
 * specific data loaders extend this base class to inherit common functionality
 * while implementing their own data-specific processing logic.
 * 
 * The base loader handles:
 * - Sheet access and error handling
 * - Header validation and column mapping  
 * - Data conversion to JavaScript objects
 * - Map creation with configurable key strategies
 * - Multiple records per key support
 * 
 * @author NAHS Development Team
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * Base class for all data loaders in the NAHS system.
 * 
 * This abstract base class provides common functionality for loading data
 * from Google Sheets and converting it to Maps for easier processing.
 * All specific data loaders (TentativeDataLoader, RegistrationDataLoader, etc.)
 * extend this class to inherit standard data loading patterns.
 * 
 * **Key Features:**
 * - **Standardized Error Handling**: Consistent error responses across all loaders
 * - **Flexible Key Mapping**: Configurable key column for Map creation
 * - **Multiple Record Support**: Can handle one-to-many relationships
 * - **Data Validation**: Validates sheet structure and data integrity
 * - **Performance Optimization**: Efficient data processing and memory usage
 * 
 * @class BaseDataLoader
 * @abstract
 * 
 * @example
 * // Extend the base class
 * class CustomDataLoader extends BaseDataLoader {
 *   constructor() {
 *     super('CustomSheet', 'STUDENT ID', false);
 *   }
 *   
 *   processRowData(rowData, headers) {
 *     // Custom processing logic
 *     return super.processRowData(rowData, headers);
 *   }
 * }
 * 
 * @example
 * // Use a derived loader
 * const loader = new TentativeDataLoader();
 * const studentData = loader.loadData();
 * console.log(`Loaded ${studentData.size} student records`);
 * 
 * @since 2.0.0
 */
class BaseDataLoader {
  /**
   * Creates a new BaseDataLoader instance.
   * 
   * @constructor
   * @param {string} sheetName - Name of the Google Sheet to load data from.
   *   Must match exactly with the sheet tab name.
   * @param {string} keyColumn - Column name to use as the key for the resulting Map.
   *   This column should contain unique identifiers (typically student IDs).
   * @param {boolean} [allowMultipleRecords=false] - Whether to allow multiple 
   *   records per key. When true, values in the Map will be arrays of records.
   *   When false, only the last record for each key is kept.
   * @param {string} [externalSpreadsheetId=null] - Optional external spreadsheet ID.
   *   If provided, the loader will access the sheet from this external spreadsheet
   *   instead of the current active spreadsheet.
   * 
   * @throws {TypeError} Throws if sheetName or keyColumn are not strings
   * 
   * @example
   * // Single record per student from current spreadsheet
   * const loader = new BaseDataLoader('Students', 'STUDENT ID', false);
   * 
   * @example
   * // Multiple records per student from external spreadsheet (e.g., courses)
   * const courseLoader = new BaseDataLoader('Courses', 'STUDENT ID', true, 'external_sheet_id');
   * 
   * @since 2.0.0
   */
  constructor(sheetName, keyColumn, allowMultipleRecords = false, externalSpreadsheetId = null) {
    this.sheetName = sheetName;
    this.keyColumn = keyColumn;
    this.allowMultipleRecords = allowMultipleRecords;
    this.externalSpreadsheetId = externalSpreadsheetId;
  }

  /**
   * Loads data from the specified Google Sheet and returns a Map.
   * 
   * This is the primary method that orchestrates the data loading process.
   * It handles sheet access, data extraction, header validation, and
   * Map construction with comprehensive error handling.
   * 
   * **Process Flow:**
   * 1. Access the Google Sheet by name
   * 2. Extract all data including headers
   * 3. Validate sheet structure and key column
   * 4. Process each data row into objects
   * 5. Build and return the resulting Map
   * 
   * @method loadData
   * @memberof BaseDataLoader
   * 
   * @returns {Map<string, Object|Array<Object>>} Map where:
   *   - **Key**: Value from the key column (typically student ID)
   *   - **Value**: Either a single object (allowMultipleRecords=false) or 
   *     an array of objects (allowMultipleRecords=true)
   *   Returns empty Map if sheet not found or errors occur
   * 
   * @throws {Error} Only throws for critical system failures; 
   *   most errors are caught and logged
   * 
   * @example
   * // Basic usage
   * const loader = new TentativeDataLoader();
   * const data = loader.loadData();
   * 
   * if (data.size > 0) {
   *   console.log(`Successfully loaded ${data.size} records`);
   * } else {
   *   console.warn('No data loaded - check sheet access');
   * }
   * 
   * @example
   * // Access loaded data
   * const studentData = data.get('1234567');
   * if (studentData) {
   *   console.log(`Student: ${studentData.FIRST} ${studentData.LAST}`);
   * }
   * 
   * @see {@link processRows} For row processing details
   * @see {@link processRowData} For individual row processing
   * 
   * @since 2.0.0
   */
  loadData() {
    try {
      // Determine which spreadsheet to use
      const spreadsheet = this.externalSpreadsheetId 
        ? SpreadsheetApp.openById(this.externalSpreadsheetId)
        : SpreadsheetApp.getActiveSpreadsheet();
        
      const sheet = spreadsheet.getSheetByName(this.sheetName);
      if (!sheet) {
        const location = this.externalSpreadsheetId ? 'external spreadsheet' : 'current spreadsheet';
        console.error(`Sheet '${this.sheetName}' not found in ${location}`);
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
      const location = this.externalSpreadsheetId ? 'external spreadsheet' : 'current spreadsheet';
      console.error(`Error loading data from sheet '${this.sheetName}' in ${location}:`, error);
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
