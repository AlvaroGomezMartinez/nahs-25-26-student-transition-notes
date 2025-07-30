/**
 * Unit tests for specific data loader classes.
 * Tests the specialized functionality of individual loaders.
 */

/**
 * Tests for the TentativeDataLoader class.
 */
function test_TentativeDataLoader() {
  QUnit.module("Data Loaders - TentativeDataLoader", function() {
    
    let tentativeLoader;
    let mockTentativeData = [
      ["DATE ADDED TO SPREADSHEET", "LAST", "FIRST", "ID", "GRADE"],
      ["2024-01-15", "Doe", "John", "1234567", "10"],
      ["2024-01-16", "Smith", "Jane", "7654321", "11"]
    ];
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        // Mock the sheet for tentative data
        const mockSheet = {
          getDataRange: function() {
            return {
              getValues: function() { return mockTentativeData; }
            };
          },
          getLastRow: function() { return mockTentativeData.length; },
          getLastColumn: function() { return mockTentativeData[0].length; },
          getName: function() { return SHEET_NAMES.TENTATIVE; }
        };
        
        tentativeLoader = new TentativeDataLoader();
        tentativeLoader.getSheet = function() { return mockSheet; };
      });
    });

    QUnit.test("TentativeDataLoader should extend BaseDataLoader", function(assert) {
      assert.ok(tentativeLoader instanceof TentativeDataLoader, "Should create TentativeDataLoader instance");
      assert.ok(tentativeLoader instanceof BaseDataLoader, "Should extend BaseDataLoader");
      assert.equal(tentativeLoader.sheetName, SHEET_NAMES.TENTATIVE, "Should use correct sheet name");
    });

    QUnit.test("loadData should return tentative data", function(assert) {
      const data = tentativeLoader.loadData();
      
      assert.ok(Array.isArray(data), "Should return array data");
      assert.equal(data.length, 2, "Should return correct number of data rows");
      assert.equal(data[0][1], "Doe", "Should return correct student last name");
      assert.equal(data[0][2], "John", "Should return correct student first name");
      assert.equal(data[0][3], "1234567", "Should return correct student ID");
    });

    QUnit.test("getStudentById should find student correctly", function(assert) {
      const student = tentativeLoader.getStudentById("1234567");
      
      assert.ok(student !== null, "Should find student by ID");
      assert.equal(student[1], "Doe", "Should return correct student data");
      assert.equal(student[2], "John", "Should return correct first name");
      
      const notFound = tentativeLoader.getStudentById("9999999");
      assert.equal(notFound, null, "Should return null for non-existent student");
    });

    QUnit.test("validateTentativeData should validate data structure", function(assert) {
      const validationResult = tentativeLoader.validateTentativeData();
      
      assert.ok(validationResult.isValid, "Should validate correct tentative data structure");
      assert.equal(validationResult.errors.length, 0, "Should have no validation errors");
    });
  });
}

/**
 * Tests for the RegistrationDataLoader class.
 */
function test_RegistrationDataLoader() {
  QUnit.module("Data Loaders - RegistrationDataLoader", function() {
    
    let registrationLoader;
    let mockRegistrationData = [
      ["Student ID", "Home Campus", "Placement Days", "Educational Factors", "Behavior Contract"],
      ["1234567", "High School A", "45", "None", "Yes"],
      ["7654321", "High School B", "60", "504 Plan", "No"]
    ];
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        const mockSheet = {
          getDataRange: function() {
            return {
              getValues: function() { return mockRegistrationData; }
            };
          },
          getLastRow: function() { return mockRegistrationData.length; },
          getLastColumn: function() { return mockRegistrationData[0].length; },
          getName: function() { return SHEET_NAMES.REGISTRATIONS_SY_24_25; }
        };
        
        registrationLoader = new RegistrationDataLoader();
        registrationLoader.getSheet = function() { return mockSheet; };
      });
    });

    QUnit.test("RegistrationDataLoader should work correctly", function(assert) {
      assert.ok(registrationLoader instanceof RegistrationDataLoader, "Should create RegistrationDataLoader instance");
      assert.equal(registrationLoader.sheetName, SHEET_NAMES.REGISTRATIONS_SY_24_25, "Should use correct sheet name");
      
      const data = registrationLoader.loadData();
      assert.equal(data.length, 2, "Should load correct number of registration records");
      assert.equal(data[0][2], "45", "Should load placement days correctly");
    });

    QUnit.test("getStudentRegistration should find registration by ID", function(assert) {
      const registration = registrationLoader.getStudentRegistration("1234567");
      
      assert.ok(registration !== null, "Should find registration by student ID");
      assert.equal(registration[1], "High School A", "Should return correct home campus");
      assert.equal(registration[2], "45", "Should return correct placement days");
    });
  });
}

/**
 * Tests for the ScheduleDataLoader class.
 */
function test_ScheduleDataLoader() {
  QUnit.module("Data Loaders - ScheduleDataLoader", function() {
    
    let scheduleLoader;
    let mockScheduleData = [
      ["Student ID", "Per Beg", "Course Title", "Teacher Name"],
      ["1234567", "1", "Algebra I", "Ms. Johnson"],
      ["1234567", "2", "English I", "Mr. Smith"],
      ["7654321", "1", "Geometry", "Ms. Davis"]
    ];
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        const mockSheet = {
          getDataRange: function() {
            return {
              getValues: function() { return mockScheduleData; }
            };
          },
          getLastRow: function() { return mockScheduleData.length; },
          getLastColumn: function() { return mockScheduleData[0].length; },
          getName: function() { return SHEET_NAMES.SCHEDULES; }
        };
        
        scheduleLoader = new ScheduleDataLoader();
        scheduleLoader.getSheet = function() { return mockSheet; };
      });
    });

    QUnit.test("ScheduleDataLoader should work correctly", function(assert) {
      assert.ok(scheduleLoader instanceof ScheduleDataLoader, "Should create ScheduleDataLoader instance");
      
      const data = scheduleLoader.loadData();
      assert.equal(data.length, 3, "Should load all schedule records");
    });

    QUnit.test("getStudentSchedule should return student's complete schedule", function(assert) {
      const schedule = scheduleLoader.getStudentSchedule("1234567");
      
      assert.ok(Array.isArray(schedule), "Should return array of courses");
      assert.equal(schedule.length, 2, "Should return correct number of courses for student");
      assert.equal(schedule[0][2], "Algebra I", "Should return correct first course");
      assert.equal(schedule[1][2], "English I", "Should return correct second course");
      
      const noSchedule = scheduleLoader.getStudentSchedule("9999999");
      assert.equal(noSchedule.length, 0, "Should return empty array for student with no schedule");
    });
  });
}

/**
 * Tests for the ContactDataLoader class.
 */
function test_ContactDataLoader() {
  QUnit.module("Data Loaders - ContactDataLoader", function() {
    
    let contactLoader;
    let mockContactData = [
      ["Student ID", "Student Email", "Parent Name", "Guardian 1 Email"],
      ["1234567", "john.doe@student.edu", "Jane Doe", "jane.doe@email.com"],
      ["7654321", "jane.smith@student.edu", "Bob Smith", "bob.smith@email.com"]
    ];
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        const mockSheet = {
          getDataRange: function() {
            return {
              getValues: function() { return mockContactData; }
            };
          },
          getLastRow: function() { return mockContactData.length; },
          getLastColumn: function() { return mockContactData[0].length; },
          getName: function() { return SHEET_NAMES.CONTACT_INFO; }
        };
        
        contactLoader = new ContactDataLoader();
        contactLoader.getSheet = function() { return mockSheet; };
      });
    });

    QUnit.test("ContactDataLoader should work correctly", function(assert) {
      assert.ok(contactLoader instanceof ContactDataLoader, "Should create ContactDataLoader instance");
      
      const data = contactLoader.loadData();
      assert.equal(data.length, 2, "Should load contact records");
    });

    QUnit.test("getStudentContact should return contact information", function(assert) {
      const contact = contactLoader.getStudentContact("1234567");
      
      assert.ok(contact !== null, "Should find contact information");
      assert.equal(contact[1], "john.doe@student.edu", "Should return correct student email");
      assert.equal(contact[2], "Jane Doe", "Should return correct parent name");
      assert.equal(contact[3], "jane.doe@email.com", "Should return correct guardian email");
    });
  });
}

/**
 * Tests for other specific data loaders.
 */
function test_EntryWithdrawalDataLoader() {
  QUnit.module("Data Loaders - EntryWithdrawalDataLoader", function() {
    QUnit.test("EntryWithdrawalDataLoader should be properly configured", function(assert) {
      const loader = new EntryWithdrawalDataLoader();
      assert.ok(loader instanceof EntryWithdrawalDataLoader, "Should create instance");
      assert.equal(loader.sheetName, SHEET_NAMES.ENTRY_WITHDRAWAL, "Should use correct sheet");
    });
  });
}

function test_FormResponsesDataLoader() {
  QUnit.module("Data Loaders - FormResponsesDataLoader", function() {
    QUnit.test("FormResponsesDataLoader should be properly configured", function(assert) {
      const loader = new FormResponsesDataLoader();
      assert.ok(loader instanceof FormResponsesDataLoader, "Should create instance");
      assert.equal(loader.sheetName, SHEET_NAMES.FORM_RESPONSES_1, "Should use correct sheet");
    });
  });
}

function test_WithdrawnDataLoader() {
  QUnit.module("Data Loaders - WithdrawnDataLoader", function() {
    QUnit.test("WithdrawnDataLoader should be properly configured", function(assert) {
      const loader = new WithdrawnDataLoader();
      assert.ok(loader instanceof WithdrawnDataLoader, "Should create instance");
      assert.equal(loader.sheetName, SHEET_NAMES.WITHDRAWN, "Should use correct sheet");
    });
  });
}

function test_WdOtherDataLoader() {
  QUnit.module("Data Loaders - WdOtherDataLoader", function() {
    QUnit.test("WdOtherDataLoader should be properly configured", function(assert) {
      const loader = new WdOtherDataLoader();
      assert.ok(loader instanceof WdOtherDataLoader, "Should create instance");
      assert.equal(loader.sheetName, SHEET_NAMES.WD_OTHER, "Should use correct sheet");
    });
  });
}

function test_AttendanceDataLoader() {
  QUnit.module("Data Loaders - AttendanceDataLoader", function() {
    QUnit.test("AttendanceDataLoader should be properly configured", function(assert) {
      const loader = new AttendanceDataLoader();
      assert.ok(loader instanceof AttendanceDataLoader, "Should create instance");
      assert.equal(loader.sheetName, SHEET_NAMES.ATTENDANCE, "Should use correct sheet");
    });
  });
}

/**
 * Register data loader tests with QUnit.
 * This function is called by the test runner to set up data loader tests.
 */
function registerDataLoaderTests() {
  test_TentativeDataLoader();
  test_RegistrationDataLoader();
  test_ScheduleDataLoader();
  test_FormResponsesDataLoader();
  test_ContactDataLoader();
  test_EntryWithdrawalDataLoader();
  test_WithdrawnDataLoader();
  test_WdOtherDataLoader();
  test_AttendanceDataLoader();
}
