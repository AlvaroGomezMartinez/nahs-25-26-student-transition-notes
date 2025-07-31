/**
 * Data Loaders Index
 * 
 * Centralizes all data loader exports for easy importing
 */

// Export all data loader classes
// Note: In Google Apps Script, we don't have traditional ES6 modules,
// but this file serves as documentation of available loaders

/**
 * Available Data Loader Classes:
 * 
 * - BaseDataLoader: Base class for all data loaders
 * - TentativeDataLoader: Loads TENTATIVE-Version2 sheet data
 * - RegistrationDataLoader: Loads registration data
 * - ScheduleDataLoader: Loads schedule data (filters active courses)
 * - ContactDataLoader: Loads contact information
 * - EntryWithdrawalDataLoader: Loads entry/withdrawal data
 * - FormResponsesDataLoader: Loads teacher form responses
 * - WithdrawnDataLoader: Loads withdrawn students data
 * - WDOtherDataLoader: Loads W/D Other students data
 * - AttendanceDataLoader: Loads attendance data
 */

/**
 * Available Public Functions (for backward compatibility):
 * 
 * - getStudentsFromTENTATIVESheet()
 * - loadRegistrationsData()
 * - schedulesSheet()
 * - loadContactData()
 * - loadEntryWithdrawalData()
 * - getStudentsFromFormResponses1Sheet()
 * - getWithdrawnStudentsSheet()
 * - getWDOtherSheet()
 * - loadStudentAttendanceData()
 */

/**
 * Factory function to create all data loaders
 * @returns {Object} Object containing all data loader instances
 */
function createAllDataLoaders() {
  return {
    tentative: new TentativeDataLoader(),
    registration: new RegistrationDataLoader(),
    schedule: new ScheduleDataLoader(),
    contact: new ContactDataLoader(),
    entryWithdrawal: new EntryWithdrawalDataLoader(),
    formResponses: new FormResponsesDataLoader(),
    withdrawn: new WithdrawnDataLoader(),
    wdOther: new WDOtherDataLoader(),
    attendance: new AttendanceDataLoader()
  };
}

/**
 * Loads all student data using the new loader structure
 * @returns {Object} Object containing all loaded data maps
 */
function loadAllStudentDataWithLoaders() {
  const loaders = createAllDataLoaders();
  
  return {
    tentativeData: loaders.tentative.loadData(),
    registrationsData: loaders.registration.loadData(),
    schedulesData: loaders.schedule.loadData(),
    contactData: loaders.contact.loadData(),
    entryWithdrawalData: loaders.entryWithdrawal.loadData(),
    formResponsesData: loaders.formResponses.loadData(),
    withdrawnData: loaders.withdrawn.loadData(),
    wdOtherData: loaders.wdOther.loadData(),
    attendanceData: loaders.attendance.loadData()
  };
}

/**
 * Debug version that loads data step by step for inspection
 */
function debugLoadAllStudentData() {
  console.log("=== Starting Debug Data Loading ===");
  
  const loaders = createAllDataLoaders();
  const results = {};
  
  // Load each data source individually with logging
  console.log("Loading tentative data...");
  results.tentativeData = loaders.tentative.loadData();
  debugger; // BREAKPOINT: Inspect tentativeData
  
  console.log("Loading registration data...");
  results.registrationsData = loaders.registration.loadData();
  debugger; // BREAKPOINT: Inspect registrationsData
  
  console.log("Loading schedule data...");
  results.schedulesData = loaders.schedule.loadData();
  debugger; // BREAKPOINT: Inspect schedulesData
  
  console.log("Loading contact data...");
  results.contactData = loaders.contact.loadData();
  debugger; // BREAKPOINT: Inspect contactData
  
  console.log("Loading entry/withdrawal data...");
  results.entryWithdrawalData = loaders.entryWithdrawal.loadData();
  debugger; // BREAKPOINT: Inspect entryWithdrawalData
  
  console.log("Loading form responses data...");
  results.formResponsesData = loaders.formResponses.loadData();
  debugger; // BREAKPOINT: Inspect formResponsesData
  
  console.log("Loading withdrawn data...");
  results.withdrawnData = loaders.withdrawn.loadData();
  debugger; // BREAKPOINT: Inspect withdrawnData
  
  console.log("Loading WD Other data...");
  results.wdOtherData = loaders.wdOther.loadData();
  debugger; // BREAKPOINT: Inspect wdOtherData
  
  console.log("Loading attendance data...");
  results.attendanceData = loaders.attendance.loadData();
  debugger; // BREAKPOINT: Inspect attendanceData
  
  console.log("=== All Data Loaded ===");
  debugger; // BREAKPOINT: Inspect complete results object
  
  return results;
}

/**
 * Debug function to trace the source of unexpected registration data
 */
function debugUnexpectedRegistrationData() {
  console.log('=== Debugging Unexpected Registration Data ===');
  console.log('');
  
  console.log('Configuration Check:');
  console.log('SHEET_NAMES.REGISTRATIONS:', SHEET_NAMES.REGISTRATIONS);
  console.log('EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE:', EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
  console.log('SHEET_LOCATIONS[REGISTRATIONS]:', SHEET_LOCATIONS[SHEET_NAMES.REGISTRATIONS]);
  console.log('');
  
  // Test the actual external sheet
  console.log('Checking External Sheet Content:');
  try {
    const regSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
    console.log('✅ External spreadsheet opened successfully');
    
    const regSheet = regSpreadsheet.getSheetByName(SHEET_NAMES.REGISTRATIONS);
    if (regSheet) {
      console.log('✅ Found sheet:', SHEET_NAMES.REGISTRATIONS);
      
      const data = regSheet.getDataRange().getValues();
      console.log(`Raw data rows: ${data.length}`);
      
      if (data.length > 0) {
        console.log('Headers:', data[0].join(' | '));
      }
      
      if (data.length > 1) {
        console.log('Data rows found:');
        for (let i = 1; i < Math.min(data.length, 5); i++) {
          console.log(`Row ${i}:`, data[i].join(' | '));
        }
      } else {
        console.log('No data rows found (only headers or completely empty)');
      }
    } else {
      console.log('❌ Sheet not found:', SHEET_NAMES.REGISTRATIONS);
    }
  } catch (error) {
    console.log('❌ Error accessing external sheet:', error.message);
  }
  
  console.log('');
  
  // Now test what the RegistrationDataLoader actually returns
  console.log('Testing RegistrationDataLoader Output:');
  try {
    const regLoader = new RegistrationDataLoader();
    const regData = regLoader.loadData();
    
    console.log(`RegistrationDataLoader returned: ${regData.size} entries`);
    
    if (regData.size > 0) {
      console.log('');
      console.log('Unexpected data entries:');
      let count = 0;
      for (const [studentId, records] of regData) {
        console.log(`Entry ${++count}:`);
        console.log(`  Student ID: ${studentId}`);
        console.log(`  Records: ${records.length}`);
        
        if (records.length > 0) {
          const record = records[0];
          console.log(`  Sample record keys:`, Object.keys(record).join(', '));
          console.log(`  Student Name: ${record['Student First Name']} ${record['Student Last Name']}`);
          console.log(`  All data:`, JSON.stringify(record, null, 2));
        }
        console.log('  ---');
        
        if (count >= 3) break;
      }
    }
  } catch (error) {
    console.log('❌ RegistrationDataLoader error:', error.message);
  }
  
  console.log('');
  
  // Check if there might be another sheet with similar name
  console.log('Checking for Similar Sheet Names:');
  try {
    const regSpreadsheet = SpreadsheetApp.openById(EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
    const allSheets = regSpreadsheet.getSheets().map(s => s.getName());
    console.log('All sheets in external spreadsheet:');
    allSheets.forEach((sheetName, index) => {
      console.log(`  ${index + 1}. "${sheetName}"`);
      if (sheetName.toLowerCase().includes('form') || 
          sheetName.toLowerCase().includes('response') ||
          sheetName.toLowerCase().includes('registration')) {
        console.log(`    ⚠️ This sheet might contain registration data`);
      }
    });
  } catch (error) {
    console.log('❌ Error checking sheet names:', error.message);
  }
  
  console.log('');
  console.log('=== Debug Complete ===');
}

/**
 * Check if data is being cached or coming from a fallback source
 */
function debugDataSourceFallback() {
  console.log('=== Checking for Data Source Fallback ===');
  console.log('');
  
  // Check if there's a local sheet with the same name
  console.log('Checking Local Sheets:');
  try {
    const localSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.REGISTRATIONS);
    if (localSheet) {
      console.log('⚠️ Found LOCAL sheet with same name:', SHEET_NAMES.REGISTRATIONS);
      const localData = localSheet.getDataRange().getValues();
      console.log(`Local sheet has ${localData.length} rows`);
      
      if (localData.length > 1) {
        console.log('Local sheet data preview:');
        for (let i = 1; i < Math.min(localData.length, 3); i++) {
          console.log(`  Row ${i}:`, localData[i].join(' | '));
        }
        console.log('❗ This might be where your unexpected data is coming from!');
      }
    } else {
      console.log('✅ No local sheet found with name:', SHEET_NAMES.REGISTRATIONS);
    }
  } catch (error) {
    console.log('Error checking local sheets:', error.message);
  }
  
  console.log('');
  
  // Check the BaseDataLoader implementation to see if it has fallback logic
  console.log('Checking BaseDataLoader behavior:');
  try {
    const regLoader = new RegistrationDataLoader();
    
    // Check what sheet it's actually using
    console.log('Loader sheet location config:', SHEET_LOCATIONS[SHEET_NAMES.REGISTRATIONS]);
    
    // Try to trace the getSheet() method behavior
    console.log('Testing getSheet() method...');
    const sheet = regLoader.getSheet();
    if (sheet) {
      console.log('Sheet name returned by getSheet():', sheet.getName());
      console.log('Sheet parent spreadsheet ID:', sheet.getParent().getId());
      console.log('Is this the expected external spreadsheet?', 
                  sheet.getParent().getId() === EXTERNAL_SPREADSHEETS.REGISTRATIONS_SOURCE);
    }
  } catch (error) {
    console.log('Error testing BaseDataLoader:', error.message);
  }
  
  console.log('');
  console.log('=== Fallback Check Complete ===');
}

