/**
 * Test utilities and helper functions for the unit test suite.
 * Provides common functionality needed across multiple test files.
 */

/**
 * Test utilities class with helper methods for testing.
 */
class TestUtils {
  
  /**
   * Creates mock student data for testing purposes.
   * @param {string} studentId - The student ID
   * @param {Object} overrides - Optional data overrides
   * @returns {Object} Mock student data object
   */
  static createMockStudentData(studentId = "1234567", overrides = {}) {
    const defaultData = {
      "TENTATIVE": [{
        "DATE ADDED TO SPREADSHEET": "2024-01-15",
        "LAST": "Doe",
        "FIRST": "John", 
        "GRADE": "10",
        "1st Period - Course Title": "Algebra I",
        "1st Period - Teacher Name": "Ms. Johnson",
        "1st Period - Transfer Grade": "B",
        "1st Period - Current Grade": "B+",
        "Merged Doc ID - Transition Letter": "doc123",
        "Merged Doc URL - Transition Letter": "https://docs.google.com/document/d/doc123",
        "Link to merged Doc - Transition Letter": "=HYPERLINK(\"https://docs.google.com/document/d/doc123\", \"Link\")",
        "Document Merge Status - Transition Letter": "Completed"
      }],
      "Entry_Withdrawal": [{
        "Entry Date": "2024-08-15",
        "Student Name(Last, First)": "Doe, John",
        "Grd Lvl": "10"
      }],
      "Registrations_SY_24_25": [{
        "Home Campus": "High School A",
        "Placement Days": 45,
        "Educational Factors": "None",
        "Eligibilty": "Standard",
        "Behavior Contract": "Yes"
      }],
      "ContactInfo": [{
        "Student Email": "john.doe@student.edu",
        "Parent Name": "Jane Doe",
        "Guardian 1 Email": "jane.doe@email.com"
      }],
      "Schedules": [
        { "Per Beg": 1, "Course Title": "Algebra I", "Teacher Name": "Ms. Johnson" },
        { "Per Beg": 2, "Course Title": "English I", "Teacher Name": "Mr. Smith" }
      ],
      "Form_Responses_1": [{
        "Teacher": "Ms. Johnson",
        "What period do you have this student?": "1st",
        "Course Title": "Algebra I",
        "How would you assess this student's academic growth?": "Good progress",
        "Academic and Behavioral Progress Notes": "Student is improving steadily"
      }],
      "Alt_HS_Attendance_Enrollment_Count": [[null, null, null, null, 30, 32]],
      "Withdrawn": [],
      "WD_Other": []
    };

    // Apply overrides
    return this.deepMerge(defaultData, overrides);
  }

  /**
   * Creates mock teacher input data for testing.
   * @param {Object} overrides - Optional overrides for specific periods
   * @returns {Object} Mock teacher input structure
   */
  static createMockTeacherInput(overrides = {}) {
    const defaultInput = {
      "1st": {
        "Course Title": "Algebra I",
        "Teacher Name": "Ms. Johnson",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "Good progress",
        "Academic and Behavioral Progress Notes": "Improving steadily"
      },
      "2nd": {
        "Course Title": "English I",
        "Teacher Name": "Mr. Smith",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "Excellent",
        "Academic and Behavioral Progress Notes": "Great participation"
      },
      "3rd": {
        "Course Title": "",
        "Teacher Name": "",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "",
        "Academic and Behavioral Progress Notes": ""
      },
      "4th": {
        "Course Title": "",
        "Teacher Name": "",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "",
        "Academic and Behavioral Progress Notes": ""
      },
      "5th": {
        "Course Title": "",
        "Teacher Name": "",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "",
        "Academic and Behavioral Progress Notes": ""
      },
      "6th": {
        "Course Title": "",
        "Teacher Name": "",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "",
        "Academic and Behavioral Progress Notes": ""
      },
      "7th": {
        "Course Title": "",
        "Teacher Name": "",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "",
        "Academic and Behavioral Progress Notes": ""
      },
      "8th": {
        "Course Title": "",
        "Teacher Name": "",
        "Transfer Grade": "",
        "Current Grade": "",
        "How would you assess this student's academic growth?": "",
        "Academic and Behavioral Progress Notes": ""
      },
      "Special Education": {
        "Case Manager": "Ms. Wilson",
        "What accommodations seem to work well with this student to help them be successful?": "",
        "What are the student's strengths, as far as behavior?": "",
        "What are the student's needs, as far as behavior?": "",
        "What are the student's needs, as far as functional skills?": "",
        "Please add any other comments or concerns here:": ""
      }
    };

    return this.deepMerge(defaultInput, overrides);
  }

  /**
   * Creates a mock Google Sheets range object for testing.
   * @param {Array<Array>} values - The values to return
   * @returns {Object} Mock range object
   */
  static createMockRange(values = []) {
    return {
      getValues: function() { return values; },
      setValues: function(newValues) { this.testValues = newValues; },
      clear: function() { this.cleared = true; },
      setWrapStrategy: function(strategy) { this.wrapStrategy = strategy; },
      setFontSize: function(size) { this.fontSize = size; },
      setVerticalAlignment: function(alignment) { this.verticalAlignment = alignment; },
      testValues: null,
      cleared: false,
      wrapStrategy: null,
      fontSize: null,
      verticalAlignment: null
    };
  }

  /**
   * Creates a mock Google Sheets sheet object for testing.
   * @param {string} sheetName - The name of the sheet
   * @param {Array<Array>} data - The data to return
   * @returns {Object} Mock sheet object
   */
  static createMockSheet(sheetName, data = [["Header"], ["Data"]]) {
    return {
      getName: function() { return sheetName; },
      getLastRow: function() { return data.length; },
      getLastColumn: function() { return data.length > 0 ? data[0].length : 0; },
      getDataRange: function() {
        return TestUtils.createMockRange(data);
      },
      getRange: function(row, col, numRows, numCols) {
        return TestUtils.createMockRange([]);
      }
    };
  }

  /**
   * Creates a mock SpreadsheetApp for testing.
   * @param {Object} sheets - Object mapping sheet names to mock sheet objects
   * @returns {Object} Mock SpreadsheetApp object
   */
  static createMockSpreadsheetApp(sheets = {}) {
    return {
      getActiveSpreadsheet: function() {
        return {
          getSheetByName: function(name) {
            return sheets[name] || null;
          }
        };
      },
      WrapStrategy: {
        CLIP: 'CLIP'
      }
    };
  }

  /**
   * Deep merges two objects, with the second object taking precedence.
   * @param {Object} target - The target object
   * @param {Object} source - The source object to merge
   * @returns {Object} The merged object
   */
  static deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Asserts that two arrays are deeply equal.
   * @param {QUnit.Assert} assert - QUnit assert object
   * @param {Array} actual - The actual array
   * @param {Array} expected - The expected array  
   * @param {string} message - The assertion message
   */
  static assertArraysEqual(assert, actual, expected, message) {
    assert.ok(Array.isArray(actual), `${message} - actual should be an array`);
    assert.ok(Array.isArray(expected), `${message} - expected should be an array`);
    assert.equal(actual.length, expected.length, `${message} - arrays should have same length`);
    
    for (let i = 0; i < expected.length; i++) {
      if (Array.isArray(expected[i])) {
        this.assertArraysEqual(assert, actual[i], expected[i], `${message} - row ${i}`);
      } else {
        assert.equal(actual[i], expected[i], `${message} - element ${i} should match`);
      }
    }
  }

  /**
   * Asserts that an object has all expected properties.
   * @param {QUnit.Assert} assert - QUnit assert object
   * @param {Object} obj - The object to check
   * @param {Array<string>} expectedProperties - Array of expected property names
   * @param {string} message - The assertion message
   */
  static assertHasProperties(assert, obj, expectedProperties, message) {
    assert.ok(typeof obj === 'object' && obj !== null, `${message} - should be an object`);
    
    expectedProperties.forEach(prop => {
      assert.ok(obj.hasOwnProperty(prop), `${message} - should have property '${prop}'`);
    });
  }

  /**
   * Creates a test data map with multiple students.
   * @param {number} count - Number of students to create
   * @returns {Map} Map of student data keyed by student ID
   */
  static createTestDataMap(count = 3) {
    const dataMap = new Map();
    
    for (let i = 0; i < count; i++) {
      const studentId = (1234567 + i).toString();
      const studentData = this.createMockStudentData(studentId, {
        "TENTATIVE": [{
          "LAST": `Student${i}`,
          "FIRST": `Test${i}`,
          "GRADE": (9 + (i % 4)).toString()
        }],
        "Entry_Withdrawal": [{
          "Student Name(Last, First)": `Student${i}, Test${i}`,
          "Entry Date": "2024-08-15",
          "Grd Lvl": (9 + (i % 4)).toString()
        }]
      });
      
      dataMap.set(studentId, studentData);
    }
    
    return dataMap;
  }

  /**
   * Measures execution time of a function.
   * @param {Function} fn - The function to measure
   * @returns {Object} Object with result and execution time
   */
  static measureExecutionTime(fn) {
    const startTime = Date.now();
    const result = fn();
    const endTime = Date.now();
    
    return {
      result,
      executionTime: endTime - startTime
    };
  }

  /**
   * Creates a mock console for capturing log output during tests.
   * @returns {Object} Mock console with captured logs
   */
  static createMockConsole() {
    const logs = [];
    const warns = [];
    const errors = [];
    
    return {
      log: function(...args) { logs.push(args.join(' ')); },
      warn: function(...args) { warns.push(args.join(' ')); },
      error: function(...args) { errors.push(args.join(' ')); },
      getLogs: function() { return logs; },
      getWarns: function() { return warns; },
      getErrors: function() { return errors; },
      clear: function() { 
        logs.length = 0;
        warns.length = 0;
        errors.length = 0;
      }
    };
  }
}
