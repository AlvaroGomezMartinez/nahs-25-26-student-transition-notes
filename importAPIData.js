/**
 * Imports data from three specific sheets in the _API spreadsheet project (source spreadsheet) to
 * corresponding sheets in this project.
 * 
 * The purpose of this function is to automate the process of importing data (schedules, entry/withdrawal,
 * and contact information). The automation starts with subscriptions to Cognos reports that
 * generate the data. The _API project collects the data from those reports and stores it in sheets for other
 * projects' uses.
 * 
 * importAPIData has five triggers set to run on each weekday from midnight to 1:00 AM to retrieve the data from the
 * _API project.
 * 
 * The function clears existing data in the target sheets (from row 2 onwards) before importing new data.
 * Adds a note to cell A1 of each target sheet indicating the date of the last import.
 */
function importAPIData() {
  const sourceSpreadsheetId = '1uCQ_Z4QLbHq89tutZ4Wen0TREwS8qEx2j7MmzUgXOaY';
  const targetSpreadsheetId = '14-nvlNOLWebnJJOQNZPnglWx0OuE5U-_xEbXGodND6E';
  
  /**
   * Mapping of source sheets, ranges, and corresponding target sheets.
   * 
   * @type {Array<{sourceSheet: string, sourceRange: string, targetSheet: string}>}
   */
  const sheetsMapping = [
    { sourceSheet: 'Schedules', sourceRange: 'A2:N', targetSheet: 'Schedules' },
    { sourceSheet: 'ContactInfo', sourceRange: 'A2:N', targetSheet: 'ContactInfo' },
    { sourceSheet: 'Entry_Withdrawal2', sourceRange: 'A2:L', targetSheet: 'Entry_Withdrawal' }
  ];
  
  const date = new Date();
  const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM/dd/yyyy');
  
  try {
    const sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
    const targetSpreadsheet = SpreadsheetApp.openById(targetSpreadsheetId);

    sheetsMapping.forEach(mapping => {
      try {
        const sourceSheet = sourceSpreadsheet.getSheetByName(mapping.sourceSheet);
        const targetSheet = targetSpreadsheet.getSheetByName(mapping.targetSheet);
        
        if (!sourceSheet) {
          throw new Error(`Source sheet '${mapping.sourceSheet}' not found.`);
        }
        
        if (!targetSheet) {
          throw new Error(`Target sheet '${mapping.targetSheet}' not found.`);
        }

        // Clear existing data in the target sheet from row 2 onward
        const lastRow = targetSheet.getLastRow();
        if (lastRow > 1) {
          targetSheet.getRange(2, 1, lastRow - 1, targetSheet.getLastColumn()).clearContent();
        }
        
        // Get data from source sheet
        const data = sourceSheet.getRange(mapping.sourceRange).getValues();
        
        // Write data to target sheet starting at row 2
        if (data.length > 0) {
          targetSheet.getRange(2, 1, data.length, data[0].length).setValues(data);
        }
        
        // Add note to cell A1
        targetSheet.getRange('A1').setNote(`Last imported: ${formattedDate} from _API`);
      } catch (sheetError) {
        Logger.log(`Error processing sheet mapping '${mapping.sourceSheet}' to '${mapping.targetSheet}': ${sheetError.message}`);
      }
    });

  } catch (mainError) {
    Logger.log(`Error accessing spreadsheets: ${mainError.message}`);
  }
}
