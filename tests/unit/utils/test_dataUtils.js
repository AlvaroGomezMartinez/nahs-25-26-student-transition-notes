/**
 * Unit tests for the DataUtils utility class.
 * Tests data manipulation, validation, and transformation functions.
 */

/**
 * Tests for the DataUtils class.
 */
function test_DataUtils() {
  QUnit.module("Utilities - DataUtils", function() {
    
    let dataUtils;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        dataUtils = new DataUtils();
      });
    });

    QUnit.test("DataUtils constructor should create instance", function(assert) {
      assert.ok(dataUtils instanceof DataUtils, "Should create DataUtils instance");
      assert.ok(typeof dataUtils.extractStudentId === 'function', "Should have extractStudentId method");
      assert.ok(typeof dataUtils.sanitizeData === 'function', "Should have sanitizeData method");
    });

    QUnit.test("extractStudentId should extract IDs correctly", function(assert) {
      // Test standard student ID
      const id1 = dataUtils.extractStudentId("1234567");
      assert.equal(id1, "1234567", "Should extract 7-digit ID");

      // Test ID with prefix
      const id2 = dataUtils.extractStudentId("STUDENT-1234567");
      assert.equal(id2, "1234567", "Should extract ID from prefixed string");

      // Test ID embedded in text
      const id3 = dataUtils.extractStudentId("Student John Doe (ID: 1234567)");
      assert.equal(id3, "1234567", "Should extract ID from descriptive text");

      // Test invalid inputs
      const invalidId1 = dataUtils.extractStudentId("");
      assert.equal(invalidId1, null, "Should return null for empty string");

      const invalidId2 = dataUtils.extractStudentId("no-numbers-here");
      assert.equal(invalidId2, null, "Should return null when no ID found");

      const invalidId3 = dataUtils.extractStudentId(null);
      assert.equal(invalidId3, null, "Should return null for null input");
    });

    QUnit.test("sanitizeData should clean data correctly", function(assert) {
      // Test string trimming
      const trimmed = dataUtils.sanitizeData("  test data  ");
      assert.equal(trimmed, "test data", "Should trim whitespace");

      // Test null/undefined handling
      const nullResult = dataUtils.sanitizeData(null);
      assert.equal(nullResult, "", "Should convert null to empty string");

      const undefinedResult = dataUtils.sanitizeData(undefined);
      assert.equal(undefinedResult, "", "Should convert undefined to empty string");

      // Test number handling
      const numberResult = dataUtils.sanitizeData(123);
      assert.equal(numberResult, "123", "Should convert numbers to strings");

      // Test boolean handling
      const boolResult = dataUtils.sanitizeData(true);
      assert.equal(boolResult, "true", "Should convert booleans to strings");
    });

    QUnit.test("normalizeStudentName should format names correctly", function(assert) {
      // Test standard "Last, First" format
      const name1 = dataUtils.normalizeStudentName("Doe, John");
      assert.deepEqual(name1, { first: "John", last: "Doe" }, "Should parse Last, First format");

      // Test "First Last" format
      const name2 = dataUtils.normalizeStudentName("John Doe");
      assert.deepEqual(name2, { first: "John", last: "Doe" }, "Should parse First Last format");

      // Test single name
      const name3 = dataUtils.normalizeStudentName("John");
      assert.deepEqual(name3, { first: "John", last: "" }, "Should handle single name");

      // Test empty/invalid names
      const name4 = dataUtils.normalizeStudentName("");
      assert.deepEqual(name4, { first: "", last: "" }, "Should handle empty string");

      const name5 = dataUtils.normalizeStudentName(null);
      assert.deepEqual(name5, { first: "", last: "" }, "Should handle null input");

      // Test names with extra whitespace
      const name6 = dataUtils.normalizeStudentName("  Doe  ,  John  ");
      assert.deepEqual(name6, { first: "John", last: "Doe" }, "Should handle extra whitespace");
    });

    QUnit.test("validateArrayData should validate arrays correctly", function(assert) {
      // Test valid arrays
      const validArray = ["item1", "item2", "item3"];
      assert.ok(dataUtils.validateArrayData(validArray), "Should validate non-empty array");

      const singleItemArray = ["item"];
      assert.ok(dataUtils.validateArrayData(singleItemArray), "Should validate single-item array");

      // Test invalid arrays
      const emptyArray = [];
      assert.notOk(dataUtils.validateArrayData(emptyArray), "Should reject empty array");

      const nullArray = null;
      assert.notOk(dataUtils.validateArrayData(nullArray), "Should reject null");

      const notArray = "not an array";
      assert.notOk(dataUtils.validateArrayData(notArray), "Should reject non-array");
    });

    QUnit.test("flattenData should flatten nested structures", function(assert) {
      // Test nested arrays
      const nestedArray = [[1, 2], [3, 4], [5]];
      const flattened = dataUtils.flattenData(nestedArray);
      assert.deepEqual(flattened, [1, 2, 3, 4, 5], "Should flatten nested arrays");

      // Test mixed nesting levels
      const mixedNested = [1, [2, [3, 4]], 5];
      const flattenedMixed = dataUtils.flattenData(mixedNested);
      assert.deepEqual(flattenedMixed, [1, 2, 3, 4, 5], "Should flatten mixed nesting levels");

      // Test already flat array
      const flatArray = [1, 2, 3, 4, 5];
      const stillFlat = dataUtils.flattenData(flatArray);
      assert.deepEqual(stillFlat, [1, 2, 3, 4, 5], "Should handle already flat arrays");

      // Test empty arrays
      const emptyNested = [[], [], []];
      const flattenedEmpty = dataUtils.flattenData(emptyNested);
      assert.deepEqual(flattenedEmpty, [], "Should handle nested empty arrays");
    });

    QUnit.test("mergeMaps should combine maps correctly", function(assert) {
      // Test basic map merging
      const map1 = new Map([["key1", "value1"], ["key2", "value2"]]);
      const map2 = new Map([["key3", "value3"], ["key4", "value4"]]);
      
      const merged = dataUtils.mergeMaps(map1, map2);
      assert.equal(merged.size, 4, "Should merge all entries");
      assert.equal(merged.get("key1"), "value1", "Should preserve first map values");
      assert.equal(merged.get("key3"), "value3", "Should include second map values");

      // Test overlapping keys (second map should win)
      const mapA = new Map([["key1", "valueA"], ["key2", "valueA2"]]);
      const mapB = new Map([["key1", "valueB"], ["key3", "valueB3"]]);
      
      const mergedOverlap = dataUtils.mergeMaps(mapA, mapB);
      assert.equal(mergedOverlap.get("key1"), "valueB", "Second map should override first");
      assert.equal(mergedOverlap.get("key2"), "valueA2", "Non-overlapping keys should be preserved");
    });

    QUnit.test("convertToMap should convert arrays to maps", function(assert) {
      // Test array of objects with ID key
      const students = [
        { id: "123", name: "John" },
        { id: "456", name: "Jane" }
      ];
      
      const studentMap = dataUtils.convertToMap(students, "id");
      assert.ok(studentMap instanceof Map, "Should return a Map instance");
      assert.equal(studentMap.size, 2, "Should have correct number of entries");
      assert.equal(studentMap.get("123").name, "John", "Should map by correct key");

      // Test array of arrays (2D array)
      const arrayData = [
        ["123", "John", "Doe"],
        ["456", "Jane", "Smith"]
      ];
      
      const mappedArray = dataUtils.convertToMap(arrayData, 0); // Use first column as key
      assert.equal(mappedArray.get("123")[1], "John", "Should map 2D arrays correctly");
    });

    QUnit.test("groupBy should group data correctly", function(assert) {
      // Test grouping objects by property
      const students = [
        { grade: "9", name: "John" },
        { grade: "10", name: "Jane" },
        { grade: "9", name: "Bob" },
        { grade: "10", name: "Alice" }
      ];
      
      const grouped = dataUtils.groupBy(students, "grade");
      assert.ok(grouped instanceof Map, "Should return a Map");
      assert.equal(grouped.size, 2, "Should have correct number of groups");
      assert.equal(grouped.get("9").length, 2, "Should group grade 9 students correctly");
      assert.equal(grouped.get("10").length, 2, "Should group grade 10 students correctly");
    });

    QUnit.test("removeEmptyValues should clean objects", function(assert) {
      const dirtyObject = {
        validString: "test",
        emptyString: "",
        nullValue: null,
        undefinedValue: undefined,
        validNumber: 0,
        validBoolean: false
      };
      
      const cleaned = dataUtils.removeEmptyValues(dirtyObject);
      assert.ok(cleaned.hasOwnProperty("validString"), "Should keep valid strings");
      assert.ok(cleaned.hasOwnProperty("validNumber"), "Should keep valid numbers (including 0)");
      assert.ok(cleaned.hasOwnProperty("validBoolean"), "Should keep valid booleans (including false)");
      assert.notOk(cleaned.hasOwnProperty("emptyString"), "Should remove empty strings");
      assert.notOk(cleaned.hasOwnProperty("nullValue"), "Should remove null values");
      assert.notOk(cleaned.hasOwnProperty("undefinedValue"), "Should remove undefined values");
    });
  });
}
