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
 * @author NAHS Development Team
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
   * Loads contact data from the ContactInfo sheet
   * This replaces the original loadContactData function
   * @returns {Map} Map where keys are student IDs and values are contact data
   */
  loadData() {
    try {
      console.log('Loading contact data...');
      return super.loadData();
    } catch (error) {
      console.error('Error loading contact data:', error);
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
