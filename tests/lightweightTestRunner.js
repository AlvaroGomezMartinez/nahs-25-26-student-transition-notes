/**
 * Lightweight console test runner for quick testing and debugging.
 * This version runs a smaller subset of tests to avoid timeout issues.
 */

/**
 * Run essential tests with console output (lighter version).
 * This focuses on core functionality without the heavy integration tests.
 */
function runEssentialTestsInConsole() {
  console.log("=== Running Essential NAHS Tests ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
      console.log("✅ System initialized successfully");
    } else {
      console.error("❌ Bootstrap system not available");
      return;
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    
    // Set up result logging
    QUnit.done(function(details) {
      console.log("\n=== ESSENTIAL TEST RESULTS SUMMARY ===");
      console.log(`Total: ${details.total}`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
      
      if (details.failed === 0) {
        console.log("🎉 All essential tests passed!");
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
    
    console.log("\n=== Registering Essential Test Modules ===");
    
    // Register core working tests
    if (typeof registerDateUtilTests === 'function') {
      registerDateUtilTests();
      console.log("✅ Date utility tests registered");
    }
    
    if (typeof registerBaseDataLoaderTests === 'function') {
      registerBaseDataLoaderTests();
      console.log("✅ Base data loader tests registered");
    }
    
    // Register newly fixed test modules
    if (typeof registerDataUtilTests === 'function') {
      registerDataUtilTests();
      console.log("✅ Data utility tests registered");
    }
    
    if (typeof registerValidationUtilTests === 'function') {
      registerValidationUtilTests();
      console.log("✅ Validation utility tests registered");
    }
    
    console.log("\n=== Running Essential Tests ===");
    
    // Start QUnit
    QUnit.start();
    
    console.log("Essential tests started... Results will appear above when complete.");
    
  } catch (error) {
    console.error("❌ Error running essential tests:", error);
    console.error("Stack trace:", error.stack);
  }
}

/**
 * Run tests with faster constants tests (optimized version).
 * This skips the time-consuming constants tests to avoid timeouts.
 */
function runFastTestsInConsole() {
  console.log("=== Running Fast NAHS Tests (No Constants) ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
      console.log("✅ System initialized successfully");
    } else {
      console.error("❌ Bootstrap system not available");
      return;
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    
    // Set up result logging
    QUnit.done(function(details) {
      console.log("\n=== FAST TEST RESULTS SUMMARY ===");
      console.log(`Total: ${details.total}`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
      
      if (details.failed === 0) {
        console.log("🎉 All fast tests passed!");
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
    
    console.log("\n=== Registering Fast Test Modules ===");
    
    // Register all available tests EXCEPT constants (which are slow)
    if (typeof registerDateUtilTests === 'function') {
      registerDateUtilTests();
      console.log("✅ Date utility tests registered");
    }
    
    if (typeof registerBaseDataLoaderTests === 'function') {
      registerBaseDataLoaderTests();
      console.log("✅ Base data loader tests registered");
    }
    
    if (typeof registerDataUtilTests === 'function') {
      registerDataUtilTests();
      console.log("✅ Data utility tests registered");
    }
    
    if (typeof registerValidationUtilTests === 'function') {
      registerValidationUtilTests();
      console.log("✅ Validation utility tests registered");
    }
    
    if (typeof registerDataLoaderTests === 'function') {
      registerDataLoaderTests();
      console.log("✅ Data loader tests registered");
    }
    
    if (typeof registerDataProcessorTests === 'function') {
      registerDataProcessorTests();
      console.log("✅ Data processor tests registered");
    }
    
    if (typeof registerWriterTests === 'function') {
      registerWriterTests();
      console.log("✅ Writer tests registered");
    }
    
    console.log("\n=== Running Fast Tests ===");
    
    // Start QUnit
    QUnit.start();
    
    console.log("Fast tests started... Results will appear above when complete.");
    
  } catch (error) {
    console.error("❌ Error running fast tests:", error);
    console.error("Stack trace:", error.stack);
  }
}
