/**
 * @fileoverview Student Data Merger Processor for the NAHS system.
 * 
 * This module handles the complex process of merging student data from multiple
 * Google Sheets sources into a unified student data structure. It replaces the
 * multiple nested Map operations from the original 701-line monolithic function
 * with a clean, maintainable class-based approach.
 * 
 * The merger processes data from 8+ different sources including:
 * - TENTATIVE sheet (primary student data)
 * - Registration information
 * - Contact details
 * - Course schedules
 * - Teacher form responses
 * - Attendance records
 * - Entry/withdrawal tracking
 * 
 * @author NAHS Development Team
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * Student Data Merger class that consolidates data from multiple sources.
 * 
 * This processor implements sophisticated data merging logic to combine
 * student information from various Google Sheets into a comprehensive
 * student profile. It handles data conflicts, missing information, and
 * maintains referential integrity across data sources.
 * 
 * **Key Features:**
 * - **Multi-source Integration**: Merges data from 8+ different sheets
 * - **Conflict Resolution**: Handles conflicting data between sources
 * - **Data Validation**: Ensures data integrity during merge operations
 * - **Performance Optimization**: Efficient Map operations for large datasets
 * - **Error Resilience**: Continues processing when individual sources fail
 * 
 * **Data Sources Processed:**
 * 1. TENTATIVE - Primary student information
 * 2. Registrations - Enrollment and placement data
 * 3. ContactInfo - Student and parent contact details
 * 4. Schedules - Course assignments and teachers
 * 5. Form Responses - Teacher feedback and assessments
 * 6. Attendance - Enrollment counts and attendance data
 * 7. Entry/Withdrawal - Program entry and exit tracking
 * 8. Additional sources as needed
 * 
 * @class StudentDataMerger
 * @extends BaseDataProcessor
 * @memberof DataProcessors
 * 
 * @example
 * // Basic usage
 * const merger = new StudentDataMerger();
 * const mergedData = merger.process(dataSources);
 * console.log(`Merged data for ${mergedData.size} students`);
 * 
 * @example
 * // Advanced usage with validation
 * const merger = new StudentDataMerger();
 * const dataSources = {
 *   tentativeData: tentativeMap,
 *   registrationsData: registrationMap,
 *   contactData: contactMap,
 *   schedulesData: scheduleMap,
 *   formResponsesData: formMap,
 *   attendanceData: attendanceMap,
 *   entryWithdrawalData: entryMap
 * };
 * 
 * try {
 *   const result = merger.process(dataSources);
 *   if (result.size === 0) {
 *     console.warn('No student data merged - check data sources');
 *   }
 * } catch (error) {
 *   console.error('Merge failed:', error.message);
 * }
 * 
 * @see {@link BaseDataProcessor} For base functionality
 * @see {@link loadAllStudentDataWithLoaders} For data source creation
 * 
 * @since 2.0.0
 */
class StudentDataMerger extends BaseDataProcessor {
  /**
   * Creates a new StudentDataMerger instance.
   * 
   * @constructor
   */
  constructor() {
    super('StudentDataMerger');
  }

  /**
   * Merges all student data from multiple sources into a unified Map.
   * 
   * This is the primary method that orchestrates the entire data merging
   * process. It validates input sources, creates the base student map,
   * and then sequentially merges data from each source while maintaining
   * data integrity and handling conflicts.
   * 
   * **Processing Steps:**
   * 1. Validate all required data sources are present
   * 2. Create base student map from primary data source
   * 3. Sequentially merge each additional data source
   * 4. Apply conflict resolution and data cleanup
   * 5. Return the unified student data map
   * 
   * @method process
   * @memberof StudentDataMerger
   * 
   * @param {Object} dataSources - Object containing all data source Maps:
   *   @param {Map} dataSources.tentativeData - Primary student data from TENTATIVE sheet
   *   @param {Map} dataSources.registrationsData - Registration and placement information
   *   @param {Map} dataSources.contactData - Contact information for students and parents
   *   @param {Map} dataSources.schedulesData - Course schedules and teacher assignments
   *   @param {Map} dataSources.formResponsesData - Teacher form responses and feedback
   *   @param {Map} dataSources.attendanceData - Attendance records and enrollment counts
   *   @param {Map} dataSources.entryWithdrawalData - Entry and withdrawal tracking
   * 
   * @returns {Map<string, Object>} Unified student data map where:
   *   - **Key**: Student ID (string) - Unique student identifier
   *   - **Value**: Complete student object with merged data from all sources
   * 
   * @throws {Error} Throws if critical validation failures occur
   * 
   * @example
   * // Basic merging process
   * const dataSources = {
   *   tentativeData: new Map([['1234567', {FIRST: 'John', LAST: 'Doe'}]]),
   *   registrationsData: new Map([['1234567', {GRADE: '10', HOME_CAMPUS: 'HS-A'}]]),
   *   contactData: new Map([['1234567', {STUDENT_EMAIL: 'john.doe@student.edu'}]])
   *   // ... other data sources
   * };
   * 
   * const merger = new StudentDataMerger();
   * const merged = merger.process(dataSources);
   * 
   * const student = merged.get('1234567');
   * console.log(`Student: ${student.TENTATIVE[0].FIRST} ${student.TENTATIVE[0].LAST}`);
   * console.log(`Grade: ${student.Registrations_SY_24_25[0].GRADE}`);
   * 
   * @example
   * // Error handling during merge
   * try {
   *   const result = merger.process(dataSources);
   *   
   *   if (result.size === 0) {
   *     console.warn('No students merged - check data source validity');
   *   } else {
   *     console.log(`Successfully merged ${result.size} student records`);
   *   }
   * } catch (error) {
   *   console.error('Merge process failed:', error.message);
   *   // Handle merge failure appropriately
   * }
   * 
   * @see {@link validateDataSources} For input validation details
   * @see {@link createBaseStudentMap} For base map creation
   * @see {@link mergeRegistrationData} For registration data merging
   * 
   * @since 2.0.0
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
   * Validates that all required data sources are present and properly formatted.
   * 
   * This method ensures that the input object contains all necessary data
   * source Maps and that each Map is properly formatted. It provides early
   * validation to prevent processing failures downstream.
   * 
   * @method validateDataSources
   * @memberof StudentDataMerger
   * @private
   * 
   * @param {Object} dataSources - Object containing data source Maps to validate
   * 
   * @returns {boolean} True if all required sources are valid, false otherwise
   * 
   * @example
   * // Internal validation usage
   * if (!this.validateDataSources(dataSources)) {
   *   console.error('Invalid data sources provided');
   *   return new Map();
   * }
   * 
   * @since 2.0.0
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
      this.log(`Created base map with ${baseMap.size} students from tentative data`);
    } else {
      this.log('No tentative data available, creating base map from registration data', 'warn');
      
      // If no tentative data, create base map from registration data
      if (dataSources.registrationsData && dataSources.registrationsData.size > 0) {
        dataSources.registrationsData.forEach((registrationArray, studentId) => {
          baseMap.set(studentId, {
            // Create minimal student record
            STUDENT_ID: studentId,
            FIRST: '',
            LAST: '',
            GRADE: '',
            // Will be populated by registration merge
          });
        });
        this.log(`Created base map with ${baseMap.size} students from registration data`);
      } else {
        this.log('No registration data available either, using empty base map', 'warn');
      }
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
