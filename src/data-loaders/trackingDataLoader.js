/**
 * Tracking Data Loader
 * 
 * Loads data from the Sheet1 (tracking sheet) and converts it to a Map
 * for easier processing. This sheet is located in an external spreadsheet.
 */

class TrackingDataLoader extends BaseDataLoader {
  constructor() {
    // Use external spreadsheet ID for tracking data
    const externalSpreadsheetId = EXTERNAL_SPREADSHEETS.TRACKING_SOURCE;
    super(SHEET_NAMES.TRACKING_SHEET, COLUMN_NAMES.STUDENT_ID, false, externalSpreadsheetId);
  }

  /**
   * Loads tracking data from the external tracking sheet
   * @returns {Map} Map where keys are student IDs and values are tracking data
   */
  loadData() {
    try {
      console.log('Loading tracking data from external spreadsheet...');
      console.log('External spreadsheet ID:', EXTERNAL_SPREADSHEETS.TRACKING_SOURCE);
      return super.loadData();
    } catch (error) {
      console.error('Error loading tracking data:', error);
      console.error('Note: Tracking data is expected to be in an external spreadsheet');
      console.error('Please verify the EXTERNAL_SPREADSHEETS.TRACKING_SOURCE configuration');
      return new Map();
    }
  }
}

/**
 * Backward compatibility function for loading tracking data
 */
function loadTrackingData() {
  const loader = new TrackingDataLoader();
  return loader.loadData();
}
