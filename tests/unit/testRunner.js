/**
 * Main test runner for the NAHS Student Transition Notes system.
 * Uses QUnitGS2 for Google Apps Script unit testing.
 */

var QUnit = QUnitGS2.QUnit;

/**
 * Main entry point for running all unit tests.
 * This function initializes QUnit and runs all test suites.
 * 
 * @returns {HtmlOutput} The test results page
 */
function doGet() {
  console.log("=== Initializing NAHS Unit Test Suite ===");
  
  try {
    // First, initialize the NAHS system to ensure dependencies are loaded
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    } else {
      console.error('Bootstrap system not available. Make sure 00_bootstrap.js is included.');
    }
    
    // Initialize QUnitGS2
    QUnitGS2.init();
    
    // Configure QUnit settings
    QUnit.config.hidepassed = false; // Show passed tests
    QUnit.config.reorder = false;    // Run tests in order
    
    // Register all test modules
    registerAllTests();
    
    // Start the test runner
    QUnit.start();
    
    console.log("=== Test Suite Initialization Complete ===");
    return QUnitGS2.getHtml();
    
  } catch (error) {
    console.error("Error initializing test suite:", error);
    throw error;
  }
}

/**
 * Registers all test modules with QUnit.
 * This function should be called to set up all available tests.
 */
function registerAllTests() {
  try {
    // Register configuration tests
    if (typeof registerConstantTests === 'function') {
      registerConstantTests();
    } else {
      console.warn('Configuration tests not available');
    }
    
    // Register utility tests
    if (typeof registerDateUtilTests === 'function') {
      registerDateUtilTests();
    } else {
      console.warn('Date utility tests not available');
    }
    
    if (typeof registerDataUtilTests === 'function') {
      registerDataUtilTests();
    } else {
      console.warn('Data utility tests not available');
    }
    
    if (typeof registerValidationUtilTests === 'function') {
      registerValidationUtilTests();
    } else {
      console.warn('Validation utility tests not available');
    }
    
    // Register data loader tests
    if (typeof registerBaseDataLoaderTests === 'function') {
      registerBaseDataLoaderTests();
    } else {
      console.warn('Base data loader tests not available');
    }
    
    if (typeof registerDataLoaderTests === 'function') {
      registerDataLoaderTests();
    } else {
      console.warn('Data loader tests not available');
    }
    
    // Register data processor tests
    if (typeof registerDataProcessorTests === 'function') {
      registerDataProcessorTests();
    } else {
      console.warn('Data processor tests not available');
    }
    
    // Register writer tests
    if (typeof registerWriterTests === 'function') {
      registerWriterTests();
    } else {
      console.warn('Writer tests not available');
    }
    
    // Register integration tests
    if (typeof registerIntegrationTests === 'function') {
      registerIntegrationTests();
    } else {
      console.warn('Integration tests not available');
    }
    
    console.log('All available tests registered successfully');
    
  } catch (error) {
    console.error('Error registering tests:', error);
  }
}

/**
 * Runs only a specific test module. Useful for debugging.
 * @param {string} testModuleName - Name of the test function to run
 */
function runSingleTest(testModuleName) {
  console.log(`Running single test: ${testModuleName}`);
  
  QUnitGS2.init();
  QUnit.config.hidepassed = false;
  
  // Run the specified test
  if (typeof this[testModuleName] === 'function') {
    this[testModuleName]();
  } else {
    throw new Error(`Test module '${testModuleName}' not found`);
  }
  
  QUnit.start();
  return QUnitGS2.getHtml();
}

/**
 * Runs tests for a specific category.
 * @param {string} category - The test category to run ('utils', 'loaders', 'processors', 'writers', 'integration', 'all')
 */
function runTestCategory(category = 'all') {
  console.log(`Running tests for category: ${category}`);
  
  const categoryTests = {
    'config': ['Constants Tests'],
    'utils': ['Date Utils Tests', 'Data Utils Tests', 'Validation Utils Tests'],
    'loaders': ['Base Data Loader Tests', 'Data Loader Tests'],
    'processors': ['Data Processor Tests'],
    'writers': ['Writer Tests'],
    'integration': ['Integration Tests'],
    'all': null // null means run all tests
  };
  
  if (category !== 'all' && !categoryTests[category]) {
    console.error(`Unknown test category: ${category}`);
    return;
  }
  
  if (category === 'all') {
    QUnit.start();
  } else {
    // Filter tests to run only the specified category
    const testsToRun = categoryTests[category];
    if (testsToRun) {
      testsToRun.forEach(testName => {
        console.log(`Looking for test: ${testName}`);
      });
    }
    QUnit.start();
  }
}

/**
 * Gets test statistics and results summary.
 * Call this after tests have completed.
 */
function getTestSummary() {
  const details = QUnit.config.stats || {};
  
  return {
    total: details.total || 0,
    passed: details.passed || 0,
    failed: details.failed || 0,
    skipped: details.skipped || 0,
    todo: details.todo || 0,
    runtime: details.runtime || 0,
    timestamp: new Date().toISOString()
  };
}
