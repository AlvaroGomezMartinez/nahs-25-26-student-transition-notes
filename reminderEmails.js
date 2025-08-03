/**
 * @fileoverview Legacy Email Reminder Functions for NAHS System.
 * 
 * This file maintains backward compatibility for existing triggers and scripts
 * that reference the original sendEmailsForToday function. All functionality
 * has been refactored into the new EmailReminderService class located in
 * src/services/emailReminderService.js.
 * 
 * @deprecated Since version 2.0.0. Use EmailReminderService class instead.
 * @author Alvaro Gomez
 * @version 2.0.0 (refactored)
 * @since 2024-01-01
 * 
 * @todo Update existing triggers to use the new EmailReminderService class
 * @see {@link EmailReminderService} For the new implementation
 */

/**
 * Legacy function for sending daily email reminders.
 * 
 * This function maintains the original interface while delegating to the new
 * EmailReminderService class. It exists for backward compatibility with
 * existing triggers and scripts.
 * 
 * @function sendEmailsForToday
 * @deprecated Since version 2.0.0. Use EmailReminderService class instead.
 * 
 * @returns {Object} Results of the reminder process
 * 
 * @example
 * // Legacy usage (maintained for compatibility)
 * sendEmailsForToday();
 * 
 * // Preferred new usage
 * const service = new EmailReminderService();
 * service.sendDailyReminders();
 * 
 * @since 1.0.0
 */
function sendEmailsForToday() {
  try {
    console.log('=== Legacy sendEmailsForToday Function ===');
    console.log('Note: This function is deprecated. Consider upgrading to EmailReminderService.');
    console.log('Location: src/services/emailReminderService.js');
    
    // Delegate to the new service
    const service = new EmailReminderService();
    const result = service.sendDailyReminders();
    
    console.log('Legacy function completed successfully');
    return result;
    
  } catch (error) {
    console.error('Error in legacy sendEmailsForToday function:', error);
    
    // Fallback error logging for compatibility
    Logger.log(`Legacy reminderEmails.js error: ${error.message}`);
    
    throw error;
  }
}

/**
 * Debug version of the legacy function.
 * 
 * This function provides a debug interface for the legacy sendEmailsForToday
 * function, allowing for testing with custom parameters.
 * 
 * @function debugSendEmailsForToday
 * @deprecated Since version 2.0.0. Use testEmailReminders function instead.
 * 
 * @param {Date} [testDate] - Date to simulate for testing
 * @param {Array<string>} [testRecipients] - Email recipients for testing
 * 
 * @returns {Object} Test results
 * 
 * @example
 * // Debug with specific date
 * debugSendEmailsForToday(new Date('2025-01-15'), ['test@nisd.net']);
 * 
 * // Quick debug with current date
 * debugSendEmailsForToday();
 * 
 * @since 1.0.0
 */
function debugSendEmailsForToday(testDate = null, testRecipients = ['alvaro.gomez@nisd.net']) {
  try {
    console.log('=== Legacy Debug Function ===');
    console.log('Note: This function is deprecated. Use testEmailReminders instead.');
    
    // Delegate to the new test function
    return testEmailReminders({
      testDate: testDate,
      testRecipients: testRecipients,
      verbose: true
    });
    
  } catch (error) {
    console.error('Error in legacy debug function:', error);
    throw error;
  }
}

/**
 * Migration helper function.
 * 
 * This function provides information about migrating from the legacy
 * sendEmailsForToday function to the new EmailReminderService class.
 * 
 * @function showMigrationGuide
 * 
 * @example
 * // Get migration information
 * showMigrationGuide();
 * 
 * @since 2.0.0
 */
function showMigrationGuide() {
  console.log('=== Email Reminder Migration Guide ===');
  console.log('');
  console.log('LEGACY (Current):');
  console.log('  sendEmailsForToday();');
  console.log('');
  console.log('NEW (Recommended):');
  console.log('  const service = new EmailReminderService();');
  console.log('  service.sendDailyReminders();');
  console.log('');
  console.log('NEW (With Options):');
  console.log('  const service = new EmailReminderService({');
  console.log('    debugMode: true,');
  console.log('    testRecipients: ["test@nisd.net"]');
  console.log('  });');
  console.log('  service.sendDailyReminders();');
  console.log('');
  console.log('TESTING:');
  console.log('  testEmailReminders({ testDate: new Date(), verbose: true });');
  console.log('');
  console.log('FILE LOCATIONS:');
  console.log('  New Service: src/services/emailReminderService.js');
  console.log('  Legacy File: reminderEmails.js (this file)');
  console.log('');
  console.log('BENEFITS OF NEW SYSTEM:');
  console.log('  - Modular architecture integration');
  console.log('  - Better error handling and logging');
  console.log('  - Centralized teacher email management');
  console.log('  - Enhanced testing and debugging capabilities');
  console.log('  - Improved date/holiday handling');
  console.log('  - Configuration options for different environments');
  console.log('');
  console.log('MIGRATION STEPS:');
  console.log('  1. Test new system: testEmailReminders()');
  console.log('  2. Update triggers to use new EmailReminderService');
  console.log('  3. Remove dependency on this legacy file');
  console.log('');
}
