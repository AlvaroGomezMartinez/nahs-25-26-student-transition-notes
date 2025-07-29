/**
 * Unit tests for the BaseDataLoader class.
 * Tests the common functionality that all data loaders inherit.
 */

/**
 * Register base data loader tests with QUnit.
 * This function is called by the test runner to set up base data loader tests.
 */
function registerBaseDataLoaderTests() {
  test_BaseDataLoader();
}

/**
 * Tests for the BaseDataLoader class.
 */
function test_BaseDataLoader() {
  QUnit.module("Data Loaders - BaseDataLoader", function() {
    
    let baseLoader;
    let mockSheet;
    
    QUnit.module("Setup", function(hooks) {
      hooks.beforeEach(function() {
        // Create a mock sheet object for testing
        mockSheet = {
          getDataRange: function() {
            return {
              getValues: function() {
                return [
                  ["Header1", "Header2", "Header3"],
                  ["Value1", "Value2", "Value3"],
                  ["Value4", "Value5", "Value6"]
                ];
              }
            };
          },
          getLastRow: function() { return 3; },
          getLastColumn: function() { return 3; },
          getName: function() { return "MockSheet"; }
        };
        
        // Mock SpreadsheetApp for testing
        if (typeof SpreadsheetApp === 'undefined') {
          global.SpreadsheetApp = {
            getActiveSpreadsheet: function() {
              return {
                getSheetByName: function(name) {
                  return mockSheet;
                }
              };
            }
          };
        }
        
        baseLoader = new BaseDataLoader("MockSheet");
      });
    });

    QUnit.test("BaseDataLoader constructor should initialize correctly", function(assert) {
      assert.ok(baseLoader instanceof BaseDataLoader, "Should create BaseDataLoader instance");
      assert.equal(baseLoader.sheetName, "MockSheet", "Should set sheet name correctly");
      assert.ok(typeof baseLoader.loadData === 'function', "Should have loadData method");
      assert.ok(typeof baseLoader.getSheet === 'function', "Should have getSheet method");
    });

    QUnit.test("getSheet should return sheet instance", function(assert) {
      const sheet = baseLoader.getSheet();
      assert.ok(sheet !== null, "Should return sheet instance");
      assert.equal(sheet.getName(), "MockSheet", "Should return correct sheet");
    });

    QUnit.test("loadData should load sheet data correctly", function(assert) {
      const data = baseLoader.loadData();
      
      assert.ok(Array.isArray(data), "Should return array data");
      assert.equal(data.length, 2, "Should return correct number of data rows (excluding header)");
      assert.deepEqual(data[0], ["Value1", "Value2", "Value3"], "Should return first data row correctly");
      assert.deepEqual(data[1], ["Value4", "Value5", "Value6"], "Should return second data row correctly");
    });

    QUnit.test("getHeaders should return header row", function(assert) {
      const headers = baseLoader.getHeaders();
      
      assert.ok(Array.isArray(headers), "Should return array of headers");
      assert.equal(headers.length, 3, "Should return correct number of headers");
      assert.deepEqual(headers, ["Header1", "Header2", "Header3"], "Should return correct header values");
    });

    QUnit.test("validateSheet should validate sheet exists", function(assert) {
      // Test valid sheet
      const validResult = baseLoader.validateSheet();
      assert.ok(validResult.isValid, "Should validate existing sheet");
      assert.equal(validResult.errors.length, 0, "Should have no errors for valid sheet");

      // Test invalid sheet (mock a non-existent sheet)
      const invalidLoader = new BaseDataLoader("NonExistentSheet");
      
      // Mock getSheet to return null for non-existent sheet
      invalidLoader.getSheet = function() { return null; };
      
      const invalidResult = invalidLoader.validateSheet();
      assert.notOk(invalidResult.isValid, "Should reject non-existent sheet");
      assert.ok(invalidResult.errors.length > 0, "Should have error messages");
    });

    QUnit.test("getRowCount should return correct count", function(assert) {
      const rowCount = baseLoader.getRowCount();
      assert.equal(rowCount, 3, "Should return correct row count including header");
    });

    QUnit.test("getColumnCount should return correct count", function(assert) {
      const columnCount = baseLoader.getColumnCount();
      assert.equal(columnCount, 3, "Should return correct column count");
    });

    QUnit.test("getDataWithHeaders should return structured data", function(assert) {
      const structuredData = baseLoader.getDataWithHeaders();
      
      assert.ok(Array.isArray(structuredData), "Should return array of objects");
      assert.equal(structuredData.length, 2, "Should return correct number of data objects");
      
      const firstRow = structuredData[0];
      assert.equal(firstRow["Header1"], "Value1", "Should map header to value correctly");
      assert.equal(firstRow["Header2"], "Value2", "Should map second header correctly");
      assert.equal(firstRow["Header3"], "Value3", "Should map third header correctly");
    });

    QUnit.test("findRowsByColumn should find matching rows", function(assert) {
      const matchingRows = baseLoader.findRowsByColumn("Header1", "Value1");
      
      assert.ok(Array.isArray(matchingRows), "Should return array of matching rows");
      assert.equal(matchingRows.length, 1, "Should find one matching row");
      assert.deepEqual(matchingRows[0], ["Value1", "Value2", "Value3"], "Should return correct matching row");

      // Test no matches
      const noMatches = baseLoader.findRowsByColumn("Header1", "NonExistentValue");
      assert.equal(noMatches.length, 0, "Should return empty array for no matches");
    });

    QUnit.test("getColumnIndex should return correct index", function(assert) {
      const index1 = baseLoader.getColumnIndex("Header1");
      assert.equal(index1, 0, "Should return correct index for first column");

      const index2 = baseLoader.getColumnIndex("Header2");
      assert.equal(index2, 1, "Should return correct index for second column");

      const invalidIndex = baseLoader.getColumnIndex("NonExistentHeader");
      assert.equal(invalidIndex, -1, "Should return -1 for non-existent header");
    });

    QUnit.test("getColumnData should return column values", function(assert) {
      const columnData = baseLoader.getColumnData("Header2");
      
      assert.ok(Array.isArray(columnData), "Should return array of column values");
      assert.equal(columnData.length, 2, "Should return correct number of values (excluding header)");
      assert.deepEqual(columnData, ["Value2", "Value5"], "Should return correct column values");

      // Test non-existent column
      const invalidColumnData = baseLoader.getColumnData("NonExistentHeader");
      assert.equal(invalidColumnData.length, 0, "Should return empty array for non-existent column");
    });

    QUnit.test("cacheData should improve performance", function(assert) {
      // First load - should cache data
      const data1 = baseLoader.loadData();
      
      // Mock the sheet to return different data
      mockSheet.getDataRange = function() {
        return {
          getValues: function() {
            return [
              ["Header1", "Header2", "Header3"],
              ["NewValue1", "NewValue2", "NewValue3"]
            ];
          }
        };
      };
      
      // Second load - should return cached data (same as first)
      const data2 = baseLoader.loadData();
      assert.deepEqual(data1, data2, "Should return cached data on second load");
      
      // Clear cache and load again - should get new data
      baseLoader.clearCache();
      const data3 = baseLoader.loadData();
      assert.notDeepEqual(data1, data3, "Should return fresh data after cache clear");
    });

    QUnit.test("error handling should work correctly", function(assert) {
      // Mock sheet to throw error
      const errorLoader = new BaseDataLoader("ErrorSheet");
      errorLoader.getSheet = function() {
        throw new Error("Sheet access error");
      };
      
      assert.throws(
        function() { errorLoader.loadData(); },
        /Sheet access error/,
        "Should throw error when sheet access fails"
      );
    });
  });
}
