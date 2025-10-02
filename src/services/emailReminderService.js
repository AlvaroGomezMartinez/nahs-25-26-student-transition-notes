/**
 * @fileoverview Email Reminder Service for the NAHS system.
 * 
 * This module provides automated email reminders to teachers to provide input
 * on students who have reached their 10-day enrollment milestone at NAHS.
 * It integrates with the modular architecture using proper data loading,
 * date utilities, and configuration management.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2.0.0
 * @memberof Services
 */

/**
 * Email Reminder Service for teacher notifications.
 * 
 * This service handles the automated process of identifying students who have
 * reached their 10-day enrollment milestone and sending reminder emails to
 * teachers to provide input on academic and behavioral progress.
 * 
 * Features:
 * - **Automated Detection**: Identifies students at 10-day milestone
 * - **Weekend/Holiday Awareness**: Skips non-school days
 * - **Teacher Integration**: Uses centralized teacher email mappings
 * - **Flexible Configuration**: Supports debugging and testing modes
 * - **Error Handling**: Comprehensive error logging and recovery
 * 
 * @class EmailReminderService
 * @memberof Services
 * 
 * @example
 * // Basic usage
 * const reminderService = new EmailReminderService();
 * reminderService.sendDailyReminders();
 * 
 * @example
 * // Debug mode
 * const reminderService = new EmailReminderService({
 *   debugMode: true,
 *   testRecipients: ['alvaro.gomez@nisd.net']
 * });
 * reminderService.sendDailyReminders();
 * 
 * @since 2.0.0
 */
class EmailReminderService {
  
  /**
   * Creates an instance of EmailReminderService.
   * 
   * @param {Object} [options={}] - Configuration options
   * @param {boolean} [options.debugMode=false] - Enable debug mode
   * @param {Array<string>} [options.testRecipients] - Override recipients for testing
   * @param {Date} [options.testDate] - Override current date for testing
   * @param {string} [options.formUrl] - Custom form URL for teacher input
   */
  constructor(options = {}) {
  // Default to non-debug (production) unless explicitly enabled
  this.debugMode = options.debugMode || false;
  // Only use testRecipients when explicitly provided
  this.testRecipients = options.testRecipients || null;
    this.testDate = options.testDate || null;
    this.formUrl = options.formUrl || 'https://forms.gle/1NirWqZkvcABGgYc9';
    
    // Configuration
    this.config = {
      workdaysForReminder: 10,
      dueWorkdaysAfter: 2,
      timezone: 'America/Chicago'
    };
  }
  
  /**
   * Main entry point for sending daily reminder emails.
   * 
   * This method orchestrates the complete reminder process:
   * 1. Validates if reminders should be sent (weekday, non-holiday)
   * 2. Loads current student data
   * 3. Identifies students at 10-day milestone
   * 4. Sends appropriate emails to teachers
   * 
   * @function sendDailyReminders
   * @memberof EmailReminderService
   * 
   * @returns {Object} Results of the reminder process:
   *   - {boolean} emailsSent - Whether emails were sent
   *   - {number} studentsCount - Number of students in reminder
   *   - {string} reason - Reason if emails weren't sent
   * 
   * @throws {Error} Throws if critical system failure occurs
   * 
   * @example
   * // Standard daily execution
   * const service = new EmailReminderService();
   * const result = service.sendDailyReminders();
   * console.log(`Emails sent: ${result.emailsSent}, Students: ${result.studentsCount}`);
   * 
   * @example
   * // Debug execution
   * const service = new EmailReminderService({ 
   *   debugMode: true,
   *   testRecipients: ['test@nisd.net']
   * });
   * service.sendDailyReminders();
   * 
   * @since 2.0.0
   */
  sendDailyReminders() {
    try {
      console.log('=== Starting Email Reminder Service ===');
      
      // Step 1: Determine current date (allow override for testing)
      const today = this.testDate || new Date();
      const todayString = this._formatDate(today, 'yyyy-MM-dd');
      
      console.log(`Processing reminders for: ${todayString}`);
      
      // Step 2: Check if reminders should be sent today
      const shouldSendReminders = this._shouldSendRemindersToday(today);
      
      if (!shouldSendReminders.send) {
        console.log(`Reminders not sent: ${shouldSendReminders.reason}`);
        return {
          emailsSent: false,
          studentsCount: 0,
          reason: shouldSendReminders.reason
        };
      }
      
      // Step 3: Load student data
      const studentData = this._loadStudentData();
      
      if (!studentData || studentData.size === 0) {
        console.warn('No student data available for reminder processing');
        return {
          emailsSent: false,
          studentsCount: 0,
          reason: 'No student data available'
        };
      }
      
      // Step 4: Find students at 10-day milestone
      const studentsForToday = this._findStudentsAtMilestone(studentData, todayString);
      
      console.log(`Found ${studentsForToday.length} students at 10-day milestone`);
      
      // Step 5: Send reminder emails
      const emailResult = this._sendReminderEmails(studentsForToday, todayString);
      
      console.log('=== Email Reminder Service Completed ===');
      
      return {
        emailsSent: true,
        studentsCount: studentsForToday.length,
        emailType: emailResult.type,
        recipients: emailResult.recipients.length
      };
      
    } catch (error) {
      console.error('Critical error in EmailReminderService:', error);
      throw error;
    }
  }
  
  /**
   * Determines if reminder emails should be sent today.
   * 
   * @private
   * @param {Date} date - The date to check
   * @returns {Object} Decision object with send boolean and reason
   */
  _shouldSendRemindersToday(date) {
    // Compute weekend/holiday status
    const isWeekend = this._isWeekend(date);
    const isHoliday = this._isHoliday(date, holidayDates);

    // Debug logging to help track unexpected weekend/holiday behavior
    if (this.debugMode) {
      try {
        console.log(`_shouldSendRemindersToday: date=${date.toString()}, day=${date.getDay()}, isWeekend=${isWeekend}, isHoliday=${isHoliday}`);
      } catch (e) {
        console.log('_shouldSendRemindersToday: debug logging failed', e);
      }
    }

    // Skip weekends
    if (isWeekend) {
      return {
        send: false,
        reason: 'Weekend (reminders only sent on weekdays)'
      };
    }
    
    // Skip holidays
    if (isHoliday) {
      return {
        send: false,
        reason: 'Holiday (reminders not sent on holidays)'
      };
    }
    
    return {
      send: true,
      reason: 'Valid school day'
    };
  }
  
  /**
   * Loads current student data using the modular data loader.
   * 
   * @private
   * @returns {Map} Student data map
   */
  _loadStudentData() {
    try {
      console.log('Loading student data for reminder processing...');
      
      // Use the new modular data loading system
      const tentativeLoader = new TentativeDataLoader();
      const studentData = tentativeLoader.loadData();
      
      console.log(`Loaded data for ${studentData.size} students`);
      return studentData;
      
    } catch (error) {
      console.error('Error loading student data for reminders:', error);
      return new Map();
    }
  }
  
  /**
   * Finds students who have reached the 10-day milestone today.
   * 
   * @private
   * @param {Map} studentData - Map of student data
   * @param {string} todayString - Today's date in YYYY-MM-DD format
   * @returns {Array} Array of student information objects
   */
  _findStudentsAtMilestone(studentData, todayString) {
    const studentsAtMilestone = [];
    
    for (const [studentId, dataArray] of studentData.entries()) {
      try {
        // Handle both Map structure and direct object structure
        const studentRecord = Array.isArray(dataArray) ? dataArray[0] : dataArray;
        // Temporary one-time debug: show keys present on a student record
        if (this.debugMode && !this._hasLoggedSampleStudentKeys) {
          try {
            console.log('DEBUG: sample studentRecord keys:', Object.keys(studentRecord));
            // Print a compact sample of the record (only a few keys)
            const sample = {};
            Object.keys(studentRecord || {}).slice(0, 10).forEach(k => { sample[k] = studentRecord[k]; });
            console.log('DEBUG: sample studentRecord values:', sample);
          } catch (e) {
            console.log('DEBUG: failed to print sample studentRecord', e);
          }
          // Avoid spamming logs; only log once per service instance
          this._hasLoggedSampleStudentKeys = true;
        }
        
        if (!studentRecord || !studentRecord[COLUMN_NAMES.FIRST_DAY_OF_AEP]) {
          if (this.debugMode) {
            console.log(`Student ${studentId}: Missing FIRST DAY OF AEP data`);
          }
          continue;
        }
        
        const startDate = new Date(studentRecord[COLUMN_NAMES.FIRST_DAY_OF_AEP]);
        
        // Calculate 10-day milestone using workdays
        const tenDaysMark = this._addWorkdays(
          startDate, 
          this.config.workdaysForReminder, 
          holidayDates || []
        );
        
        const milestoneString = this._formatDate(tenDaysMark, 'yyyy-MM-dd');
        
        if (milestoneString === todayString) {
          const studentInfo = {
            studentId: studentRecord[COLUMN_NAMES.STUDENT_ID] || studentId,
            lastName: studentRecord[COLUMN_NAMES.LAST] || 'Unknown',
            firstName: studentRecord[COLUMN_NAMES.FIRST] || 'Unknown',
            grade: studentRecord[COLUMN_NAMES.GRADE] || 'Unknown',
            startDate: this._formatDate(startDate, 'MM/dd/yyyy'),
            milestoneDate: this._formatDate(tenDaysMark, 'MM/dd/yyyy')
          };
          
          studentsAtMilestone.push(studentInfo);
          
          if (this.debugMode) {
            console.log(`Added student: ${studentInfo.lastName}, ${studentInfo.firstName} (${studentInfo.studentId})`);
          }
        }
        
      } catch (error) {
        console.warn(`Error processing student ${studentId} for milestone:`, error);
      }
    }
    
    return studentsAtMilestone;
  }
  
  /**
   * Sends reminder emails to teachers.
   * 
   * @private
   * @param {Array} studentsAtMilestone - Students at 10-day milestone
   * @param {string} todayString - Today's date string
   * @returns {Object} Email sending results
   */
  _sendReminderEmails(studentsAtMilestone, todayString) {
    const recipients = this._getEmailRecipients();
    const dueDate = this._calculateDueDate(new Date(todayString));
    
    let emailType, subject, body;
    
    if (studentsAtMilestone.length > 0) {
      // Send email with student list
      emailType = 'student_list';
      subject = 'Transition Reminder: Today\'s List of Students with 10 Days at NAHS';
      body = this._buildStudentListEmailBody(studentsAtMilestone, dueDate);
      
    } else {
      // Send "no students today" email
      emailType = 'no_students';
      subject = 'Transition Reminder: Today\'s List of Students with 10 Days at NAHS';
      body = this._buildNoStudentsEmailBody();
    }
    
    // Send the email
    this._sendEmail(recipients, subject, body);
    
    console.log(`Sent ${emailType} email to ${recipients.length} recipients`);
    
    return {
      type: emailType,
      recipients: recipients,
      studentsCount: studentsAtMilestone.length
    };
  }
  
  /**
   * Gets the list of email recipients for reminders.
   * 
   * @private
   * @returns {Array<string>} Array of email addresses
   */
  _getEmailRecipients() {
    // Use test recipients if in debug mode
    if (this.debugMode && this.testRecipients) {
      console.log(`Debug mode: Using test recipients - ${this.testRecipients.join(', ')}`);
      return this.testRecipients;
    }
    
    // Extract email addresses from TEACHER_EMAIL_MAPPINGS
    const emailAddresses = Object.keys(TEACHER_EMAIL_MAPPINGS);
    
    // Add additional staff members not in teacher mappings
    const additionalStaff = [
      'daniel.galdeano@nisd.net',
      'zina.gonzales@nisd.net',
      'alvaro.gomez@nisd.net',
      'teressa.hensley@nisd.net',
      'angela.rodriguez@nisd.net',
    ];
    
    const allRecipients = [...emailAddresses, ...additionalStaff];
    
    // Remove duplicates and sort
    const uniqueRecipients = [...new Set(allRecipients)].sort();
    
    if (this.debugMode) {
      console.log(`Email recipients (${uniqueRecipients.length}):`, uniqueRecipients);
    }
    
    return uniqueRecipients;
  }
  
  /**
   * Calculates the due date for teacher responses.
   * 
   * @private
   * @param {Date} startDate - The start date for calculation
   * @returns {Date} The due date
   */
  _calculateDueDate(startDate) {
    return this._addWorkdays(
      startDate, 
      this.config.dueWorkdaysAfter, 
      holidayDates || []
    );
  }
  
  /**
   * Builds the email body for student list notifications.
   * 
   * @private
   * @param {Array} students - Students at milestone
   * @param {Date} dueDate - Due date for responses
   * @returns {string} Email body text
   */
  _buildStudentListEmailBody(students, dueDate) {
    const studentList = students.map(student => 
      `${student.lastName}, ${student.firstName} (${student.studentId}), Grade: ${student.grade}`
    ).join('\n');
    
    const formattedDueDate = this._formatDate(dueDate, 'MM-dd-yyyy');
    
    return `NAHS Teachers,

Below is today's list of students that have been enrolled for 10 days at NAHS:

${studentList}

ACTION ITEM (Due by end of day, ${formattedDueDate}): If you have one of these students on your roster, please go to: ${this.formUrl} and provide your input on their academic growth and behavioral progress.

****REMINDER****
When inputting the period on the form, select the period that is listed on the student's schedule, the one you enter their attendance with.

Thank you`;
  }
  
  /**
   * Builds the email body for no students notifications.
   * 
   * @private
   * @returns {string} Email body text
   */
  _buildNoStudentsEmailBody() {
    return `NAHS Teachers,

We do not have any students on today's 10-Day list!
Please work on any you have pending from before and be on the look out for the next list.

Have a great day.`;
  }
  
  /**
   * Sends an email using Gmail API.
   * 
   * @private
   * @param {Array<string>} recipients - Email recipients
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   */
  _sendEmail(recipients, subject, body) {
    try {
      if (this.debugMode) {
        console.log('=== DEBUG EMAIL ===');
        console.log(`To: ${recipients.join(', ')}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body:\n${body}`);
        console.log('=== END DEBUG EMAIL ===');
      }
      
      GmailApp.sendEmail(recipients.join(','), subject, body);
      
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Formats a date according to the specified format string.
   * This is a helper method to avoid dependency issues with DateUtils.
   * 
   * @private
   * @param {Date} date - The date to format
   * @param {string} format - Format string (yyyy-MM-dd, MM/dd/yyyy, MM-dd-yyyy)
   * @returns {string|null} Formatted date string or null if invalid
   */
  _formatDate(date, format) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    // Replace format patterns
    return format
      .replace(/yyyy/g, year)
      .replace(/MM/g, month)
      .replace(/dd/g, day);
  }

  /**
   * Determines if a given date falls on a weekend (Saturday or Sunday).
   * This is a helper method to avoid dependency issues with DateUtils.
   * 
   * @private
   * @param {Date} date - The date to check
   * @returns {boolean} True if weekend, false otherwise
   */
  _isWeekend(date) {
    if (!date || !(date instanceof Date)) {
      return false;
    }
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  }

  /**
   * Determines if a given date is a holiday.
   * This is a helper method to avoid dependency issues with DateUtils.
   * 
   * @private
   * @param {Date} date - The date to check
   * @param {Array<string>} holidays - Array of holiday date strings
   * @returns {boolean} True if holiday, false otherwise
   */
  _isHoliday(date, holidays) {
    if (!date || !(date instanceof Date) || !Array.isArray(holidays)) {
      return false;
    }
    
    const dateString = this._formatDate(date, 'yyyy-MM-dd');
    return holidays.includes(dateString);
  }

  /**
   * Adds workdays to a date, excluding weekends and holidays.
   * This is a helper method to avoid dependency issues with DateUtils.
   * 
   * @private
   * @param {Date} startDate - The starting date
   * @param {number} numWorkdays - Number of work days to add
   * @param {Array<string>} holidays - Array of holiday date strings
   * @returns {Date} The calculated end date
   */
  _addWorkdays(startDate, numWorkdays, holidays = []) {
    if (!startDate || !(startDate instanceof Date) || numWorkdays < 0) {
      return startDate;
    }
    
    let currentDate = new Date(startDate);
    let workdaysAdded = 0;
    
    if (this.debugMode) {
      try {
        console.log(`_addWorkdays: start=${startDate.toDateString()}, numWorkdays=${numWorkdays}, holidays=${Array.isArray(holidays) ? holidays.length : 'NA'}`);
      } catch (e) {
        console.log('_addWorkdays: debug logging failed', e);
      }
    }
    
    while (workdaysAdded < numWorkdays) {
      currentDate.setDate(currentDate.getDate() + 1);
      const isWeekend = this._isWeekend(currentDate);
      const isHoliday = this._isHoliday(currentDate, holidays);

      if (this.debugMode) {
        console.log(`_addWorkdays: evaluating ${currentDate.toDateString()} - isWeekend=${isWeekend}, isHoliday=${isHoliday}, workdaysAdded=${workdaysAdded}`);
      }

      if (!isWeekend && !isHoliday) {
        workdaysAdded++;
      }
    }
    
    return currentDate;
  }
}

/**
 * Legacy function for backward compatibility.
 * 
 * This function maintains the original interface while using the new
 * EmailReminderService class internally. It should be used for existing
 * triggers and scripts that reference the original function name.
 * 
 * @function sendEmailsForToday
 * @memberof EmailReminderService
 * @deprecated Since version 2.0.0. Use EmailReminderService class directly.
 * 
 * @returns {Object} Results of the reminder process
 * 
 * @example
 * // Legacy usage (maintains compatibility)
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
    console.log('Using legacy sendEmailsForToday function (consider upgrading to EmailReminderService)');
    
    const service = new EmailReminderService();
    return service.sendDailyReminders();
    
  } catch (error) {
    console.error('Error in legacy sendEmailsForToday function:', error);
    throw error;
  }
}

/**
 * Debug function for testing the email reminder system.
 * 
 * This function allows for easy testing of the email reminder system
 * with custom parameters and debug output.
 * 
 * @function testEmailReminders
 * @memberof EmailReminderService
 * 
 * @param {Object} [options={}] - Test configuration options
 * @param {Date} [options.testDate] - Date to simulate for testing
 * @param {Array<string>} [options.testRecipients] - Email recipients for testing
 * @param {boolean} [options.verbose=true] - Enable verbose debug output
 * 
 * @returns {Object} Test results
 * 
 * @example
 * // Test with specific date
 * testEmailReminders({
 *   testDate: new Date('2025-01-15'),
 *   testRecipients: ['test@nisd.net'],
 *   verbose: true
 * });
 * 
 * @example
 * // Quick test with current date
 * testEmailReminders();
 * 
 * @since 2.0.0
 */
function testEmailReminders(options = {}) {
  try {
    console.log('=== Testing Email Reminder System ===');
    
    const service = new EmailReminderService({
      debugMode: true,
      testRecipients: options.testRecipients || ['alvaro.gomez@nisd.net'],
      testDate: options.testDate || null
    });
    
    const result = service.sendDailyReminders();
    
    console.log('=== Test Results ===');
    console.log('Emails sent:', result.emailsSent);
    console.log('Students count:', result.studentsCount);
    console.log('Email type:', result.emailType || 'none');
    console.log('Recipients:', result.recipients || 0);
    
    if (result.reason) {
      console.log('Reason:', result.reason);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error during email reminder testing:', error);
    throw error;
  }
}

/**
 * Small safe example that calls the service in debug mode with a single test recipient.
 * Use this from the Apps Script editor to do a dry-run without sending real emails.
 */
function debugSendDailyReminders() {
  const service = new EmailReminderService({
    debugMode: true,
    testRecipients: ['alvaro.gomez@nisd.net']
  });

  return service.sendDailyReminders();
}
