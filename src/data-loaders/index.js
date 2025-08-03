/**
 * @fileoverview Data Loaders Index and Factory for the NAHS system.
 * 
 * This module serves as the central registry and factory for all data loader
 * classes in the NAHS system. It provides documentation of available loaders,
 * factory methods for creating loader instances, and utilities for coordinated
 * data loading operations across multiple sources.
 * 
 * In Google Apps Script environments, this file serves as both documentation
 * and a centralized access point for all data loading functionality.
 * 
 * @author NAHS Development Team
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataLoaders
 */

/**
 * Registry of available Data Loader Classes in the NAHS system.
 * 
 * This documentation serves as a reference for all available data loaders,
 * their purposes, and their usage patterns. Each loader extends BaseDataLoader
 * and provides specialized functionality for specific data sources.
 * 
 * **Available Data Loader Classes:**
 * - **BaseDataLoader**: Abstract base class for all data loaders
 * - **TentativeDataLoader**: Loads TENTATIVE-Version2 sheet data (primary source)
 * - **RegistrationDataLoader**: Loads registration data from external sources
 * - **ScheduleDataLoader**: Loads schedule data with active course filtering
 * - **ContactDataLoader**: Loads student and family contact information
 * - **EntryWithdrawalDataLoader**: Loads official entry/withdrawal records
 * - **FormResponsesDataLoader**: Loads teacher form responses with email mapping
 * - **WithdrawnDataLoader**: Loads withdrawn students tracking data
 * - **WDOtherDataLoader**: Loads W/D Other category students data
 * - **AttendanceDataLoader**: Loads attendance data from external sources
 * 
 * @namespace DataLoaderRegistry
 * @memberof DataLoaders
 * 
 * @example
 * // Create specific loader instances
 * const tentativeLoader = new TentativeDataLoader();
 * const scheduleLoader = new ScheduleDataLoader();
 * const contactLoader = new ContactDataLoader();
 * 
 * @example
 * // Use factory methods for coordinated loading
 * const allLoaders = createAllDataLoaders();
 * const allData = loadAllStudentDataWithLoaders(allLoaders);
 * 
 * @since 2.0.0
 */

/**
 * Backward Compatibility Functions Registry.
 * 
 * These functions maintain compatibility with existing code that calls
 * the original function-based data loading approach. New code should
 * use the class-based loaders directly for better error handling.
 * 
 * **Available Public Functions (for backward compatibility):**
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
 * Debugging function that loads data step by step for inspection.
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
