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

