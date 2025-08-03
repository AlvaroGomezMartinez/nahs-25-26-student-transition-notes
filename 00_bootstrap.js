/**
 * @fileoverview Bootstrap file for the NAHS system.
 * 
 * This file ensures that all base classes and dependencies are loaded before
 * other files try to use them. In Google Apps Script, files are loaded
 * alphabetically, so we use "00_" prefix to ensure this loads first.
 * 
 * The actual base classes are in:
 * - 01_baseDataLoader.js
 * - 02_baseDataProcessor.js  
 * - 03_constants.js
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * Global flag to indicate the system has been initialized.
 * This can be used by other files to check if dependencies are ready.
 */
var NAHS_SYSTEM_INITIALIZED = false;

/**
 * Initialization function that ensures all dependencies are loaded.
 * Call this before running any system functions.
 */
function initializeNAHSSystem() {
  console.log('Initializing NAHS Student Transition Notes System...');
  
  // Verify that key classes are available
  try {
    // Test that base classes exist
    if (typeof BaseDataLoader === 'undefined') {
      console.error('BaseDataLoader not loaded. Check that 01_baseDataLoader.js is included in the project.');
      throw new Error('BaseDataLoader not loaded');
    }
    
    if (typeof BaseDataProcessor === 'undefined') {
      console.warn('BaseDataProcessor not loaded. Check that 02_baseDataProcessor.js is included in the project.');
    }
    
    if (typeof SHEET_NAMES === 'undefined') {
      console.error('SHEET_NAMES constants not loaded. Check that 03_constants.js is included in the project.');
      throw new Error('Constants not loaded');
    }
    
    NAHS_SYSTEM_INITIALIZED = true;
    console.log('NAHS System initialized successfully');
    console.log('Available base classes:', {
      BaseDataLoader: typeof BaseDataLoader !== 'undefined',
      BaseDataProcessor: typeof BaseDataProcessor !== 'undefined',
      SHEET_NAMES: typeof SHEET_NAMES !== 'undefined',
      COLUMN_NAMES: typeof COLUMN_NAMES !== 'undefined'
    });
    
  } catch (error) {
    console.error('NAHS System initialization failed:', error);
    console.error('Make sure these files are included in your Google Apps Script project:');
    console.error('- 01_baseDataLoader.js');
    console.error('- 02_baseDataProcessor.js');
    console.error('- 03_constants.js');
    throw error;
  }
}

/**
 * Utility function to ensure system is initialized before running functions.
 * @param {Function} fn - Function to run after initialization
 * @returns {*} Result of the function
 */
function withSystemInitialization(fn) {
  if (!NAHS_SYSTEM_INITIALIZED) {
    initializeNAHSSystem();
  }
  return fn();
}
