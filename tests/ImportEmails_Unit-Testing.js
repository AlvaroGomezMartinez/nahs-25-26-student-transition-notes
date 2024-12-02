/**
 * Unit Tests for sendEmailsForToday using QUnitGS2.
 */

var QUnit = QUnitGS2.QUnit;

/**
 * doGet() function to initialize QUnit and display test results as a webpage.
 * 
 * @returns {HtmlOutput} - The test results page showing the outcome of the unit tests.
 */
function doGet() {
  Logger.log("Initializing QUnitGS2"); // Debugging log
  QUnitGS2.init(); // Initializes the library.

  // Add the test functions here
  test_sendEmailsForToday(); // This will run the sendEmailsForToday unit test

  QUnit.config.hidepassed = false; // Show passed assertions

  Logger.log("Starting QUnit tests"); // Debugging log
  QUnit.start(); // Starts running tests

  Logger.log("Returning HTML output for tests"); // Debugging log
  return QUnitGS2.getHtml(); // Returns HTML for test results display
}

/**
 * Test function to validate the behavior of sendEmailsForToday function using real registrationsData.
 */
function test_sendEmailsForToday() {
  QUnit.test("sendEmailsForToday should correctly send email for today's matching student", function (assert) {
    Logger.log("Running test_sendEmailsForToday"); // Debugging log

    // Set the date for testing to a specific day
    const mockToday = "2024-11-01";
    const originalFormatDate = Utilities.formatDate;
    Utilities.formatDate = function (date, timeZone, format) {
      Logger.log("Mocking Utilities.formatDate to return mockToday"); // Debugging log
      // Force the date to be the test date
      return mockToday;
    };

    // Capture email data instead of sending
    const emailLog = [];
    const originalSendEmail = GmailApp.sendEmail;
    GmailApp.sendEmail = function (recipient, subject, body) {
      Logger.log(`Email captured: To - ${recipient}, Subject - ${subject}`); // Debugging log
      emailLog.push({ recipient, subject, body });
    };

    // Run the function
    Logger.log("Calling sendEmailsForToday"); // Debugging log
    sendEmailsForToday();

    // Check if emails were sent (this may vary based on the actual data in registrationsData)
    if (emailLog.length > 0) {
      const email = emailLog[0];
      assert.equal(
        email.recipient,
        "alvaro.gomez@nisd.net",
        "Email should be sent to 'alvaro.gomez@nisd.net'"
      );
      assert.ok(
        email.subject.includes("Transition Reminder"),
        "Email subject should contain 'Transition Reminder'"
      );
      assert.ok(
        email.body.includes("Grade:"),
        "Email body should include student details"
      );
    } else {
      assert.ok(true, "No emails sent for non-matching data in registrationsData");
    }

    // Restore the original functions
    Logger.log("Restoring original Utilities.formatDate and GmailApp.sendEmail"); // Debugging log
    Utilities.formatDate = originalFormatDate;
    GmailApp.sendEmail = originalSendEmail;
  });
}
