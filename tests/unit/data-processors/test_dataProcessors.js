/**
 * Unit tests for the data processor classes.
 * Tests the data processing logic for student information.
 */

/**
 * Tests for the BaseDataProcessor class.
 */
function test_BaseDataProcessor() {
  QUnit.module("Data Processors - BaseDataProcessor", function() {
    
    let baseProcessor;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        baseProcessor = new BaseDataProcessor("TestProcessor");
      });
    });

    QUnit.test("BaseDataProcessor constructor should initialize correctly", function(assert) {
      assert.ok(baseProcessor instanceof BaseDataProcessor, "Should create BaseDataProcessor instance");
      assert.equal(baseProcessor.processorName, "TestProcessor", "Should set processor name");
      assert.ok(typeof baseProcessor.process === 'function', "Should have process method");
      assert.ok(typeof baseProcessor.log === 'function', "Should have log method");
    });

    QUnit.test("logging methods should work correctly", function(assert) {
      // Test that logging methods don't throw errors
      assert.doesNotThrow(() => {
        baseProcessor.log("Test message");
        baseProcessor.warn("Test warning");
        baseProcessor.error("Test error");
      }, "Logging methods should not throw errors");
    });

    QUnit.test("validateInput should validate processing data", function(assert) {
      // Test valid input
      const validInput = {
        studentId: "1234567",
        data: { key: "value" }
      };
      
      const validResult = baseProcessor.validateInput(validInput);
      assert.ok(validResult.isValid, "Should validate correct input structure");
      
      // Test invalid input
      const invalidInput = null;
      const invalidResult = baseProcessor.validateInput(invalidInput);
      assert.notOk(invalidResult.isValid, "Should reject null input");
    });
  });
}

/**
 * Tests for the StudentDataMerger class.
 */
function test_StudentDataMerger() {
  QUnit.module("Data Processors - StudentDataMerger", function() {
    
    let dataMerger;
    let mockStudentData;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        dataMerger = new StudentDataMerger();
        
        mockStudentData = {
          "1234567": {
            "TENTATIVE": [{ "FIRST": "John", "LAST": "Doe", "GRADE": "10" }],
            "Entry_Withdrawal": [{ "Entry Date": "2024-08-15", "Student Name(Last, First)": "Doe, John" }],
            "Registrations_SY_24_25": [{ "Home Campus": "High School A", "Placement Days": 45 }]
          },
          "7654321": {
            "TENTATIVE": [{ "FIRST": "Jane", "LAST": "Smith", "GRADE": "11" }],
            "Entry_Withdrawal": [{ "Entry Date": "2024-08-20", "Student Name(Last, First)": "Smith, Jane" }]
          }
        };
      });
    });

    QUnit.test("StudentDataMerger should extend BaseDataProcessor", function(assert) {
      assert.ok(dataMerger instanceof StudentDataMerger, "Should create StudentDataMerger instance");
      assert.ok(dataMerger instanceof BaseDataProcessor, "Should extend BaseDataProcessor");
    });

    QUnit.test("mergeStudentData should combine data from multiple sources", function(assert) {
      const mergedData = dataMerger.mergeStudentData("1234567", mockStudentData["1234567"]);
      
      assert.ok(typeof mergedData === 'object', "Should return merged data object");
      assert.ok(mergedData.hasOwnProperty("personalInfo"), "Should have personal info section");
      assert.ok(mergedData.hasOwnProperty("academic"), "Should have academic section");
      assert.ok(mergedData.hasOwnProperty("registration"), "Should have registration section");
      
      assert.equal(mergedData.personalInfo.firstName, "John", "Should merge first name correctly");
      assert.equal(mergedData.personalInfo.lastName, "Doe", "Should merge last name correctly");
      assert.equal(mergedData.academic.grade, "10", "Should merge grade correctly");
    });

    QUnit.test("consolidateScheduleData should merge schedule information", function(assert) {
      const scheduleData = [
        { "Per Beg": 1, "Course Title": "Algebra I", "Teacher Name": "Ms. Johnson" },
        { "Per Beg": 2, "Course Title": "English I", "Teacher Name": "Mr. Smith" }
      ];
      
      const consolidated = dataMerger.consolidateScheduleData(scheduleData);
      
      assert.ok(Array.isArray(consolidated), "Should return array of consolidated schedule data");
      assert.equal(consolidated.length, 2, "Should preserve all schedule entries");
      assert.equal(consolidated[0]["Course Title"], "Algebra I", "Should preserve course information");
    });

    QUnit.test("resolveDataConflicts should handle conflicting information", function(assert) {
      const conflictingData = {
        source1: { name: "John Doe", grade: "10" },
        source2: { name: "John Doe", grade: "11" } // Grade conflict
      };
      
      const resolved = dataMerger.resolveDataConflicts(conflictingData);
      
      assert.ok(typeof resolved === 'object', "Should return resolved data");
      assert.ok(resolved.hasOwnProperty('conflicts'), "Should identify conflicts");
      assert.ok(Array.isArray(resolved.conflicts), "Should list conflicts as array");
    });
  });
}

/**
 * Tests for the StudentFilterProcessor class.
 */
function test_StudentFilterProcessor() {
  QUnit.module("Data Processors - StudentFilterProcessor", function() {
    
    let filterProcessor;
    let mockStudentDataMap;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        filterProcessor = new StudentFilterProcessor();
        
        mockStudentDataMap = new Map([
          ["1234567", {
            "Entry_Withdrawal": [{ "Entry Date": "2024-08-15", "Grd Lvl": "10" }],
            "TENTATIVE": [{ "GRADE": "10" }],
            "Registrations_SY_24_25": [{ "Placement Days": 45 }]
          }],
          ["7654321", {
            "Entry_Withdrawal": [{ "Entry Date": "2024-08-20", "Grd Lvl": "11" }],
            "TENTATIVE": [{ "GRADE": "11" }],
            "Registrations_SY_24_25": [{ "Placement Days": 30 }]
          }],
          ["9999999", {
            // Incomplete data - missing required fields
            "Entry_Withdrawal": [],
            "TENTATIVE": []
          }]
        ]);
      });
    });

    QUnit.test("StudentFilterProcessor should extend BaseDataProcessor", function(assert) {
      assert.ok(filterProcessor instanceof StudentFilterProcessor, "Should create StudentFilterProcessor instance");
      assert.ok(filterProcessor instanceof BaseDataProcessor, "Should extend BaseDataProcessor");
    });

    QUnit.test("filterActiveStudents should remove inactive students", function(assert) {
      const filtered = filterProcessor.filterActiveStudents(mockStudentDataMap);
      
      assert.ok(filtered instanceof Map, "Should return a Map");
      assert.equal(filtered.size, 2, "Should filter out incomplete records");
      assert.ok(filtered.has("1234567"), "Should keep valid student 1234567");
      assert.ok(filtered.has("7654321"), "Should keep valid student 7654321");
      assert.notOk(filtered.has("9999999"), "Should remove incomplete student 9999999");
    });

    QUnit.test("hasRequiredData should validate student data completeness", function(assert) {
      const completeStudent = mockStudentDataMap.get("1234567");
      assert.ok(filterProcessor.hasRequiredData(completeStudent), "Should validate complete student data");
      
      const incompleteStudent = mockStudentDataMap.get("9999999");
      assert.notOk(filterProcessor.hasRequiredData(incompleteStudent), "Should reject incomplete student data");
    });

    QUnit.test("filterByGrade should filter students by grade level", function(assert) {
      const grade10Students = filterProcessor.filterByGrade(mockStudentDataMap, "10");
      
      assert.equal(grade10Students.size, 1, "Should find one grade 10 student");
      assert.ok(grade10Students.has("1234567"), "Should include correct grade 10 student");
      
      const grade11Students = filterProcessor.filterByGrade(mockStudentDataMap, "11");
      assert.equal(grade11Students.size, 1, "Should find one grade 11 student");
      assert.ok(grade11Students.has("7654321"), "Should include correct grade 11 student");
    });

    QUnit.test("filterByPlacementDays should filter by placement duration", function(assert) {
      const longPlacement = filterProcessor.filterByPlacementDays(mockStudentDataMap, 40);
      
      assert.equal(longPlacement.size, 1, "Should find students with placement >= 40 days");
      assert.ok(longPlacement.has("1234567"), "Should include student with 45 placement days");
      assert.notOk(longPlacement.has("7654321"), "Should exclude student with 30 placement days");
    });

    QUnit.test("getFilterStatistics should provide filtering metrics", function(assert) {
      const stats = filterProcessor.getFilterStatistics(mockStudentDataMap);
      
      assert.ok(typeof stats === 'object', "Should return statistics object");
      assert.ok(stats.hasOwnProperty('total'), "Should include total count");
      assert.ok(stats.hasOwnProperty('active'), "Should include active count");
      assert.ok(stats.hasOwnProperty('filtered'), "Should include filtered count");
      assert.equal(stats.total, 3, "Should count all students");
      assert.equal(stats.active, 2, "Should count active students");
      assert.equal(stats.filtered, 1, "Should count filtered students");
    });
  });
}

/**
 * Tests for the ScheduleProcessor class.
 */
function test_ScheduleProcessor() {
  QUnit.module("Data Processors - ScheduleProcessor", function() {
    
    let scheduleProcessor;
    let mockScheduleData;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        scheduleProcessor = new ScheduleProcessor();
        
        mockScheduleData = [
          { "Student ID": "1234567", "Per Beg": 1, "Course Title": "Algebra I", "Teacher Name": "Ms. Johnson" },
          { "Student ID": "1234567", "Per Beg": 2, "Course Title": "English I", "Teacher Name": "Mr. Smith" },
          { "Student ID": "7654321", "Per Beg": 1, "Course Title": "Geometry", "Teacher Name": "Ms. Davis" }
        ];
      });
    });

    QUnit.test("ScheduleProcessor should extend BaseDataProcessor", function(assert) {
      assert.ok(scheduleProcessor instanceof ScheduleProcessor, "Should create ScheduleProcessor instance");
      assert.ok(scheduleProcessor instanceof BaseDataProcessor, "Should extend BaseDataProcessor");
    });

    QUnit.test("processStudentSchedule should organize schedule by periods", function(assert) {
      const studentSchedule = mockScheduleData.filter(entry => entry["Student ID"] === "1234567");
      const processed = scheduleProcessor.processStudentSchedule(studentSchedule);
      
      assert.ok(typeof processed === 'object', "Should return organized schedule object");
      assert.ok(processed.hasOwnProperty('periods'), "Should have periods structure");
      assert.equal(Object.keys(processed.periods).length, 2, "Should organize by periods correctly");
    });

    QUnit.test("validateScheduleData should check schedule completeness", function(assert) {
      const validSchedule = mockScheduleData[0];
      const validResult = scheduleProcessor.validateScheduleData(validSchedule);
      assert.ok(validResult.isValid, "Should validate complete schedule entry");
      
      const invalidSchedule = { "Student ID": "1234567" }; // Missing required fields
      const invalidResult = scheduleProcessor.validateScheduleData(invalidSchedule);
      assert.notOk(invalidResult.isValid, "Should reject incomplete schedule entry");
    });
  });
}

/**
 * Tests for the TeacherInputProcessor class.
 */
function test_TeacherInputProcessor() {
  QUnit.module("Data Processors - TeacherInputProcessor", function() {
    
    let teacherProcessor;
    let mockStudentData;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        teacherProcessor = new TeacherInputProcessor();
        
        mockStudentData = {
          "Form_Responses_1": [
            {
              "Teacher": "Ms. Johnson",
              "What period do you have this student?": "1st",
              "Course Title": "Algebra I",
              "How would you assess this student's academic growth?": "Good progress",
              "Academic and Behavioral Progress Notes": "Student is improving"
            }
          ],
          "Schedules": [
            { "Per Beg": 1, "Course Title": "Algebra I", "Teacher Name": "Ms. Johnson" },
            { "Per Beg": 2, "Course Title": "English I", "Teacher Name": "Mr. Smith" }
          ],
          "TENTATIVE": [
            { "1st Period - Course Title": "Algebra I", "1st Period - Teacher Name": "Ms. Johnson" }
          ]
        };
      });
    });

    QUnit.test("TeacherInputProcessor should extend BaseDataProcessor", function(assert) {
      assert.ok(teacherProcessor instanceof TeacherInputProcessor, "Should create TeacherInputProcessor instance");
      assert.ok(teacherProcessor instanceof BaseDataProcessor, "Should extend BaseDataProcessor");
    });

    QUnit.test("processTeacherInput should create teacher input structure", function(assert) {
      const processed = teacherProcessor.processTeacherInput("1234567", mockStudentData);
      
      assert.ok(typeof processed === 'object', "Should return teacher input object");
      assert.ok(processed.hasOwnProperty('1st'), "Should have 1st period data");
      assert.ok(processed.hasOwnProperty('2nd'), "Should have 2nd period data");
      assert.ok(processed.hasOwnProperty('Special Education'), "Should have Special Education section");
      
      // Check that form response data is properly mapped
      assert.equal(processed['1st']['Course Title'], "Algebra I", "Should map course title correctly");
      assert.equal(processed['1st']['Teacher Name'], "Ms. Johnson", "Should map teacher name correctly");
    });

    QUnit.test("initializeTeacherInputStructure should create proper structure", function(assert) {
      const structure = teacherProcessor.initializeTeacherInputStructure();
      
      assert.ok(typeof structure === 'object', "Should return structure object");
      
      // Check all periods are initialized
      const expectedPeriods = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
      expectedPeriods.forEach(period => {
        assert.ok(structure.hasOwnProperty(period), `Should have ${period} period`);
        assert.ok(structure[period].hasOwnProperty('Course Title'), `${period} should have Course Title field`);
        assert.ok(structure[period].hasOwnProperty('Teacher Name'), `${period} should have Teacher Name field`);
      });
      
      assert.ok(structure.hasOwnProperty('Special Education'), "Should have Special Education section");
    });

    QUnit.test("periodToNumber should convert period formats correctly", function(assert) {
      assert.equal(teacherProcessor.periodToNumber(1), "1st", "Should convert 1 to '1st'");
      assert.equal(teacherProcessor.periodToNumber(2), "2nd", "Should convert 2 to '2nd'");
      assert.equal(teacherProcessor.periodToNumber(3), "3rd", "Should convert 3 to '3rd'");
      assert.equal(teacherProcessor.periodToNumber(4), "4th", "Should convert 4 to '4th'");
      assert.equal(teacherProcessor.periodToNumber(9), "Special Education", "Should convert 9 to 'Special Education'");
      assert.equal(teacherProcessor.periodToNumber(10), null, "Should return null for invalid period");
    });

    QUnit.test("flattenArray should flatten nested arrays", function(assert) {
      const nested = [[1, 2], [3, 4], [5]];
      const flattened = teacherProcessor.flattenArray(nested);
      
      assert.deepEqual(flattened, [1, 2, 3, 4, 5], "Should flatten nested arrays correctly");
      
      const alreadyFlat = [1, 2, 3];
      const stillFlat = teacherProcessor.flattenArray(alreadyFlat);
      assert.deepEqual(stillFlat, [1, 2, 3], "Should handle already flat arrays");
    });
  });
}
