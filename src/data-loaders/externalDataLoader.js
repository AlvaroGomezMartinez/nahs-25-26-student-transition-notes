/**
 * @fileoverview External Data Loader for accessing sheets in external spreadsheets.
 * 
 * This loader extends BaseDataLoader to handle data from external Google Spreadsheets.
 * It's specifically designed for sheets that exist outside the main project spreadsheet.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * External Data Loader class for accessing sheets in external spreadsheets.
 * 
 * This class extends BaseDataLoader to handle data sources that exist in
 * separate Google Spreadsheets. It automatically handles external spreadsheet
 * access based on configuration in SHEET_LOCATIONS.
 * 
 * @class ExternalDataLoader
 * @extends BaseDataLoader
 * 
 * @example
 * // Load registration data from external spreadsheet
 * const registrationLoader = new ExternalDataLoader(
 *   SHEET_NAMES.REGISTRATIONS, 
 *   COLUMN_NAMES.STUDENT_ID
 * );
 * const data = registrationLoader.loadData();
 * 
 * @since 2.0.0
 */
class ExternalDataLoader extends BaseDataLoader {
  /**
   * Creates a new ExternalDataLoader instance.
   * 
   * @constructor
   * @param {string} sheetName - Name of the sheet in the external spreadsheet
   * @param {string} keyColumn - Column name to use as the key for the resulting Map
   * @param {boolean} [allowMultipleRecords=false] - Whether to allow multiple records per key
   * @param {string} [externalSpreadsheetId=null] - Optional override for external spreadsheet ID
   * 
   * @throws {Error} Throws if external spreadsheet configuration is missing
   * 
   * @since 2.0.0
   */
  constructor(sheetName, keyColumn, allowMultipleRecords = false, externalSpreadsheetId = null) {
    // Determine external spreadsheet ID
    const spreadsheetId = externalSpreadsheetId || ExternalDataLoader.getExternalSpreadsheetId(sheetName);
    
    if (!spreadsheetId) {
      throw new Error(`No external spreadsheet ID configured for sheet: ${sheetName}`);
    }
    
    super(sheetName, keyColumn, allowMultipleRecords, spreadsheetId);
  }

  /**
   * Gets the external spreadsheet ID for a given sheet name.
   * 
   * This method maps sheet names to their corresponding external spreadsheet IDs
   * based on the EXTERNAL_SPREADSHEETS configuration.
   * 
   * @static
   * @param {string} sheetName - The name of the sheet
   * @returns {string|null} The external spreadsheet ID, or null if not configured
   * 
   * @since 2.0.0
   */
  static getExternalSpreadsheetId(sheetName) {
    // Map sheet names to external spreadsheet IDs
    const sheetMappings = {
      [SHEET_NAMES.REGISTRATIONS]: EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE,
      [SHEET_NAMES.ATTENDANCE]: EXTERNAL_SPREADSHEETS.ATTENDANCE_SOURCE,
      [SHEET_NAMES.TRACKING_SHEET]: EXTERNAL_SPREADSHEETS.TRACKING_SOURCE
    };
    
    return sheetMappings[sheetName] || null;
  }

  /**
   * Loads data with additional external spreadsheet error handling.
   * 
   * @returns {Map} Map of loaded data or empty Map if error occurs
   * 
   * @since 2.0.0
   */
  loadData() {
    try {
      console.log(`Loading external data from sheet: ${this.sheetName}`);
      console.log(`External spreadsheet ID: ${this.externalSpreadsheetId}`);
      
      return super.loadData();
    } catch (error) {
      console.error(`Error loading external data from '${this.sheetName}':`, error.message);
      
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        console.error('External spreadsheet may not be accessible or may not exist');
        console.error('Please verify:');
        console.error('1. The spreadsheet ID is correct');
        console.error('2. You have access permissions to the external spreadsheet');
        console.error('3. The sheet name exists in the external spreadsheet');
      }
      
      return new Map();
    }
  }

  /**
   * Validates external spreadsheet access.
   * 
   * This method checks if the external spreadsheet can be accessed and
   * if the target sheet exists within it.
   * 
   * @returns {Object} Validation result with success status and details
   * 
   * @since 2.0.0
   */
  validateAccess() {
    const result = {
      canAccessSpreadsheet: false,
      sheetExists: false,
      error: null
    };

    try {
      const spreadsheet = SpreadsheetApp.openById(this.externalSpreadsheetId);
      result.canAccessSpreadsheet = true;
      
      const sheet = spreadsheet.getSheetByName(this.sheetName);
      if (sheet) {
        result.sheetExists = true;
      } else {
        result.error = `Sheet '${this.sheetName}' not found in external spreadsheet`;
      }
    } catch (error) {
      result.error = `Cannot access external spreadsheet: ${error.message}`;
    }

    return result;
  }
}

/**
 * Creates appropriate data loader based on sheet location configuration.
 * 
 * This factory function automatically creates the correct type of data loader
 * (regular BaseDataLoader for local sheets or ExternalDataLoader for external sheets)
 * based on the SHEET_LOCATIONS configuration.
 * 
 * @function createDataLoader
 * @param {string} sheetName - Name of the sheet to load
 * @param {string} keyColumn - Column name to use as key
 * @param {boolean} [allowMultipleRecords=false] - Whether to allow multiple records per key
 * @returns {BaseDataLoader|ExternalDataLoader} Appropriate data loader instance
 * 
 * @example
 * // Automatically creates external loader for external sheets
 * const loader = createDataLoader(SHEET_NAMES.REGISTRATIONS, COLUMN_NAMES.STUDENT_ID);
 * const data = loader.loadData();
 * 
 * @since 2.0.0
 */
function createDataLoader(sheetName, keyColumn, allowMultipleRecords = false) {
  const isExternal = SHEET_LOCATIONS && SHEET_LOCATIONS[sheetName] === 'EXTERNAL';
  
  if (isExternal) {
    return new ExternalDataLoader(sheetName, keyColumn, allowMultipleRecords);
  } else {
    return new BaseDataLoader(sheetName, keyColumn, allowMultipleRecords);
  }
}
