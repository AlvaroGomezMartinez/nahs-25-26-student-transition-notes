/**
 * Student Data Merger Processor
 * 
 * Handles the complex process of merging data from multiple sources
 * into a single student data map. This replaces the multiple nested
 * map operations from the original loadTENTATIVEVersion2 function.
 */

class StudentDataMerger extends BaseDataProcessor {
  constructor() {
    super('StudentDataMerger');
  }

  /**
   * Merges all student data from multiple sources
   * @param {Object} dataSources - Object containing all data source maps
   * @returns {Map} Merged student data map
   */
  process(dataSources) {
    this.log('Starting student data merge process...');

    // Validate input data sources
    if (!this.validateDataSources(dataSources)) {
      return new Map();
    }

    // Start with base data (tentative or entry/withdrawal)
    let mergedData = this.createBaseStudentMap(dataSources);

    // Merge each data source sequentially
    mergedData = this.mergeRegistrationData(mergedData, dataSources.registrationsData);
    mergedData = this.mergeContactData(mergedData, dataSources.contactData);
    mergedData = this.mergeScheduleData(mergedData, dataSources.schedulesData);
    mergedData = this.mergeAttendanceData(mergedData, dataSources.attendanceData);
    mergedData = this.mergeFormResponsesData(mergedData, dataSources.formResponsesData);
    mergedData = this.mergeEntryWithdrawalData(mergedData, dataSources.entryWithdrawalData);

    this.log(`Merge complete. Total students: ${mergedData.size}`);
    return mergedData;
  }

  /**
   * Validates that all required data sources are present
   * @param {Object} dataSources - Data sources object
   * @returns {boolean} True if valid, false otherwise
   */
  validateDataSources(dataSources) {
    const requiredSources = [
      'tentativeData', 'registrationsData', 'contactData', 
      'schedulesData', 'attendanceData', 'formResponsesData', 
      'entryWithdrawalData'
    ];

    for (const source of requiredSources) {
      if (!dataSources[source]) {
        this.log(`Missing required data source: ${source}`, 'error');
        return false;
      }
    }

    return true;
  }

  /**
   * Creates the base student map from tentative data
   * @param {Object} dataSources - All data sources
   * @returns {Map} Base student map
   */
  createBaseStudentMap(dataSources) {
    this.log('Creating base student map from tentative data...');
    
    const baseMap = new Map();
    
    if (dataSources.tentativeData && dataSources.tentativeData.size > 0) {
      dataSources.tentativeData.forEach((studentArray, studentId) => {
        baseMap.set(studentId, {
          TENTATIVE: studentArray
        });
      });
    } else {
      this.log('No tentative data available, using empty base map', 'warn');
    }

    return baseMap;
  }

  /**
   * Merges registration data with existing student data
   * @param {Map} existingData - Existing student data map
   * @param {Map} registrationData - Registration data map
   * @returns {Map} Updated student data map
   */
  mergeRegistrationData(existingData, registrationData) {
    this.log('Merging registration data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const registrationInfo = this.safeMapGet(registrationData, studentId);
      
      updatedMap.set(studentId, {
        ...studentData,
        Registrations_SY_24_25: registrationInfo
      });
    });

    return updatedMap;
  }

  /**
   * Merges contact data with existing student data
   * @param {Map} existingData - Existing student data map
   * @param {Map} contactData - Contact data map
   * @returns {Map} Updated student data map
   */
  mergeContactData(existingData, contactData) {
    this.log('Merging contact data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const contactInfo = this.safeMapGet(contactData, studentId);
      
      updatedMap.set(studentId, {
        ...studentData,
        ContactInfo: contactInfo
      });
    });

    return updatedMap;
  }

  /**
   * Merges schedule data with existing student data (filters active schedules)
   * @param {Map} existingData - Existing student data map
   * @param {Map} scheduleData - Schedule data map
   * @returns {Map} Updated student data map
   */
  mergeScheduleData(existingData, scheduleData) {
    this.log('Merging schedule data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const rawSchedules = this.safeMapGet(scheduleData, studentId, []);
      
      // Filter schedules to only include active ones (no withdrawal date)
      const activeSchedules = this.filterActiveSchedules(rawSchedules);
      
      updatedMap.set(studentId, {
        ...studentData,
        Schedules: activeSchedules.length > 0 ? activeSchedules : null
      });
    });

    return updatedMap;
  }

  /**
   * Filters schedules to only include active ones (no withdrawal date)
   * @param {Array} schedules - Array of schedule data
   * @returns {Array} Filtered active schedules
   */
  filterActiveSchedules(schedules) {
    if (!Array.isArray(schedules)) {
      return [];
    }

    return schedules.filter(schedule => 
      !schedule[COLUMN_NAMES.WITHDRAW_DATE] || 
      schedule[COLUMN_NAMES.WITHDRAW_DATE] === '' || 
      schedule[COLUMN_NAMES.WITHDRAW_DATE] === null
    );
  }

  /**
   * Merges attendance data with existing student data
   * @param {Map} existingData - Existing student data map
   * @param {Map} attendanceData - Attendance data map
   * @returns {Map} Updated student data map
   */
  mergeAttendanceData(existingData, attendanceData) {
    this.log('Merging attendance data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const attendanceInfo = this.safeMapGet(attendanceData, studentId);
      
      updatedMap.set(studentId, {
        ...studentData,
        Alt_HS_Attendance_Enrollment_Count: attendanceInfo
      });
    });

    return updatedMap;
  }

  /**
   * Merges form responses data with existing student data
   * @param {Map} existingData - Existing student data map
   * @param {Map} formResponsesData - Form responses data map
   * @returns {Map} Updated student data map
   */
  mergeFormResponsesData(existingData, formResponsesData) {
    this.log('Merging form responses data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const formResponses = this.safeMapGet(formResponsesData, studentId);
      
      updatedMap.set(studentId, {
        ...studentData,
        Form_Responses_1: formResponses
      });
    });

    return updatedMap;
  }

  /**
   * Merges entry/withdrawal data with existing student data
   * @param {Map} existingData - Existing student data map
   * @param {Map} entryWithdrawalData - Entry/withdrawal data map
   * @returns {Map} Updated student data map
   */
  mergeEntryWithdrawalData(existingData, entryWithdrawalData) {
    this.log('Merging entry/withdrawal data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const entryWithdrawal = this.safeMapGet(entryWithdrawalData, studentId);
      
      updatedMap.set(studentId, {
        ...studentData,
        Entry_Withdrawal: entryWithdrawal
      });
    });

    return updatedMap;
  }
}
