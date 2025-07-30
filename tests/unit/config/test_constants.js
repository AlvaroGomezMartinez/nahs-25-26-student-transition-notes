/**
 * Unit tests for the constants configuration module.
 * Tests that all required constants are defined and have expected values.
 */

/**
 * Register constants tests with QUnit.
 * This function is called by the test runner to set up constants tests.
 */
function registerConstantTests() {
  test_Constants();
}

/**
 * Tests for the constants.js configuration file.
 */
function test_Constants() {
  QUnit.module("Configuration - Constants", function() {
    
    QUnit.test("SHEET_NAMES constant should be properly defined", function(assert) {
      // Test that SHEET_NAMES exists and has required properties
      assert.ok(typeof SHEET_NAMES === 'object', "SHEET_NAMES should be an object");
      assert.notEqual(SHEET_NAMES, null, "SHEET_NAMES should not be null");
      
      // Test required sheet names (using actual property names from constants)
      const requiredSheets = [
        'TENTATIVE_V2',
        'TENTATIVE',
        'REGISTRATIONS',
        'SCHEDULES',
        'CONTACT_INFO',
        'ENTRY_WITHDRAWAL',
        'FORM_RESPONSES_1',
        'WITHDRAWN',
        'WD_OTHER',
        'ATTENDANCE'
      ];
      
      requiredSheets.forEach(sheetName => {
        assert.ok(
          SHEET_NAMES.hasOwnProperty(sheetName),
          `SHEET_NAMES should have property ${sheetName}`
        );
        assert.ok(
          typeof SHEET_NAMES[sheetName] === 'string' && SHEET_NAMES[sheetName].length > 0,
          `SHEET_NAMES.${sheetName} should be a non-empty string`
        );
      });
    });

    QUnit.test("COLUMN_NAMES constant should be properly defined", function(assert) {
      assert.ok(typeof COLUMN_NAMES === 'object', "COLUMN_NAMES should be an object");
      assert.notEqual(COLUMN_NAMES, null, "COLUMN_NAMES should not be null");
      
      // Test key column names (using actual property names from constants)
      const requiredColumns = [
        'STUDENT_ID',
        'STUDENT_FIRST_NAME',
        'STUDENT_LAST_NAME',
        'STUDENT_NAME_FULL',
        'GRADE',
        'ENTRY_DATE',
        'TEACHER_NAME'
      ];
      
      requiredColumns.forEach(columnName => {
        assert.ok(
          COLUMN_NAMES.hasOwnProperty(columnName),
          `COLUMN_NAMES should have property ${columnName}`
        );
      });
    });

    QUnit.test("PERIODS constant should be properly defined", function(assert) {
      assert.ok(typeof PERIODS === 'object', "PERIODS should be an object");
      
      const expectedPeriods = [
        'FIRST', 'SECOND', 'THIRD', 'FOURTH',
        'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH',
        'SPECIAL_ED'
      ];
      
      expectedPeriods.forEach(period => {
        assert.ok(
          PERIODS.hasOwnProperty(period),
          `PERIODS should have property ${period}`
        );
        assert.ok(
          typeof PERIODS[period] === 'string',
          `PERIODS.${period} should be a string`
        );
      });
    });

    QUnit.test("DEFAULT_VALUES constant should be properly defined", function(assert) {
      assert.ok(typeof DEFAULT_VALUES === 'object', "DEFAULT_VALUES should be an object");
      
      // Test some expected default values (using actual property names from your constants)
      const expectedDefaults = [
        'EMPTY_STRING',
        'UNKNOWN_TEACHER',               // Your actual property name (not EMPTY_ARRAY)
        'MISSING_DATA_PLACEHOLDER'       // Your actual property name (not DEFAULT_GRADE or DEFAULT_DATE)
      ];
      
      expectedDefaults.forEach(defaultName => {
        assert.ok(
          DEFAULT_VALUES.hasOwnProperty(defaultName),
          `DEFAULT_VALUES should have property ${defaultName}`
        );
      });
    });

    QUnit.test("TEACHER_EMAIL_MAPPINGS should be properly defined", function(assert) {
      assert.ok(typeof TEACHER_EMAIL_MAPPINGS === 'object', "TEACHER_EMAIL_MAPPINGS should be an object");
      
      // Should be able to handle null/undefined without errors
      assert.doesNotThrow(() => {
        const testMapping = TEACHER_EMAIL_MAPPINGS['nonexistent.teacher'];
      }, "Should handle non-existent teacher lookups gracefully");
    });

    QUnit.test("Constants should be immutable", function(assert) {
      // Test that we can't accidentally modify constants
      const originalSheetName = SHEET_NAMES.TENTATIVE_V2;
      
      try {
        SHEET_NAMES.TENTATIVE_V2 = "MODIFIED";
        // If we get here, the constant was modified (which shouldn't happen in a proper setup)
        assert.notEqual(SHEET_NAMES.TENTATIVE_V2, "MODIFIED", 
          "Constants should be protected from modification");
      } catch (error) {
        // This is expected if constants are properly protected
        assert.ok(true, "Constants are properly protected from modification");
      }
      
      // Restore original value if it was modified
      if (SHEET_NAMES.TENTATIVE_V2 === "MODIFIED") {
        SHEET_NAMES.TENTATIVE_V2 = originalSheetName;
      }
    });

    QUnit.test("Sheet names should be valid identifiers", function(assert) {
      Object.keys(SHEET_NAMES).forEach(key => {
        const sheetName = SHEET_NAMES[key];
        assert.ok(
          typeof sheetName === 'string' && sheetName.length > 0,
          `Sheet name for ${key} should be a non-empty string`
        );
        
        // Sheet names shouldn't contain invalid characters
        assert.notOk(
          /[<>:"/\\|?*]/.test(sheetName),
          `Sheet name "${sheetName}" should not contain invalid characters`
        );
      });
    });
  });
}
