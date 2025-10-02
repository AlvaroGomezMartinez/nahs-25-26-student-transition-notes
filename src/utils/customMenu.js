/**
 * @fileoverview Custom Menu Management for NAHS system.
 * 
 * This module provides functionality to create custom dropdown menus
 * in the Google Sheets interface for easy access to system functions.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2.0.0
 * @memberof Utils
 */

/**
 * Creates the custom "🚩Run Scripts" menu in the spreadsheet
 * This function is automatically called when the spreadsheet is opened
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🚩 Update')
    .addItem('Update rows and comments', 'menuUpdateTentativeVersion2')
    .addToUi();
  
  console.log('✅ Custom menu "🚩 Update" has been created');
}

/**
 * Menu wrapper function that calls loadTENTATIVEVersion2() and updates A1 with timestamp
 * This function is called when "Update rows and comments" is selected from the menu
 */
function menuUpdateTentativeVersion2() {
  console.log('🚩 MENU UPDATE: Starting TENTATIVE-Version2 update from menu...');
  
  try {
    const startTime = new Date();
    
    // Run the main update function
    loadTENTATIVEVersion2();
    
    const endTime = new Date();
    
    // Update A1 with timestamp
    updateTimestampInA1();
    
    // Log completion
    const duration = (endTime - startTime) / 1000;
    console.log(`✅ MENU UPDATE: Completed successfully in ${duration} seconds`);
    
    // No popup alert - rely on Google Apps Script's built-in "Running Script" notification
    // and the note in A1 for confirmation
    
  } catch (error) {
    console.error('❌ MENU UPDATE ERROR:', error.message);
    
    // Show error message to user (keep error alerts for important issues)
    SpreadsheetApp.getUi().alert(
      'Update Error',
      `An error occurred while updating TENTATIVE-Version2:\n\n${error.message}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Updates cell A1 in the TENTATIVE-Version2 sheet with current timestamp
 * Format: "Rows and comments updated on 08/09/25 2:03 PM"
 */
function updateTimestampInA1() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const tentativeSheet = spreadsheet.getSheetByName('TENTATIVE-Version2'); // Direct reference since constants are in different file
    
    if (!tentativeSheet) {
      console.error('❌ Sheet "TENTATIVE-Version2" not found');
      return;
    }
    
    // Format current date and time as "08/09/25 2:03 PM"
    const now = new Date();
    const formattedDateTime = formatDateTimeForA1(now);
    
    // Create the message
    const message = `Rows and comments updated on ${formattedDateTime}`;
    
    // Add the timestamp as a note (comment) in cell A1
    const cellA1 = tentativeSheet.getRange('A1');
    cellA1.setNote(message);
    
    console.log(`📝 A1 note updated with: "${message}"`);
    
  } catch (error) {
    console.error('❌ Error updating A1 timestamp note:', error.message);
  }
}

/**
 * Formats a Date object to the required format: "08/09/25 2:03 PM"
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDateTimeForA1(date) {
  try {
    // Get month, day, year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 because getMonth() is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
    
    // Get hours and minutes for 12-hour format
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    // Format: "08/09/25 2:03 PM"
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
    
  } catch (error) {
    console.error('❌ Error formatting date:', error.message);
    return new Date().toString(); // Fallback to default format
  }
}

/**
 * Test function to verify date formatting
 */
function testDateFormatting() {
  console.log('=== TESTING DATE FORMATTING ===');
  
  const testDates = [
    new Date('2025-08-09 14:03:00'), // 2:03 PM
    new Date('2025-12-25 09:30:00'), // 9:30 AM
    new Date('2025-01-01 00:00:00'), // 12:00 AM
    new Date('2025-06-15 12:00:00'), // 12:00 PM
    new Date() // Current time
  ];
  
  testDates.forEach((date, index) => {
    const formatted = formatDateTimeForA1(date);
    console.log(`Test ${index + 1}: ${date.toString()} -> "${formatted}"`);
  });
  
  console.log('\n✅ Date formatting test complete');
}

/**
 * Manual function to update just the timestamp (for testing)
 */
function updateTimestampOnly() {
  console.log('📝 Updating timestamp in A1...');
  updateTimestampInA1();
  console.log('✅ Timestamp update complete');
}

/**
 * Function to recreate the menu (useful if menu doesn't appear)
 */
function createCustomMenu() {
  console.log('🔄 Recreating custom menu...');
  onOpen();
  console.log('✅ Menu recreation complete');
}
