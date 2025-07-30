/**
 * Unit tests for the date utility functions.
 * Tests date formatting, validation, and manipulation functions.
 */

/**
 * Register date utility tests with QUnit.
 * This function is called by the test runner to set up date utility tests.
 */
function registerDateUtilTests() {
  test_DateUtils();
}

/**
 * Tests for the date utility functions.
 */
function test_DateUtils() {
  QUnit.module("Utilities - Date Functions", function() {

    QUnit.test("formatDateToMMDDYYYY should format dates correctly", function(assert) {
      // Test valid date objects
      const testDate = new Date(2024, 11, 10); // December 10, 2024 (month is 0-based)
      const formatted = formatDateToMMDDYYYY(testDate);
      assert.equal(formatted, "12/10/2024", "Should format Date object correctly");

      // Test date strings - use timezone-safe format
      const dateString = "2024-03-15T12:00:00"; // Noon avoids timezone issues
      const formattedString = formatDateToMMDDYYYY(dateString);
      assert.equal(formattedString, "03/15/2024", "Should format date string correctly");

      // Test edge cases
      const newYear = new Date(2025, 0, 1); // January 1, 2025
      const formattedNewYear = formatDateToMMDDYYYY(newYear);
      assert.equal(formattedNewYear, "01/01/2025", "Should format New Year date correctly");

      // Test invalid dates
      const invalidDate = formatDateToMMDDYYYY("invalid date");
      assert.equal(invalidDate, null, "Should return null for invalid dates");
    });

    QUnit.test("isWeekend should identify weekends correctly", function(assert) {
      // Test Saturday (weekend)
      const saturday = new Date(2024, 0, 13); // January 13, 2024 (Saturday)
      assert.ok(isWeekend(saturday), "Should identify Saturday as weekend");

      // Test Sunday (weekend) 
      const sunday = new Date(2024, 0, 14); // January 14, 2024 (Sunday)
      assert.ok(isWeekend(sunday), "Should identify Sunday as weekend");

      // Test Monday (weekday)
      const monday = new Date(2024, 0, 15); // January 15, 2024 (Monday)
      assert.notOk(isWeekend(monday), "Should identify Monday as weekday");

      // Test Friday (weekday)
      const friday = new Date(2024, 0, 19); // January 19, 2024 (Friday)
      assert.notOk(isWeekend(friday), "Should identify Friday as weekday");
    });

    QUnit.test("isHoliday should identify holidays correctly", function(assert) {
      // Test with a sample holiday list
      const holidays = [
        new Date(2024, 11, 25), // Christmas Day 2024
        new Date(2024, 0, 1),   // New Year's Day 2024
      ];

      // Test Christmas Day
      const christmas = new Date(2024, 11, 25);
      assert.ok(isHoliday(christmas, holidays), "Should identify Christmas as holiday");

      // Test New Year's Day
      const newYear = new Date(2024, 0, 1);
      assert.ok(isHoliday(newYear, holidays), "Should identify New Year as holiday");

      // Test regular day
      const regularDay = new Date(2024, 5, 15); // June 15, 2024
      assert.notOk(isHoliday(regularDay, holidays), "Should not identify regular day as holiday");

      // Test with empty holiday list
      assert.notOk(isHoliday(christmas, []), "Should handle empty holiday list");
    });

    QUnit.test("Date functions should handle edge cases", function(assert) {
      // Test formatDateToMMDDYYYY with null/undefined
      assert.equal(formatDateToMMDDYYYY(null), null, "Should handle null input");
      assert.equal(formatDateToMMDDYYYY(undefined), null, "Should handle undefined input");

      // Test isWeekend with edge cases
      const validDate = new Date(2024, 0, 15);
      assert.equal(typeof isWeekend(validDate), 'boolean', "Should return boolean for valid date");

      // Test isHoliday with null holidays array
      assert.notOk(isHoliday(validDate, null), "Should handle null holidays array");
      assert.notOk(isHoliday(validDate, undefined), "Should handle undefined holidays array");
    });
  });
}
