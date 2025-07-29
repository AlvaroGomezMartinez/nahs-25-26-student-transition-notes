/**
 * Contact Data Loader
 * 
 * Loads contact information for students from the ContactInfo sheet
 */

class ContactDataLoader extends BaseDataLoader {
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
