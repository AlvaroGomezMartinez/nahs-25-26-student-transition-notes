/**
 * @fileoverview Registration Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading student registration
 * data from external spreadsheets containing Form Responses 1 data. It handles
 * the integration with external registration systems and provides critical
 * student enrollment information for transition tracking.
 * 
 * The registration data includes student contact information, course preferences,
 * and enrollment details that inform transition decisions.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Loads student registration data from external Form Responses spreadsheets.
 * 
 * This specialized data loader connects to external spreadsheets containing
 * student registration information from Form Responses 1. It provides access
 * to critical enrollment data, contact information, and course preferences
 * needed for effective student transition management.
 * 
 * **Key Features:**
 * - **External Spreadsheet Access**: Connects to registration form responses
 * - **Student Contact Data**: Provides current contact and demographic information  
 * - **Course Preferences**: Access to student course selection data
 * - **Enrollment Information**: Critical registration status and details
 * - **Error Resilience**: Graceful handling of external data source issues
 * 
 * @class RegistrationDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Basic registration data loading
 * const loader = new RegistrationDataLoader();
 * const registrationData = loader.loadData();
 * console.log(`Loaded registration data for ${registrationData.size} students`);
 * 
 * @example
 * // Access student contact information
 * const loader = new RegistrationDataLoader();
 * const data = loader.loadData();
 * const studentReg = data.get('123456');
 * if (studentReg) {
 *   console.log(`Contact: ${studentReg.PARENT_EMAIL}, Phone: ${studentReg.PHONE}`);
 * }
 * 
 * @since 2.0.0
 */
class RegistrationDataLoader extends BaseDataLoader {
  /**
   * Creates a new RegistrationDataLoader instance.
   * 
   * Configures the loader to access registration data from external spreadsheets
   * containing Form Responses 1 data. Sets up connection to the configured
   * registration data source with proper Student ID column mapping.
   * 
   * @constructor
   * @memberof RegistrationDataLoader
   * 
   * @example
   * // Create registration loader
   * const loader = new RegistrationDataLoader();
   * // Loader is configured to use EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE
   * 
   * @since 2.0.0
   */
  constructor() {
    // Use external spreadsheet ID for registration data
    // The Student ID column contains the actual student IDs
    const externalSpreadsheetId = EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE;
    super(SHEET_NAMES.REGISTRATIONS, COLUMN_NAMES.STUDENT_ID, false, externalSpreadsheetId);
  }

  /**
   * Loads registration data from the external Form Responses sheet.
   * 
   * This method connects to the configured external registration spreadsheet
   * and loads student registration information including contact details,
   * course preferences, and enrollment data. This data is critical for
   * informed student transition decisions.
   * 
   * @function loadData
   * @memberof RegistrationDataLoader
   * 
   * @returns {Map<string, Object>} Map where:
   *   - **Key**: Student ID (string) - Unique student identifier
   *   - **Value**: Registration data object containing contact info, course preferences, and enrollment details
   * 
   * @throws {Error} Throws if external spreadsheet access fails or data structure is invalid
   * 
   * @example
   * // Load registration data
   * const loader = new RegistrationDataLoader();
   * const registrationData = loader.loadData();
   * 
   * // Process student contact information
   * registrationData.forEach((data, studentId) => {
   *   console.log(`Student ${studentId}: ${data.PARENT_EMAIL}`);
   * });
   * 
   * @example
   * // Error handling for external data source
   * try {
   *   const loader = new RegistrationDataLoader();
   *   const data = loader.loadData();
   *   if (data.size === 0) {
   *     console.warn('No registration data loaded - check external spreadsheet access');
   *   }
   * } catch (error) {
   *   console.error('Failed to load registration data:', error.message);
   *   // Graceful degradation - continue without registration data
   * }
   * 
   * @see {@link BaseDataLoader#loadData} For inherited loading functionality
   * @see {@link EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE} For data source configuration
   * 
   * @since 2.0.0
   */
  loadData() {
    try {
      console.log('Loading registration data from external spreadsheet...');
      console.log('External spreadsheet ID:', EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
      
      const result = super.loadData();
      
      // Debug: Log registration data loading results
      console.log(`DEBUG: Registration data loading results:`);
      console.log(`  Total students loaded: ${result.size}`);
      
      if (result.size > 0) {
        const sampleStudentIds = Array.from(result.keys()).slice(0, 5);
        console.log(`  Sample student IDs: [${sampleStudentIds.join(', ')}]`);
        
        // Log specific students we're looking for
        const targetStudents = ['787581', '753881'];
        targetStudents.forEach(studentId => {
          if (result.has(studentId)) {
            const data = result.get(studentId);
            console.log(`  Student ${studentId} registration data found:`);
            console.log(`    Placement Days: ${data["Placement Days"]}`);
            console.log(`    Keys: [${Object.keys(data).join(', ')}]`);
          } else {
            console.log(`  Student ${studentId} NOT found in registration data`);
          }
        });
      } else {
        console.log(`  WARNING: No registration data loaded!`);
      }
      
      return result;
    } catch (error) {
      console.error('Error loading registration data:', error);
      console.error('Note: Registration data is expected to be in an external spreadsheet');
      console.error('Please verify the EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE configuration');
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
