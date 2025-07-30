/**
 * Unit tests for the writer classes.
 * Tests the sheet writing functionality and data output formatting.
 */

/**
 * Tests for the BaseSheetWriter class.
 */
function test_BaseSheetWriter() {
  QUnit.module("Writers - BaseSheetWriter", function() {
    
    let baseWriter;
    let mockSheet;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        // Create mock sheet
        mockSheet = {
          getLastRow: function() { return 10; },
          getLastColumn: function() { return 5; },
          getRange: function(row, col, numRows, numCols) {
            return {
              clear: function() { /* mock clear */ },
              setValues: function(values) { this.values = values; },
              setWrapStrategy: function(strategy) { this.wrapStrategy = strategy; },
              values: null,
              wrapStrategy: null
            };
          },
          getName: function() { return "TestSheet"; }
        };
        
        baseWriter = new BaseSheetWriter("TestSheet");
        baseWriter.getSheet = function() { return mockSheet; };
      });
    });

    QUnit.test("BaseSheetWriter constructor should initialize correctly", function(assert) {
      assert.ok(baseWriter instanceof BaseSheetWriter, "Should create BaseSheetWriter instance");
      assert.equal(baseWriter.sheetName, "TestSheet", "Should set sheet name correctly");
      assert.ok(typeof baseWriter.writeData === 'function', "Should have writeData method");
      assert.ok(typeof baseWriter.clearExistingData === 'function', "Should have clearExistingData method");
    });

    QUnit.test("writeData should write data to sheet", function(assert) {
      const testData = [
        ["Row1Col1", "Row1Col2", "Row1Col3"],
        ["Row2Col1", "Row2Col2", "Row2Col3"]
      ];
      
      assert.doesNotThrow(() => {
        baseWriter.writeData(testData, 2, 1);
      }, "Should write data without throwing errors");
    });

    QUnit.test("clearExistingData should clear sheet data", function(assert) {
      assert.doesNotThrow(() => {
        baseWriter.clearExistingData(2);
      }, "Should clear data without throwing errors");
    });

    QUnit.test("sortData should sort data correctly", function(assert) {
      const unsortedData = [
        ["Zebra", "B", "3"],
        ["Apple", "A", "1"],
        ["Banana", "C", "2"]
      ];
      
      const sortCriteria = [{ column: 0, ascending: true }];
      const sorted = baseWriter.sortData(unsortedData, sortCriteria);
      
      assert.equal(sorted[0][0], "Apple", "Should sort first item correctly");
      assert.equal(sorted[1][0], "Banana", "Should sort second item correctly");
      assert.equal(sorted[2][0], "Zebra", "Should sort third item correctly");
    });

    QUnit.test("validateDataStructure should validate data consistency", function(assert) {
      // Test valid data structure
      const validData = [
        ["Col1", "Col2", "Col3"],
        ["Val1", "Val2", "Val3"]
      ];
      
      assert.doesNotThrow(() => {
        baseWriter.validateDataStructure(validData);
      }, "Should validate consistent data structure");
      
      // Test invalid data structure
      const invalidData = [
        ["Col1", "Col2", "Col3"],
        ["Val1", "Val2"] // Missing column
      ];
      
      assert.throws(() => {
        baseWriter.validateDataStructure(invalidData);
      }, "Should throw error for inconsistent data structure");
    });

    QUnit.test("sortData should handle multiple sort criteria", function(assert) {
      const data = [
        ["Smith", "John", "10"],
        ["Doe", "Jane", "11"],
        ["Smith", "Alice", "9"]
      ];
      
      const sortCriteria = [
        { column: 0, ascending: true },  // Last name first
        { column: 1, ascending: true }   // Then first name
      ];
      
      const sorted = baseWriter.sortData(data, sortCriteria);
      
      assert.equal(sorted[0][0], "Doe", "Should sort by primary criteria first");
      assert.equal(sorted[1][1], "Alice", "Should sort by secondary criteria for ties");
      assert.equal(sorted[2][1], "John", "Should handle multiple sort levels");
    });
  });
}

/**
 * Tests for the TentativeRowBuilder class.
 */
function test_TentativeRowBuilder() {
  QUnit.module("Writers - TentativeRowBuilder", function() {
    
    let rowBuilder;
    let mockStudentData;
    let mockTeacherInput;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        rowBuilder = new TentativeRowBuilder();
        
        mockStudentData = {
          "TENTATIVE": [{
            "DATE ADDED TO SPREADSHEET": "2024-01-15",
            "LAST": "Doe",
            "FIRST": "John",
            "GRADE": "10",
            "1st Period - Course Title": "Algebra I",
            "1st Period - Transfer Grade": "B",
            "1st Period - Current Grade": "B+",
            "Merged Doc ID - Transition Letter": "doc123"
          }],
          "Entry_Withdrawal": [{
            "Entry Date": "2024-08-15",
            "Student Name(Last, First)": "Doe, John",
            "Grd Lvl": "10"
          }],
          "Registrations_SY_24_25": [{
            "Home Campus": "High School A",
            "Placement Days": 45,
            "Educational Factors": "504 Plan",
            "Behavior Contract": "Yes"
          }],
          "ContactInfo": [{
            "Student Email": "john.doe@student.edu",
            "Parent Name": "Jane Doe",
            "Guardian 1 Email": "jane.doe@email.com"
          }],
          "Alt_HS_Attendance_Enrollment_Count": [[null, null, null, null, 30, 32]]
        };
        
        mockTeacherInput = {
          "1st": {
            "Course Title": "Algebra I",
            "Teacher Name": "Ms. Johnson",
            "How would you assess this student's academic growth?": "Good progress",
            "Academic and Behavioral Progress Notes": "Improving steadily"
          },
          "2nd": {
            "Course Title": "English I",
            "Teacher Name": "Mr. Smith",
            "How would you assess this student's academic growth?": "Excellent",
            "Academic and Behavioral Progress Notes": "Great participation"
          },
          "Special Education": {
            "Case Manager": "Ms. Wilson"
          }
        };
      });
    });

    QUnit.test("TentativeRowBuilder constructor should initialize correctly", function(assert) {
      assert.ok(rowBuilder instanceof TentativeRowBuilder, "Should create TentativeRowBuilder instance");
      assert.ok(typeof rowBuilder.buildStudentRow === 'function', "Should have buildStudentRow method");
    });

    QUnit.test("buildStudentRow should create complete row data", function(assert) {
      const row = rowBuilder.buildStudentRow("1234567", mockStudentData, mockTeacherInput);
      
      assert.ok(Array.isArray(row), "Should return array for row data");
      assert.ok(row.length > 50, "Should return comprehensive row data (50+ columns)");
      
      // Test specific fields
      assert.equal(row[1], "Doe", "Should set last name correctly");
      assert.equal(row[2], "John", "Should set first name correctly");
      assert.equal(row[3], "1234567", "Should set student ID correctly");
      assert.equal(row[4], "10", "Should set grade correctly");
    });

    QUnit.test("_buildPeriodData should format period information correctly", function(assert) {
      const periodData = rowBuilder._buildPeriodData("1st", mockTeacherInput, mockStudentData["TENTATIVE"][0]);
      
      assert.ok(Array.isArray(periodData), "Should return array of period data");
      assert.equal(periodData.length, 6, "Should return 6 fields per period");
      assert.equal(periodData[0], "Algebra I", "Should include course title");
      assert.equal(periodData[1], "Ms. Johnson", "Should include teacher name");
      assert.equal(periodData[2], "B", "Should include transfer grade");
      assert.equal(periodData[4], "Good progress", "Should include academic growth assessment");
    });

    QUnit.test("_calculateEducationalFactors should identify 504 and ESL status", function(assert) {
      const registrationEntry = mockStudentData["Registrations_SY_24_25"][0];
      const factors = rowBuilder._calculateEducationalFactors(registrationEntry);
      
      assert.equal(factors.contains504Result, "Yes", "Should identify 504 Plan");
      assert.equal(factors.containsESLResult, "No", "Should correctly identify no ESL");
      
      // Test ESL identification
      const eslRegistration = { "Educational Factors": "ESL Services" };
      const eslFactors = rowBuilder._calculateEducationalFactors(eslRegistration);
      assert.equal(eslFactors.containsESLResult, "Yes", "Should identify ESL services");
    });

    QUnit.test("_extractNames should parse student names correctly", function(assert) {
      const tentativeEntry = mockStudentData["TENTATIVE"][0];
      const entryWithdrawalEntry = mockStudentData["Entry_Withdrawal"][0];
      
      const names = rowBuilder._extractNames(mockStudentData, tentativeEntry, entryWithdrawalEntry);
      
      assert.equal(names.lastName, "Doe", "Should extract last name correctly");
      assert.equal(names.firstName, "John", "Should extract first name correctly");
    });

    QUnit.test("_buildErrorRow should create error row for failed processing", function(assert) {
      const errorRow = rowBuilder._buildErrorRow("1234567", "Test error message");
      
      assert.ok(Array.isArray(errorRow), "Should return array for error row");
      assert.equal(errorRow[1], "ERROR", "Should mark as error in last name field");
      assert.equal(errorRow[3], "1234567", "Should preserve student ID");
      assert.ok(errorRow[4].includes("Test error message"), "Should include error message");
    });

    QUnit.test("should handle missing data gracefully", function(assert) {
      // Test with minimal data
      const minimalData = {
        "Entry_Withdrawal": [{ "Student Name(Last, First)": "Test, Student" }],
        "TENTATIVE": [],
        "Registrations_SY_24_25": [],
        "ContactInfo": []
      };
      
      const minimalTeacherInput = {
        "1st": { "Course Title": "", "Teacher Name": "" },
        "Special Education": { "Case Manager": "" }
      };
      
      assert.doesNotThrow(() => {
        const row = rowBuilder.buildStudentRow("9999999", minimalData, minimalTeacherInput);
        assert.ok(Array.isArray(row), "Should handle minimal data and return valid row");
      }, "Should handle missing data without throwing errors");
    });
  });
}

/**
 * Tests for the TentativeSheetWriter class.
 */
function test_TentativeSheetWriter() {
  QUnit.module("Writers - TentativeSheetWriter", function() {
    
    let sheetWriter;
    let mockActiveStudentDataMap;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        sheetWriter = new TentativeSheetWriter();
        
        // Mock the sheet
        const mockSheet = {
          getLastRow: function() { return 1; },
          getLastColumn: function() { return 60; },
          getRange: function(row, col, numRows, numCols) {
            return {
              clear: function() {},
              setValues: function(values) { this.testValues = values; },
              setWrapStrategy: function(strategy) {},
              setFontSize: function(size) {},
              setVerticalAlignment: function(alignment) {}
            };
          },
          getName: function() { return SHEET_NAMES.TENTATIVE_VERSION2; }
        };
        
        sheetWriter.getSheet = function() { return mockSheet; };
        
        // Create mock student data
        mockActiveStudentDataMap = new Map([
          ["1234567", {
            "TENTATIVE": [{ "LAST": "Doe", "FIRST": "John", "GRADE": "10" }],
            "Entry_Withdrawal": [{ "Entry Date": "2024-08-15", "Student Name(Last, First)": "Doe, John" }],
            "Form_Responses_1": null,
            "Schedules": [],
            "Registrations_SY_24_25": [{ "Home Campus": "Test School" }],
            "ContactInfo": [{ "Student Email": "test@email.com" }]
          }]
        ]);
      });
    });

    QUnit.test("TentativeSheetWriter should extend BaseSheetWriter", function(assert) {
      assert.ok(sheetWriter instanceof TentativeSheetWriter, "Should create TentativeSheetWriter instance");
      assert.ok(sheetWriter instanceof BaseSheetWriter, "Should extend BaseSheetWriter");
    });

    QUnit.test("writeStudentData should process and write student data", function(assert) {
      assert.doesNotThrow(() => {
        sheetWriter.writeStudentData(mockActiveStudentDataMap);
      }, "Should write student data without throwing errors");
    });

    QUnit.test("_validateInput should validate input data", function(assert) {
      // Test valid input
      const validResult = sheetWriter._validateInput(mockActiveStudentDataMap);
      assert.ok(validResult, "Should validate valid student data map");
      
      // Test invalid input
      const invalidResult = sheetWriter._validateInput(null);
      assert.notOk(invalidResult, "Should reject null input");
      
      const emptyMapResult = sheetWriter._validateInput(new Map());
      assert.notOk(emptyMapResult, "Should reject empty map");
    });

    QUnit.test("_buildOutputData should create output data array", function(assert) {
      const outputData = sheetWriter._buildOutputData(mockActiveStudentDataMap);
      
      assert.ok(Array.isArray(outputData), "Should return array of output data");
      assert.equal(outputData.length, 1, "Should process one student");
      assert.ok(Array.isArray(outputData[0]), "Each row should be an array");
    });

    QUnit.test("_createErrorRow should create error row for failed students", function(assert) {
      const errorRow = sheetWriter._createErrorRow("1234567", "Test error");
      
      assert.ok(Array.isArray(errorRow), "Should return error row array");
      assert.equal(errorRow[1], "DATA_ERROR", "Should mark as data error");
      assert.equal(errorRow[3], "1234567", "Should preserve student ID");
      assert.ok(errorRow[4].includes("Test error"), "Should include error message");
    });

    QUnit.test("getWriteStatistics should provide write metrics", function(assert) {
      // First write some data
      sheetWriter.writeStudentData(mockActiveStudentDataMap);
      
      const stats = sheetWriter.getWriteStatistics(mockActiveStudentDataMap);
      
      assert.ok(typeof stats === 'object', "Should return statistics object");
      assert.ok(stats.hasOwnProperty('studentsProcessed'), "Should include students processed count");
      assert.ok(stats.hasOwnProperty('rowsWritten'), "Should include rows written count");
      assert.ok(stats.hasOwnProperty('sheetName'), "Should include sheet name");
      assert.ok(stats.hasOwnProperty('writeTimestamp'), "Should include timestamp");
      assert.equal(stats.studentsProcessed, 1, "Should count processed students correctly");
    });
  });
}

/**
 * Tests for the SheetWriterFactory class.
 */
function test_SheetWriterFactory() {
  QUnit.module("Writers - SheetWriterFactory", function() {
    
    let factory;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        factory = new SheetWriterFactory();
      });
    });

    QUnit.test("SheetWriterFactory should create instances correctly", function(assert) {
      assert.ok(factory instanceof SheetWriterFactory, "Should create SheetWriterFactory instance");
      assert.ok(typeof factory.getWriter === 'function', "Should have getWriter method");
    });

    QUnit.test("getWriter should return correct writer types", function(assert) {
      const tentativeWriter = factory.getWriter('tentative');
      assert.ok(tentativeWriter instanceof TentativeSheetWriter, "Should return TentativeSheetWriter for 'tentative'");
      
      const tentativeWriter2 = factory.getWriter('tentative-version2');
      assert.ok(tentativeWriter2 instanceof TentativeSheetWriter, "Should return TentativeSheetWriter for 'tentative-version2'");
      
      // Test caching
      const cachedWriter = factory.getWriter('tentative');
      assert.equal(tentativeWriter, cachedWriter, "Should return cached instance");
    });

    QUnit.test("getWriter should throw error for unknown types", function(assert) {
      assert.throws(() => {
        factory.getWriter('unknown-type');
      }, /Unknown writer type/, "Should throw error for unknown writer type");
    });

    QUnit.test("clearCache should clear cached instances", function(assert) {
      const writer1 = factory.getWriter('tentative');
      factory.clearCache();
      const writer2 = factory.getWriter('tentative');
      
      assert.notEqual(writer1, writer2, "Should return new instance after cache clear");
    });

    QUnit.test("getAvailableWriterTypes should return available types", function(assert) {
      const types = factory.getAvailableWriterTypes();
      
      assert.ok(Array.isArray(types), "Should return array of types");
      assert.ok(types.includes('tentative'), "Should include 'tentative' type");
      assert.ok(types.includes('tentative-version2'), "Should include 'tentative-version2' type");
      assert.ok(types.length > 0, "Should return at least one type");
    });
  });
}

/**
 * Register writer tests with QUnit.
 * This function is called by the test runner to set up writer tests.
 */
function registerWriterTests() {
  test_BaseSheetWriter();
  test_TentativeSheetWriter();
  test_TentativeRowBuilder();
  test_SheetWriterFactory();
}
