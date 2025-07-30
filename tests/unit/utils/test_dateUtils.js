/**
 * Unit tests for the DateUtils utility class.
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

      // Test date strings
      const dateString = "2024-03-15";
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

      // Test date strings
      const dateString = "2024-03-15";
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

    QUnit.test("formatToMMDDYYYY should handle invalid dates", function(assert) {
      // Test null
      const nullResult = dateUtils.formatToMMDDYYYY(null);
      assert.equal(nullResult, null, "Should return null for null input");

      // Test undefined
      const undefinedResult = dateUtils.formatToMMDDYYYY(undefined);
      assert.equal(undefinedResult, null, "Should return null for undefined input");

      // Test invalid date string
      const invalidResult = dateUtils.formatToMMDDYYYY("invalid-date");
      assert.equal(invalidResult, null, "Should return null for invalid date string");

      // Test NaN date
      const nanDate = new Date(NaN);
      const nanResult = dateUtils.formatToMMDDYYYY(nanDate);
      assert.equal(nanResult, null, "Should return null for NaN date");
    });

    QUnit.test("isValidDate should validate dates correctly", function(assert) {
      // Test valid dates
      assert.ok(dateUtils.isValidDate(new Date()), "Should validate current date as valid");
      assert.ok(dateUtils.isValidDate(new Date(2024, 11, 10)), "Should validate specific date as valid");
      assert.ok(dateUtils.isValidDate("2024-12-10"), "Should validate ISO date string as valid");

      // Test invalid dates
      assert.notOk(dateUtils.isValidDate(null), "Should validate null as invalid");
      assert.notOk(dateUtils.isValidDate(undefined), "Should validate undefined as invalid");
      assert.notOk(dateUtils.isValidDate("invalid"), "Should validate invalid string as invalid");
      assert.notOk(dateUtils.isValidDate(new Date(NaN)), "Should validate NaN date as invalid");
      assert.notOk(dateUtils.isValidDate({}), "Should validate object as invalid");
      assert.notOk(dateUtils.isValidDate(123), "Should validate number as invalid");
    });

    QUnit.test("parseDate should parse various date formats", function(assert) {
      // Test ISO format
      const isoDate = dateUtils.parseDate("2024-12-10");
      assert.ok(isoDate instanceof Date, "Should parse ISO date string");
      assert.equal(isoDate.getFullYear(), 2024, "Should parse year correctly");
      assert.equal(isoDate.getMonth(), 11, "Should parse month correctly (0-based)");
      assert.equal(isoDate.getDate(), 10, "Should parse day correctly");

      // Test MM/DD/YYYY format
      const usDate = dateUtils.parseDate("12/10/2024");
      assert.ok(usDate instanceof Date, "Should parse US date format");
      assert.equal(usDate.getFullYear(), 2024, "Should parse US format year correctly");

      // Test Date object passthrough
      const existingDate = new Date(2024, 11, 10);
      const passedThrough = dateUtils.parseDate(existingDate);
      assert.equal(passedThrough, existingDate, "Should pass through Date objects unchanged");
    });

    QUnit.test("addDays should add days correctly", function(assert) {
      const baseDate = new Date(2024, 11, 10); // December 10, 2024
      
      // Test adding positive days
      const futureDate = dateUtils.addDays(baseDate, 5);
      assert.equal(futureDate.getDate(), 15, "Should add days correctly");
      assert.equal(futureDate.getMonth(), 11, "Should maintain month when adding days");

      // Test adding negative days (subtracting)
      const pastDate = dateUtils.addDays(baseDate, -5);
      assert.equal(pastDate.getDate(), 5, "Should subtract days correctly");

      // Test month rollover
      const endOfMonth = new Date(2024, 11, 30); // December 30, 2024
      const nextMonth = dateUtils.addDays(endOfMonth, 5);
      assert.equal(nextMonth.getMonth(), 0, "Should roll over to next month (January)");
      assert.equal(nextMonth.getFullYear(), 2025, "Should roll over to next year");
      assert.equal(nextMonth.getDate(), 4, "Should calculate correct day in new month");
    });

    QUnit.test("addBusinessDays should skip weekends", function(assert) {
      // Start on a Friday (assuming December 6, 2024 is a Friday)
      const friday = new Date(2024, 11, 6);
      
      // Adding 1 business day should skip to Monday
      const monday = dateUtils.addBusinessDays(friday, 1);
      assert.equal(monday.getDay(), 1, "Should skip weekend and land on Monday");
      
      // Adding 5 business days should skip one weekend
      const nextFriday = dateUtils.addBusinessDays(friday, 5);
      assert.equal(nextFriday.getDay(), 5, "Should land on Friday after skipping weekend");
    });

    QUnit.test("getDaysDifference should calculate differences correctly", function(assert) {
      const date1 = new Date(2024, 11, 10);
      const date2 = new Date(2024, 11, 15);
      
      const diff = dateUtils.getDaysDifference(date1, date2);
      assert.equal(diff, 5, "Should calculate positive difference correctly");
      
      const reverseDiff = dateUtils.getDaysDifference(date2, date1);
      assert.equal(reverseDiff, -5, "Should calculate negative difference correctly");
      
      const sameDayDiff = dateUtils.getDaysDifference(date1, date1);
      assert.equal(sameDayDiff, 0, "Should return 0 for same date");
    });

    QUnit.test("getCurrentTimestamp should return valid timestamp", function(assert) {
      const timestamp = dateUtils.getCurrentTimestamp();
      assert.ok(typeof timestamp === 'string', "Should return string timestamp");
      assert.ok(timestamp.length > 0, "Should return non-empty timestamp");
      
      // Should be a valid date when parsed
      const parsedDate = new Date(timestamp);
      assert.ok(!isNaN(parsedDate.getTime()), "Should return parseable timestamp");
    });
  });
}
