/**
 * Console-based test runner for Google Apps Script editor.
 * This displays test results directly in the execution log instead of HTML.
 */

/**
 * Run tests and display results in the console/execution log.
 * This is better for running tests directly in the GAS editor.
 */
function runTestsInConsole() {
  console.log("=== Starting NAHS Test Suite ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
      console.log("✅ System initialized successfully");
    } else {
      console.error("❌ Bootstrap system not available");
      return;
    }
    
    // Initialize QUnit but don't use HTML output
    QUnitGS2.init();
    
    // Custom test result tracking
    let testResults = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      warnings: []
    };
    
    // Override QUnit's done callback to log results
    QUnit.done(function(details) {
      console.log("\n=== TEST RESULTS SUMMARY ===");
      console.log(`Total: ${details.total}`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
      
      if (details.failed === 0) {
        console.log("🎉 All tests passed!");
      } else {
        console.log(`⚠️ ${details.failed} test(s) failed`);
      }
    });
    
    // Override test callbacks to log individual results
    QUnit.testDone(function(details) {
      const status = details.failed === 0 ? "✅" : "❌";
      const moduleName = details.module || "Unknown";
      console.log(`${status} ${moduleName}: ${details.name} (${details.runtime}ms)`);
      
      if (details.failed > 0) {
        console.log(`   Failed assertions: ${details.failed}/${details.total}`);
      }
    });
    
    // Register available tests
    console.log("\n=== Registering Test Modules ===");
    
    if (typeof registerConstantTests === 'function') {
      registerConstantTests();
      console.log("✅ Constants tests registered");
    } else {
      console.log("⚠️ Constants tests not available");
      testResults.warnings.push("Constants tests not available");
    }
    
    if (typeof registerDateUtilTests === 'function') {
      registerDateUtilTests();
      console.log("✅ Date utility tests registered");
    } else {
      console.log("⚠️ Date utility tests not available");
      testResults.warnings.push("Date utility tests not available");
    }
    
    if (typeof registerBaseDataLoaderTests === 'function') {
      registerBaseDataLoaderTests();
      console.log("✅ Base data loader tests registered");
    } else {
      console.log("⚠️ Base data loader tests not available");
      testResults.warnings.push("Base data loader tests not available");
    }
    
    if (typeof registerIntegrationTests === 'function') {
      registerIntegrationTests();
      console.log("✅ Integration tests registered");
    } else {
      console.log("⚠️ Integration tests not available");
      testResults.warnings.push("Integration tests not available");
    }
    
    // Check for other test modules
    const otherTestModules = [
      'registerDataUtilTests',
      'registerValidationUtilTests', 
      'registerDataLoaderTests',
      'registerDataProcessorTests',
      'registerWriterTests'
    ];
    
    otherTestModules.forEach(moduleName => {
      if (typeof this[moduleName] === 'function') {
        this[moduleName]();
        console.log(`✅ ${moduleName} registered`);
      } else {
        console.log(`⚠️ ${moduleName} not available`);
        testResults.warnings.push(`${moduleName} not available`);
      }
    });
    
    console.log("\n=== Running Tests ===");
    
    // Start QUnit
    QUnit.start();
    
    // Note: QUnit runs asynchronously, so results will appear after this function completes
    console.log("Tests started... Results will appear above when complete.");
    
  } catch (error) {
    console.error("❌ Error running tests:", error);
    console.error("Stack trace:", error.stack);
  }
}

/**
 * Run just a quick verification to see if the system is working.
 * This gives immediate feedback in the console.
 */
function quickSystemCheck() {
  console.log("=== Quick System Check ===");
  
  try {
    // Initialize system
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
      console.log("✅ System initialization: SUCCESS");
    } else {
      console.log("❌ System initialization: FAILED - initializeNAHSSystem not found");
      return;
    }
    
    // Check dependencies
    const dependencies = [
      { name: 'BaseDataLoader', check: () => typeof BaseDataLoader !== 'undefined' },
      { name: 'BaseDataProcessor', check: () => typeof BaseDataProcessor !== 'undefined' },
      { name: 'SHEET_NAMES', check: () => typeof SHEET_NAMES !== 'undefined' },
      { name: 'COLUMN_NAMES', check: () => typeof COLUMN_NAMES !== 'undefined' }
    ];
    
    let allPassed = true;
    dependencies.forEach(dep => {
      try {
        if (dep.check()) {
          console.log(`✅ ${dep.name}: Available`);
        } else {
          console.log(`❌ ${dep.name}: Not available`);
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ ${dep.name}: Error checking - ${error.message}`);
        allPassed = false;
      }
    });
    
    // Test class instantiation
    try {
      const testLoader = new BaseDataLoader("TestSheet");
      console.log("✅ BaseDataLoader instantiation: SUCCESS");
    } catch (error) {
      console.log(`❌ BaseDataLoader instantiation: FAILED - ${error.message}`);
      allPassed = false;
    }
    
    // Check constants content
    try {
      // Check for actual property names (TENTATIVE_V2, not TENTATIVE_VERSION2)
      if (SHEET_NAMES.TENTATIVE_V2 && SHEET_NAMES.TENTATIVE && COLUMN_NAMES.STUDENT_ID) {
        console.log("✅ SHEET_NAMES content: Available");
        console.log(`   Key sheets: TENTATIVE_V2="${SHEET_NAMES.TENTATIVE_V2}", TENTATIVE="${SHEET_NAMES.TENTATIVE}"`);
        console.log(`   Key columns: STUDENT_ID="${COLUMN_NAMES.STUDENT_ID}"`);
      } else {
        console.log("❌ SHEET_NAMES content: Missing expected properties");
        console.log(`   TENTATIVE_V2: ${SHEET_NAMES.TENTATIVE_V2 ? 'Found' : 'Missing'}`);
        console.log(`   TENTATIVE: ${SHEET_NAMES.TENTATIVE ? 'Found' : 'Missing'}`);
        console.log(`   STUDENT_ID: ${COLUMN_NAMES.STUDENT_ID ? 'Found' : 'Missing'}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ SHEET_NAMES content: Error - ${error.message}`);
      allPassed = false;
    }
    
    // Summary
    if (allPassed) {
      console.log("\n🎉 SYSTEM CHECK PASSED - All dependencies are working correctly!");
      console.log("You can now run runTestsInConsole() for full test suite.");
    } else {
      console.log("\n⚠️ SYSTEM CHECK FAILED - Some dependencies are missing or broken.");
    }
    
  } catch (error) {
    console.error("❌ System check error:", error);
  }
}

/**
 * Run tests for a specific module only.
 * @param {string} moduleName - Name of the test module to run
 */
function runSingleTestModule(moduleName) {
  console.log(`=== Running ${moduleName} Tests Only ===`);
  
  try {
    // Initialize system
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    } else {
      console.error("Bootstrap system not available");
      return;
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    
    // Set up result logging
    QUnit.done(function(details) {
      console.log(`\n=== ${moduleName} Results ===`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
    });
    
    QUnit.testDone(function(details) {
      const status = details.failed === 0 ? "✅" : "❌";
      console.log(`${status} ${details.name}`);
    });
    
    // Run the specific test module
    const moduleFunction = `register${moduleName}Tests`;
    if (typeof this[moduleFunction] === 'function') {
      this[moduleFunction]();
      console.log(`${moduleName} tests registered successfully`);
    } else {
      console.error(`Test module ${moduleFunction} not found`);
      return;
    }
    
    QUnit.start();
    
  } catch (error) {
    console.error(`Error running ${moduleName} tests:`, error);
  }
}
