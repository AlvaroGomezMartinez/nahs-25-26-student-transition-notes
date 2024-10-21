/**
 * Unit Tests for processBatch using QUnitGS2.
 */

// Optional for easier use.
var QUnit = QUnitGS2.QUnit;

/**
 * doGet() function to initialize QUnit and display test results as a webpage.
 * 
 * @returns {HtmlOutput} - The test results page showing the outcome of the unit tests.
 */
function doGet() {
   QUnitGS2.init(); // Initializes the library.

   // Add your test functions here
   test_processBatch(); // Example: this will run the processBatch unit test

   QUnit.config.hidepassed = false; // Show passed assertions

   QUnit.start(); // Starts running tests, notice QUnit vs QUnitGS2.
   return QUnitGS2.getHtml(); // Returns HTML for test results display
}

/**
 * Function to get test results from the server and display them on the webpage.
 * 
 * @returns {Object} - The test results.
 */
function getResultsFromServer() {
   return QUnitGS2.getResultsFromServer(); // This passes test results to the webpage
}

/**
 * Test function to validate the behavior of processBatch function.
 */
function test_processBatch() {
  // Mock the tentative sheet and its getRange and setValue methods
  const mockTentativeSheet = {
    data: {}, // Using an object to map row numbers to their data
    getRange: function(row, col, numRows) {
      return {
        getValues: function() {
          // Simulating getting student IDs from the tentative sheet (Column 4)
          return [
            ["123456"], ["234567"], ["345678"]
          ]; // Mock student IDs
        },
        setValue: function(value) {
          // Simulate setting the value in the tentative sheet based on the row number
          if (!mockTentativeSheet.data[row]) {
            mockTentativeSheet.data[row] = [];
          }
          // Push the value into the correct row
          mockTentativeSheet.data[row].push(value);
        }
      };
    },
    getLastRow: function() {
      return 3; // Simulating that the sheet has 3 rows
    }
  };

  // Mock batch data representing rows fetched from "ContactInfo"
  const mockBatchData = [
    ["123456", "Student1Last, Student1First", 9, "Parent1Last, Parent1First", "111-111-1111", "parent1Email1@gmail.com", "parent1Email2@gmail.com", "student1Email@students.nisd.net"], // Row 1
    ["234567", "Student2Last, Student2First", 10, "Parent2Last, Parent2First", "222-222-2222", "parent2Email1@gmail.com", "parent2Email2@gmail.com", "student2Email@students.nisd.net"], // Row 2
    ["345678", "Student3Last, Student3First", 11, "Parent3Last, Parent3First", "333-333-3333", "parent3Email1@gmail.com", "parent3Email2@gmail.com", "student3Email@students.nisd.net"], // Row 3
  ];

  // Call the processBatch function with mock data
  processBatch(mockBatchData, mockTentativeSheet);

  // Run assertions to check if the expected values were set in the mock sheet
  QUnit.test('Should map and insert emails and guardian info for matching student IDs', function(assert) {
    // Now, access the rows correctly based on the indices
    assert.equal(mockTentativeSheet.data[2][0], "student1Email@students.nisd.net", "Correct student email set for 123456");
    assert.equal(mockTentativeSheet.data[2][1], "Parent1Last, Parent1First", "Correct guardian name set for 123456");
    assert.equal(mockTentativeSheet.data[2][2], "parent1Email1@gmail.com", "Correct guardian email set for 123456");
    
    assert.equal(mockTentativeSheet.data[4][0], "student3Email@students.nisd.net", "Correct student email set for 345678");
    assert.equal(mockTentativeSheet.data[4][1], "Parent3Last, Parent3First", "Correct guardian name set for 345678");
    assert.equal(mockTentativeSheet.data[4][2], "parent3Email1@gmail.com", "Correct guardian email set for 345678");

    // Ensure no values were inserted for student "234567" (which is not in the tentative sheet)
    assert.equal(Object.keys(mockTentativeSheet.data).length, 3, "No additional data should be added for non-matching IDs");
  });
}


