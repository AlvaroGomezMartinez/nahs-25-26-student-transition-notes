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
