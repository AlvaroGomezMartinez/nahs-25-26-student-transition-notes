/**
 * Diagnostic functions to investigate an issue with SHEET_NAMES.
 */

/**
 * Check what properties are actually in SHEET_NAMES and COLUMN_NAMES.
 */
function inspectConstants() {
  console.log("=== Constants Inspection ===");
  
  try {
    // Initialize system first
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    }
    
    console.log("=== SHEET_NAMES Properties ===");
    if (typeof SHEET_NAMES !== 'undefined') {
      console.log("SHEET_NAMES type:", typeof SHEET_NAMES);
      console.log("SHEET_NAMES is null?", SHEET_NAMES === null);
      
      if (SHEET_NAMES && typeof SHEET_NAMES === 'object') {
        const properties = Object.keys(SHEET_NAMES);
        console.log("Total properties:", properties.length);
        console.log("Properties:", properties);
        
        // Show first few property values
        properties.slice(0, 5).forEach(prop => {
          console.log(`  ${prop}: "${SHEET_NAMES[prop]}"`);
        });
        
        // Check for the specific property we're looking for
        console.log("Has TENTATIVE_VERSION2?", SHEET_NAMES.hasOwnProperty('TENTATIVE_VERSION2'));
        if (SHEET_NAMES.TENTATIVE_VERSION2) {
          console.log("TENTATIVE_VERSION2 value:", SHEET_NAMES.TENTATIVE_VERSION2);
        }
        
        // Check for other common sheet names
        const commonProps = ['TENTATIVE', 'REGISTRATIONS_SY_24_25', 'SCHEDULES', 'CONTACT_INFO'];
        commonProps.forEach(prop => {
          console.log(`Has ${prop}?`, SHEET_NAMES.hasOwnProperty(prop));
        });
      }
    } else {
      console.log("❌ SHEET_NAMES is undefined");
    }
    
    console.log("\n=== COLUMN_NAMES Properties ===");
    if (typeof COLUMN_NAMES !== 'undefined') {
      console.log("COLUMN_NAMES type:", typeof COLUMN_NAMES);
      
      if (COLUMN_NAMES && typeof COLUMN_NAMES === 'object') {
        const properties = Object.keys(COLUMN_NAMES);
        console.log("Total properties:", properties.length);
        console.log("Properties:", properties.slice(0, 10)); // Show first 10
        
        // Check for common column names
        const commonCols = ['STUDENT_ID', 'STUDENT_NAME', 'GRADE', 'SCHOOL'];
        commonCols.forEach(col => {
          console.log(`Has ${col}?`, COLUMN_NAMES.hasOwnProperty(col));
        });
      }
    } else {
      console.log("❌ COLUMN_NAMES is undefined");
    }
    
  } catch (error) {
    console.error("Error inspecting constants:", error);
    console.error("Stack:", error.stack);
  }
}

/**
 * Test creating a BaseDataLoader with detailed error reporting.
 */
function testBaseDataLoaderCreation() {
  console.log("=== BaseDataLoader Creation Test ===");
  
  try {
    // Initialize system
    if (typeof initializeNAHSSystem === 'function') {
      initializeNAHSSystem();
    }
    
    console.log("BaseDataLoader type:", typeof BaseDataLoader);
    console.log("BaseDataLoader is function?", typeof BaseDataLoader === 'function');
    
    if (typeof BaseDataLoader === 'function') {
      console.log("Attempting to create BaseDataLoader...");
      const testLoader = new BaseDataLoader("TestSheet");
      
      console.log("✅ BaseDataLoader created successfully");
      console.log("Instance type:", typeof testLoader);
      console.log("Is BaseDataLoader instance?", testLoader instanceof BaseDataLoader);
      
      // Check methods
      const methods = ['loadData', 'validateData', 'getSheetName'];
      methods.forEach(method => {
        console.log(`Has ${method} method?`, typeof testLoader[method] === 'function');
      });
      
    } else {
      console.log("❌ BaseDataLoader is not a function");
    }
    
  } catch (error) {
    console.error("❌ Error creating BaseDataLoader:", error.message);
    console.error("Stack:", error.stack);
  }
}

/**
 * Check all numbered files are loaded correctly.
 */
function checkNumberedFiles() {
  console.log("=== Numbered Files Check ===");
  
  try {
    // These should be available from the numbered files
    const expectedItems = [
      { name: 'BaseDataLoader', file: '01_baseDataLoader.js' },
      { name: 'BaseDataProcessor', file: '02_baseDataProcessor.js' }, 
      { name: 'SHEET_NAMES', file: '03_constants.js' },
      { name: 'COLUMN_NAMES', file: '03_constants.js' }
    ];
    
    expectedItems.forEach(item => {
      const available = typeof globalThis[item.name] !== 'undefined';
      console.log(`${available ? '✅' : '❌'} ${item.name} (from ${item.file}): ${available ? 'Available' : 'Missing'}`);
    });
    
    // Check bootstrap
    console.log(`${typeof initializeNAHSSystem === 'function' ? '✅' : '❌'} initializeNAHSSystem (from 00_bootstrap.js): ${typeof initializeNAHSSystem === 'function' ? 'Available' : 'Missing'}`);
    
  } catch (error) {
    console.error("Error checking numbered files:", error);
  }
}
