/**
 * Unit tests for the ValidationUtils class.
 * Tests data validation functions for student data integrity.
 */

/**
 * Tests for the ValidationUtils class.
 */
function test_ValidationUtils() {
  QUnit.module("Utilities - ValidationUtils", function() {
    
    let validationUtils;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        validationUtils = new ValidationUtils();
      });
    });

    QUnit.test("ValidationUtils constructor should create instance", function(assert) {
      assert.ok(validationUtils instanceof ValidationUtils, "Should create ValidationUtils instance");
      assert.ok(typeof validationUtils.validateStudentData === 'function', "Should have validateStudentData method");
      assert.ok(typeof validationUtils.validateEntryWithdrawalData === 'function', "Should have validateEntryWithdrawalData method");
    });

    QUnit.test("validateStudentData should validate student records", function(assert) {
      // Test valid student data
      const validStudent = {
        id: "1234567",
        firstName: "John",
        lastName: "Doe", 
        grade: "10",
        entryDate: "2024-08-15"
      };
      
      const validResult = validationUtils.validateStudentData(validStudent);
      assert.ok(validResult.isValid, "Should validate complete student data");
      assert.equal(validResult.errors.length, 0, "Should have no errors for valid data");

      // Test invalid student data
      const invalidStudent = {
        id: "", // Empty ID
        firstName: "John",
        lastName: "", // Empty last name
        grade: "Invalid", // Invalid grade
        entryDate: "invalid-date" // Invalid date
      };
      
      const invalidResult = validationUtils.validateStudentData(invalidStudent);
      assert.notOk(invalidResult.isValid, "Should reject invalid student data");
      assert.ok(invalidResult.errors.length > 0, "Should have error messages");
      assert.ok(invalidResult.errors.some(err => err.includes("ID")), "Should flag missing ID");
      assert.ok(invalidResult.errors.some(err => err.includes("lastName")), "Should flag missing last name");
    });

    QUnit.test("validateEntryWithdrawalData should validate entry/withdrawal records", function(assert) {
      // Test valid entry/withdrawal data
      const validEntryData = {
        "Student Name(Last, First)": "Doe, John",
        "Entry Date": "2024-08-15",
        "Grd Lvl": "10"
      };
      
      const validResult = validationUtils.validateEntryWithdrawalData(validEntryData);
      assert.ok(validResult.isValid, "Should validate complete entry/withdrawal data");
      assert.equal(validResult.errors.length, 0, "Should have no errors for valid data");

      // Test invalid entry/withdrawal data
      const invalidEntryData = {
        "Student Name(Last, First)": "", // Empty name
        "Entry Date": "invalid-date", // Invalid date
        "Grd Lvl": "" // Empty grade
      };
      
      const invalidResult = validationUtils.validateEntryWithdrawalData(invalidEntryData);
      assert.notOk(invalidResult.isValid, "Should reject invalid entry/withdrawal data");
      assert.ok(invalidResult.errors.length > 0, "Should have error messages");
    });

    QUnit.test("validateTeacherInput should validate teacher form responses", function(assert) {
      // Test valid teacher input
      const validTeacherData = {
        "Teacher": "Ms. Smith",
        "What period do you have this student?": "1st",
        "Course Title": "Algebra I",
        "How would you assess this student's academic growth?": "Good progress"
      };
      
      const validResult = validationUtils.validateTeacherInput(validTeacherData);
      assert.ok(validResult.isValid, "Should validate complete teacher input");
      assert.equal(validResult.errors.length, 0, "Should have no errors for valid data");

      // Test invalid teacher input
      const invalidTeacherData = {
        "Teacher": "", // Missing teacher name
        "What period do you have this student?": "Invalid Period", // Invalid period
        "Course Title": "",
        "How would you assess this student's academic growth?": ""
      };
      
      const invalidResult = validationUtils.validateTeacherInput(invalidTeacherData);
      assert.notOk(invalidResult.isValid, "Should reject invalid teacher input");
      assert.ok(invalidResult.errors.length > 0, "Should have error messages");
    });

    QUnit.test("validateStudentId should validate ID formats", function(assert) {
      // Test valid IDs
      assert.ok(validationUtils.validateStudentId("1234567"), "Should accept 7-digit ID");
      assert.ok(validationUtils.validateStudentId("9876543"), "Should accept different 7-digit ID");

      // Test invalid IDs
      assert.notOk(validationUtils.validateStudentId(""), "Should reject empty ID");
      assert.notOk(validationUtils.validateStudentId("123"), "Should reject too short ID");
      assert.notOk(validationUtils.validateStudentId("12345678"), "Should reject too long ID");
      assert.notOk(validationUtils.validateStudentId("abc1234"), "Should reject non-numeric ID");
      assert.notOk(validationUtils.validateStudentId(null), "Should reject null ID");
      assert.notOk(validationUtils.validateStudentId(undefined), "Should reject undefined ID");
    });

    QUnit.test("validateGrade should validate grade levels", function(assert) {
      // Test valid grades
      assert.ok(validationUtils.validateGrade("9"), "Should accept grade 9");
      assert.ok(validationUtils.validateGrade("10"), "Should accept grade 10");
      assert.ok(validationUtils.validateGrade("11"), "Should accept grade 11");
      assert.ok(validationUtils.validateGrade("12"), "Should accept grade 12");

      // Test invalid grades
      assert.notOk(validationUtils.validateGrade(""), "Should reject empty grade");
      assert.notOk(validationUtils.validateGrade("8"), "Should reject grade 8 (too low)");
      assert.notOk(validationUtils.validateGrade("13"), "Should reject grade 13 (too high)");
      assert.notOk(validationUtils.validateGrade("abc"), "Should reject non-numeric grade");
      assert.notOk(validationUtils.validateGrade(null), "Should reject null grade");
    });

    QUnit.test("validateDate should validate date formats", function(assert) {
      // Test valid dates
      assert.ok(validationUtils.validateDate("2024-08-15"), "Should accept ISO date format");
      assert.ok(validationUtils.validateDate("08/15/2024"), "Should accept US date format");
      assert.ok(validationUtils.validateDate(new Date()), "Should accept Date object");

      // Test invalid dates
      assert.notOk(validationUtils.validateDate(""), "Should reject empty date");
      assert.notOk(validationUtils.validateDate("invalid-date"), "Should reject invalid date string");
      assert.notOk(validationUtils.validateDate("2024-13-01"), "Should reject invalid month");
      assert.notOk(validationUtils.validateDate("2024-02-30"), "Should reject invalid day");
      assert.notOk(validationUtils.validateDate(null), "Should reject null date");
    });

    QUnit.test("validateEmail should validate email addresses", function(assert) {
      // Test valid emails
      assert.ok(validationUtils.validateEmail("test@example.com"), "Should accept standard email");
      assert.ok(validationUtils.validateEmail("user.name@domain.org"), "Should accept email with dot");
      assert.ok(validationUtils.validateEmail("teacher123@school.edu"), "Should accept email with numbers");

      // Test invalid emails
      assert.notOk(validationUtils.validateEmail(""), "Should reject empty email");
      assert.notOk(validationUtils.validateEmail("invalid-email"), "Should reject email without @");
      assert.notOk(validationUtils.validateEmail("@domain.com"), "Should reject email without local part");
      assert.notOk(validationUtils.validateEmail("user@"), "Should reject email without domain");
      assert.notOk(validationUtils.validateEmail("user@domain"), "Should reject email without TLD");
      assert.notOk(validationUtils.validateEmail(null), "Should reject null email");
    });

    QUnit.test("validateDatasetIntegrity should validate complete datasets", function(assert) {
      // Test valid dataset
      const validDataset = new Map([
        ["1234567", {
          "Entry_Withdrawal": [{"Entry Date": "2024-08-15", "Student Name(Last, First)": "Doe, John"}],
          "TENTATIVE": [{"GRADE": "10", "FIRST": "John", "LAST": "Doe"}],
          "Registrations_SY_24_25": [{"Placement Days": 45}]
        }],
        ["7654321", {
          "Entry_Withdrawal": [{"Entry Date": "2024-08-20", "Student Name(Last, First)": "Smith, Jane"}],
          "TENTATIVE": [{"GRADE": "11", "FIRST": "Jane", "LAST": "Smith"}],
          "Registrations_SY_24_25": [{"Placement Days": 60}]
        }]
      ]);
      
      const validResult = validationUtils.validateDatasetIntegrity(validDataset);
      assert.ok(validResult.isValid, "Should validate complete dataset");
      assert.equal(validResult.errors.length, 0, "Should have no errors for valid dataset");

      // Test dataset with issues
      const invalidDataset = new Map([
        ["invalid-id", { // Invalid student ID
          "Entry_Withdrawal": [], // Missing required data
          "TENTATIVE": [{"GRADE": "invalid"}] // Invalid grade
        }]
      ]);
      
      const invalidResult = validationUtils.validateDatasetIntegrity(invalidDataset);
      assert.notOk(invalidResult.isValid, "Should reject invalid dataset");
      assert.ok(invalidResult.errors.length > 0, "Should have error messages");
    });

    QUnit.test("validateRequiredFields should check for required data", function(assert) {
      // Test object with all required fields
      const completeData = {
        requiredField1: "value1",
        requiredField2: "value2",
        optionalField: "optional"
      };
      
      const requiredFields = ["requiredField1", "requiredField2"];
      const validResult = validationUtils.validateRequiredFields(completeData, requiredFields);
      assert.ok(validResult.isValid, "Should validate when all required fields present");
      assert.equal(validResult.errors.length, 0, "Should have no errors");

      // Test object with missing required fields
      const incompleteData = {
        requiredField1: "value1",
        // requiredField2 is missing
        optionalField: "optional"
      };
      
      const invalidResult = validationUtils.validateRequiredFields(incompleteData, requiredFields);
      assert.notOk(invalidResult.isValid, "Should reject when required fields missing");
      assert.ok(invalidResult.errors.length > 0, "Should have error messages");
      assert.ok(invalidResult.errors.some(err => err.includes("requiredField2")), "Should identify missing field");
    });
  });
}
