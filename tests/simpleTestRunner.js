/**
 * Simple test runner for individual test modules.
 * Use this to run specific tests from the Google Apps Script console.
 */

/**
 * Run just the constants tests to verify basic functionality.
 * Call this function directly in Google Apps Script console.
 */
function runConstantsTestOnly() {
  console.log("=== Running Constants Test Only ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    } else {
      throw new Error('Bootstrap system not available');
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    QUnit.config.hidepassed = false;
    QUnit.config.reorder = false;
    
    // Register and run only constants tests
    if (typeof registerConstantTests === 'function') {
      registerConstantTests();
      console.log("Constants tests registered successfully");
    } else {
      throw new Error('registerConstantTests function not found');
    }
    
    // Start QUnit
    QUnit.start();
    
    console.log("=== Constants Test Complete ===");
    return QUnitGS2.getHtml();
    
  } catch (error) {
    console.error("Error running constants test:", error);
    return `<html><body><h1>Test Error</h1><p>${error.message}</p></body></html>`;
  }
}

/**
 * Run a quick system verification test.
 * This creates a minimal test to verify that our key dependencies are working.
 */
function runSystemVerificationTest() {
  console.log("=== Running System Verification Test ===");
  
  try {
    // Initialize system
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    } else {
      throw new Error('Bootstrap system not available');
    }
    
    // Initialize QUnit
    QUnitGS2.init();
    QUnit.config.hidepassed = false;
    
    // Create a simple verification test
    QUnit.module("System Verification", function() {
      QUnit.test("System Dependencies Available", function(assert) {
        assert.ok(typeof BaseDataLoader !== 'undefined', "BaseDataLoader should be available");
        assert.ok(typeof BaseDataProcessor !== 'undefined', "BaseDataProcessor should be available");
        assert.ok(typeof SHEET_NAMES !== 'undefined', "SHEET_NAMES should be available");
        assert.ok(typeof COLUMN_NAMES !== 'undefined', "COLUMN_NAMES should be available");
        
        // Test that BaseDataLoader can be instantiated
        try {
          const testLoader = new BaseDataLoader("TestSheet");
          assert.ok(testLoader instanceof BaseDataLoader, "Should be able to create BaseDataLoader instance");
        } catch (e) {
          assert.ok(false, `Failed to create BaseDataLoader: ${e.message}`);
        }
        
        // Test that constants have expected properties
        assert.ok(SHEET_NAMES.TENTATIVE_VERSION2, "SHEET_NAMES should have TENTATIVE_VERSION2");
        assert.ok(COLUMN_NAMES.STUDENT_ID, "COLUMN_NAMES should have STUDENT_ID");
      });
      
      QUnit.test("Bootstrap System Working", function(assert) {
        assert.ok(typeof initializeNAHSSystem === 'function', "initializeNAHSSystem should be available");
        
        // Test that we can call initialization without errors
        try {
          initializeNAHSSystem();
          assert.ok(true, "initializeNAHSSystem runs without errors");
        } catch (e) {
          assert.ok(false, `initializeNAHSSystem failed: ${e.message}`);
        }
      });
    });
    
    // Start QUnit
    QUnit.start();
    
    console.log("=== System Verification Complete ===");
    return QUnitGS2.getHtml();
    
  } catch (error) {
    console.error("Error running system verification:", error);
    return `<html><body><h1>Verification Error</h1><p>${error.message}</p></body></html>`;
  }
}
