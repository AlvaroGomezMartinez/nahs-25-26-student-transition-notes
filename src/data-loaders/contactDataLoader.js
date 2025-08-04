/**
 * @fileoverview Contact Data Loader for the NAHS system.
 * 
 * This module provides specialized functionality for loading student contact
 * information from the ContactInfo sheet. It handles parent/guardian contact
 * details, emergency contacts, and communication preferences critical for
 * student transition coordination and family outreach.
 * 
 * The contact data includes phone numbers, email addresses, and preferred
 * communication methods needed for effective family engagement during transitions.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Loads student contact information from the ContactInfo sheet.
 * 
 * This specialized data loader handles student and family contact information
 * including parent/guardian details, emergency contacts, and communication
 * preferences. This data is essential for family outreach and coordination
 * during student transitions.
 * 
 * **Key Features:**
 * - **Family Contact Data**: Parent/guardian phone and email information
 * - **Emergency Contacts**: Secondary contact information for urgent situations
 * - **Communication Preferences**: Preferred contact methods and languages
 * - **Address Information**: Current residence and mailing addresses
 * - **Relationship Tracking**: Parent/guardian relationship details
 * 
 * @class ContactDataLoader
 * @extends BaseDataLoader
 * @memberof DataLoaders
 * 
 * @example
 * // Load student contact information
 * const loader = new ContactDataLoader();
 * const contactData = loader.loadData();
 * console.log(`Loaded contact info for ${contactData.size} students`);
 * 
 * @example
 * // Access parent contact information
 * const loader = new ContactDataLoader();
 * const data = loader.loadData();
 * const studentContact = data.get('123456');
 * if (studentContact) {
 *   console.log(`Parent Email: ${studentContact.PARENT_EMAIL}`);
 *   console.log(`Phone: ${studentContact.HOME_PHONE}`);
 * }
 * 
 * @since 2.0.0
 */
class ContactDataLoader extends BaseDataLoader {
  /**
   * Creates a new ContactDataLoader instance.
   * 
   * Configures the loader to access contact information from the ContactInfo
   * sheet with single record per student configuration. Sets up proper
   * Student ID column mapping for contact data retrieval.
   * 
   * @constructor
   * @memberof ContactDataLoader
   * 
   * @example
   * // Create contact data loader
   * const loader = new ContactDataLoader();
   * // Configured for single contact record per student
   * 
   * @since 2.0.0
   */
  constructor() {
    super(SHEET_NAMES.CONTACT_INFO, COLUMN_NAMES.STUDENT_ID, false);
  }

  /**
   * Loads contact data from the ContactInfo sheet with correct column mapping
   * This replaces the original loadContactData function
   * @returns {Map} Map where keys are student IDs and values are properly structured contact data objects
   */
  loadData() {
    console.log('Loading contact data with correct column mapping...');
    
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.sheetName);
      if (!sheet) {
        console.error(`Sheet '${this.sheetName}' not found`);
        return new Map();
      }

      const data = sheet.getDataRange().getValues();
      if (data.length === 0) {
        console.warn('ContactInfo sheet is empty');
        return new Map();
      }

      const headers = data[0];
      const studentIdIndex = headers.indexOf('Student ID');
      
      if (studentIdIndex === -1) {
        console.error('Student ID column not found in ContactInfo');
        console.error('Available headers:', headers);
        return new Map();
      }

      const resultMap = new Map();

      // Process each row with correct column mapping
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const studentId = row[studentIdIndex];
        
        if (!studentId) {
          console.warn(`Empty Student ID at row ${i + 1}, skipping`);
          continue;
        }

        // ✅ FIXED: Create contact data structure based on actual sheet columns
        const contactData = {
          'Current Building': row[0] || '',
          'Student ID': studentId,
          'Student Name': row[2] || '',
          'Grade Level': row[3] || '',
          
          // ✅ Map to actual column positions based on your output
          'Notification Phone': row[4] || '', // Column E: "Notification" (phone)
          'Parent Name': row[5] || '', // Column F: "Guardian 1" (name)
          'Guardian 1 Email': row[6] || '', // Column G: "Guardian 1 Email"
          'Guardian 1 Cell': row[7] || '', // Column H: "Guardian 1 Cell"
          'Guardian 1 Home': row[8] || '', // Column I: "Guardian 1 Home"
          'Guardian 2 Name': row[9] || '', // Column J: "Guardian 2"
          'Guardian 2 Email': row[10] || '', // Column K: "Guardian 2 Email"
          'Guardian 2 Cell': row[11] || '', // Column L: "Guardian 2 Cell"
          'Guardian 2 Home': row[12] || '', // Column M: "Guardian 2 Home"
          'Student Email': row[13] || '', // Column N: "Student Email"
        };

        resultMap.set(String(studentId).trim(), contactData);
      }

      console.log(`ContactDataLoader: Processed ${resultMap.size} contact records with correct column mapping`);
      return resultMap;
      
    } catch (error) {
      console.error('Error in ContactDataLoader:', error);
      return new Map();
    }
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original loadContactData function
 * @returns {Map} A map where the key is the Student ID and values are contact data
 */
function loadContactData() {
  const loader = new ContactDataLoader();
  return loader.loadData();
}
