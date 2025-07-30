/**
 * Individual test runners for debugging specific modules.
 * These functions run one test module at a time for clearer output.
 */

/**
 * Run only the date utility tests.
 */
function runDateUtilTestsOnly() {
  console.log("=== Date Utility Tests Only ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    
    // Set up result logging
    QUnit.done(function(details) {
      console.log("\n=== Date Utility Test Results ===");
      console.log(`Total: ${details.total}`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
    });
    
    QUnit.testDone(function(details) {
      const status = details.failed === 0 ? "✅" : "❌";
      console.log(`${status} ${details.name} (${details.runtime}ms)`);
      if (details.failed > 0) {
        console.log(`   Failed: ${details.failed}/${details.total} assertions`);
      }
    });
    
    // Register and run date utility tests
    if (typeof registerDateUtilTests === 'function') {
      registerDateUtilTests();
      console.log("Date utility tests registered");
    } else {
      console.error("registerDateUtilTests not found");
      return;
    }
    
    QUnit.start();
    
  } catch (error) {
    console.error("Error running date utility tests:", error);
  }
}

/**
 * Run only the base data loader tests.
 */
function runBaseDataLoaderTestsOnly() {
  console.log("=== Base Data Loader Tests Only ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    
    // Set up result logging
    QUnit.done(function(details) {
      console.log("\n=== Base Data Loader Test Results ===");
      console.log(`Total: ${details.total}`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
    });
    
    QUnit.testDone(function(details) {
      const status = details.failed === 0 ? "✅" : "❌";
      console.log(`${status} ${details.name} (${details.runtime}ms)`);
      if (details.failed > 0) {
        console.log(`   Failed: ${details.failed}/${details.total} assertions`);
      }
    });
    
    // Register and run base data loader tests
    if (typeof registerBaseDataLoaderTests === 'function') {
      registerBaseDataLoaderTests();
      console.log("Base data loader tests registered");
    } else {
      console.error("registerBaseDataLoaderTests not found");
      return;
    }
    
    QUnit.start();
    
  } catch (error) {
    console.error("Error running base data loader tests:", error);
  }
}

/**
 * Run only the integration tests.
 */
function runIntegrationTestsOnly() {
  console.log("=== Integration Tests Only ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    
    // Set up result logging
    QUnit.done(function(details) {
      console.log("\n=== Integration Test Results ===");
      console.log(`Total: ${details.total}`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
    });
    
    QUnit.testDone(function(details) {
      const status = details.failed === 0 ? "✅" : "❌";
      console.log(`${status} ${details.name} (${details.runtime}ms)`);
      if (details.failed > 0) {
        console.log(`   Failed: ${details.failed}/${details.total} assertions`);
      }
    });
    
    // Register and run integration tests
    if (typeof registerIntegrationTests === 'function') {
      registerIntegrationTests();
      console.log("Integration tests registered");
    } else {
      console.error("registerIntegrationTests not found");
      return;
    }
    
    QUnit.start();
    
  } catch (error) {
    console.error("Error running integration tests:", error);
  }
}

/**
 * Run only the constants tests (for comparison).
 */
function runConstantsTestsOnly() {
  console.log("=== Constants Tests Only ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    
    // Set up result logging
    QUnit.done(function(details) {
      console.log("\n=== Constants Test Results ===");
      console.log(`Total: ${details.total}`);
      console.log(`Passed: ${details.passed} ✅`);
      console.log(`Failed: ${details.failed} ${details.failed > 0 ? '❌' : ''}`);
      console.log(`Runtime: ${details.runtime}ms`);
    });
    
    QUnit.testDone(function(details) {
      const status = details.failed === 0 ? "✅" : "❌";
      console.log(`${status} ${details.name} (${details.runtime}ms)`);
      if (details.failed > 0) {
        console.log(`   Failed: ${details.failed}/${details.total} assertions`);
      }
    });
    
    // Register and run constants tests
    if (typeof registerConstantTests === 'function') {
      registerConstantTests();
      console.log("Constants tests registered");
    } else {
      console.error("registerConstantTests not found");
      return;
    }
    
    QUnit.start();
    
  } catch (error) {
    console.error("Error running constants tests:", error);
  }
}
