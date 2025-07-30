/**
 * Diagnostic function to test the formatDateToMMDDYYYY function directly.
 */
function debugFormatDateToMMDDYYYY() {
  console.log("=== Debug formatDateToMMDDYYYY Function ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    }
    
    // Check if function is available
    console.log("formatDateToMMDDYYYY available?", typeof formatDateToMMDDYYYY === 'function');
    
    if (typeof formatDateToMMDDYYYY !== 'function') {
      console.error("❌ formatDateToMMDDYYYY function not found");
      return;
    }
    
    // Test cases that might be failing
    const testCases = [
      {
        name: "Date object test",
        input: new Date(2024, 11, 10), // December 10, 2024
        expected: "12/10/2024"
      },
      {
        name: "Date string test", 
        input: "2024-03-15",
        expected: "03/15/2024"
      },
      {
        name: "New Year test",
        input: new Date(2025, 0, 1), // January 1, 2025
        expected: "01/01/2025"
      },
      {
        name: "Invalid date test",
        input: "invalid date",
        expected: null
      }
    ];
    
    testCases.forEach((testCase, index) => {
      try {
        console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`);
        console.log("Input:", testCase.input);
        console.log("Input type:", typeof testCase.input);
        
        if (testCase.input instanceof Date) {
          console.log("Input is valid Date?", !isNaN(testCase.input.getTime()));
          console.log("Input details:", {
            year: testCase.input.getFullYear(),
            month: testCase.input.getMonth(),
            date: testCase.input.getDate()
          });
        }
        
        const result = formatDateToMMDDYYYY(testCase.input);
        console.log("Result:", result);
        console.log("Result type:", typeof result);
        console.log("Expected:", testCase.expected);
        console.log("Match?", result === testCase.expected);
        
        if (result !== testCase.expected) {
          console.log("❌ MISMATCH FOUND!");
          if (typeof result === 'string' && typeof testCase.expected === 'string') {
            console.log("Character comparison:");
            for (let i = 0; i < Math.max(result.length, testCase.expected.length); i++) {
              const resultChar = result[i] || 'undefined';
              const expectedChar = testCase.expected[i] || 'undefined';
              if (resultChar !== expectedChar) {
                console.log(`  Position ${i}: got '${resultChar}', expected '${expectedChar}'`);
              }
            }
          }
        } else {
          console.log("✅ Match!");
        }
        
      } catch (error) {
        console.error(`❌ Error in test case ${index + 1}:`, error.message);
      }
    });
    
  } catch (error) {
    console.error("❌ Error in debug function:", error);
  }
}
