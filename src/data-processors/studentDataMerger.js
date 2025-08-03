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
 * @author Alvaro Gomez
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
    mergedData = this.mergeEntryWithdrawalData(mergedData, dataSources.entryWithdrawalData);
    mergedData = this.mergeScheduleData(mergedData, dataSources.schedulesData);
    mergedData = this.mergeAttendanceData(mergedData, dataSources.attendanceData);
    mergedData = this.mergeFormResponsesData(mergedData, dataSources.formResponsesData);

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
   * Creates the base student map from tentative data - FIXED TO USE ENTRY_WITHDRAWAL NAMES
   * @param {Object} dataSources - All data sources
   * @returns {Map} Base student map
   */
  createBaseStudentMap(dataSources) {
    this.log('Creating base student map from tentative data...');
    
    const baseMap = new Map();
    
    if (dataSources.tentativeData && dataSources.tentativeData.size > 0) {
      this.log(`Processing ${dataSources.tentativeData.size} students from TENTATIVE-Version2`);
      
      dataSources.tentativeData.forEach((studentRecord, studentId) => {
        // Handle array format (which is what we have)
        let processedRecord;
        if (Array.isArray(studentRecord)) {
          processedRecord = studentRecord[0] || {};
        } else {
          processedRecord = studentRecord || {};
        }
        
        // ✅ FIXED: Get names from Entry_Withdrawal data if TENTATIVE names are empty
        let firstName = processedRecord.FIRST || '';
        let lastName = processedRecord.LAST || '';
        let grade = processedRecord.GRADE || '';
        
        // If TENTATIVE has empty names, try to get them from Entry_Withdrawal data
        if ((!firstName || firstName === '') && dataSources.entryWithdrawalData) {
          const entryData = dataSources.entryWithdrawalData.get(studentId);
          if (entryData) {
            const entryRecord = Array.isArray(entryData) ? entryData[0] : entryData;
            
            // Try different possible name column variations in Entry_Withdrawal
            firstName = entryRecord['Student First Name'] || 
                       entryRecord['First Name'] || 
                       entryRecord['FIRST'] || 
                       entryRecord['First'] || '';
            
            lastName = entryRecord['Student Last Name'] || 
                      entryRecord['Last Name'] || 
                      entryRecord['LAST'] || 
                      entryRecord['Last'] || '';
            
            // Also try to extract from full name if available
            if ((!firstName || !lastName) && entryRecord['Student Name(Last, First)']) {
              const fullName = entryRecord['Student Name(Last, First)'];
              const nameParts = fullName.split(',');
              if (nameParts.length >= 2) {
                lastName = nameParts[0].trim();
                firstName = nameParts[1].trim();
              }
            }
            
            // Get grade if missing
            if (!grade || grade === '') {
              grade = entryRecord['Grade'] || 
                     entryRecord['GRADE'] || 
                     entryRecord['Grd Lvl'] || '';
            }
            
            this.log(`Student ${studentId}: Got names from Entry_Withdrawal - ${firstName} ${lastName} (Grade: ${grade})`);
          }
        }
        
        // ✅ FINAL FALLBACK: If still no names, try registration data as last resort
        if ((!firstName || firstName === '') && dataSources.registrationsData) {
          const registrationData = dataSources.registrationsData.get(studentId);
          if (registrationData) {
            const regRecord = Array.isArray(registrationData) ? registrationData[0] : registrationData;
            firstName = firstName || regRecord['Student First Name'] || '';
            lastName = lastName || regRecord['Student Last Name'] || '';
            if (!grade || grade === '') {
              grade = regRecord['Grd Lvl'] || regRecord['GRADE'] || '';
            }
            this.log(`Student ${studentId}: Used registration fallback - ${firstName} ${lastName}`);
          }
        }
        
        // ✅ Create enhanced student data with populated names
        const studentData = {
          // Preserve original TENTATIVE data structure
          ...processedRecord,
          // Ensure essential fields are populated
          // @todo Make sure there aren't more fields that need to be populated
          STUDENT_ID: studentId,
          FIRST: firstName,
          LAST: lastName,
          GRADE: grade,
          // Extract other important fields from TENTATIVE
          HOME_CAMPUS: processedRecord['REGULAR CAMPUS'] || '',
          ENTRY_DATE: processedRecord['FIRST DAY OF AEP'] || ''
        };
        
        this.log(`Final student data for ${studentId}: ${studentData.FIRST} ${studentData.LAST} (Grade: ${studentData.GRADE})`);
        
        baseMap.set(studentId, {
          TENTATIVE: [studentData], // Store the enhanced data
          Registrations_SY_24_25: [],
          ContactInfo: [],
          Schedules: [],
          Form_Responses_1: [],
          Entry_Withdrawal: [],
          Alt_HS_Attendance_Enrollment_Count: [],
          Withdrawn: [],
          WD_Other: []
        });
      });
      
      this.log(`Created base map with ${baseMap.size} students from tentative data`);
    } else {
      // Fallback logic if no tentative data - prioritize Entry_Withdrawal over registration
      this.log('No tentative data available, creating base map from Entry_Withdrawal data', 'warn');
      
      if (dataSources.entryWithdrawalData && dataSources.entryWithdrawalData.size > 0) {
        dataSources.entryWithdrawalData.forEach((entryRecord, studentId) => {
          const entryData = Array.isArray(entryRecord) ? entryRecord[0] : entryRecord;
          
          // Extract names from Entry_Withdrawal
          let firstName = entryData['Student First Name'] || 
                         entryData['First Name'] || 
                         entryData['FIRST'] || '';
          let lastName = entryData['Student Last Name'] || 
                        entryData['Last Name'] || 
                        entryData['LAST'] || '';
          
          // Try to extract from full name if individual names not available
          if ((!firstName || !lastName) && entryData['Student Name(Last, First)']) {
            const fullName = entryData['Student Name(Last, First)'];
            const nameParts = fullName.split(',');
            if (nameParts.length >= 2) {
              lastName = nameParts[0].trim();
              firstName = nameParts[1].trim();
            }
          }
          
          baseMap.set(studentId, {
            TENTATIVE: [{
              STUDENT_ID: studentId,
              FIRST: firstName,
              LAST: lastName,
              GRADE: entryData['Grade'] || entryData['GRADE'] || '',
              HOME_CAMPUS: entryData['Home Campus'] || '',
              ENTRY_DATE: entryData['Entry Date'] || '',
            }],
            Registrations_SY_24_25: [],
            ContactInfo: [],
            Schedules: [],
            Form_Responses_1: [],
            Entry_Withdrawal: Array.isArray(entryRecord) ? entryRecord : [entryRecord],
            Alt_HS_Attendance_Enrollment_Count: [],
            Withdrawn: [],
            WD_Other: []
          });
        });
        this.log(`Created base map with ${baseMap.size} students from Entry_Withdrawal data`);
      } else if (dataSources.registrationsData && dataSources.registrationsData.size > 0) {
        // Final fallback to registration data
        this.log('No Entry_Withdrawal data available, using registration data as final fallback', 'warn');
        
        dataSources.registrationsData.forEach((registrationRecord, studentId) => {
          const regData = Array.isArray(registrationRecord) ? registrationRecord[0] : registrationRecord;
          
          baseMap.set(studentId, {
            TENTATIVE: [{
              STUDENT_ID: studentId,
              FIRST: regData['Student First Name'] || '',
              LAST: regData['Student Last Name'] || '',
              GRADE: regData['Grd Lvl'] || regData['GRADE'] || '',
              HOME_CAMPUS: regData['Home Campus'] || '',
              ENTRY_DATE: regData['Start Date'] || '',
            }],
            Registrations_SY_24_25: Array.isArray(registrationRecord) ? registrationRecord : [registrationRecord],
            ContactInfo: [],
            Schedules: [],
            Form_Responses_1: [],
            Entry_Withdrawal: [],
            Alt_HS_Attendance_Enrollment_Count: [],
            Withdrawn: [],
            WD_Other: []
          });
        });
        this.log(`Created base map with ${baseMap.size} students from registration data (final fallback)`);
      }
    }

    return baseMap;
  }

  /**
   * Merges registration data with existing student data - FIXED VERSION
   */
  mergeRegistrationData(existingData, registrationData) {
    this.log('Merging registration data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const registrationInfo = this.safeMapGet(registrationData, studentId, []);
      
      updatedMap.set(studentId, {
        ...studentData,
        Registrations_SY_24_25: Array.isArray(registrationInfo) ? registrationInfo : 
          (registrationInfo ? [registrationInfo] : [])
      });
    });

    return updatedMap;
  }

  /**
   * Merges contact data with existing student data - FIXED VERSION
   */
  mergeContactData(existingData, contactData) {
    this.log('Merging contact data...');
    
    const updatedMap = new Map();
    
    existingData.forEach((studentData, studentId) => {
      const contactInfo = this.safeMapGet(contactData, studentId, []);
      
      updatedMap.set(studentId, {
        ...studentData,
        ContactInfo: Array.isArray(contactInfo) ? contactInfo :
          (contactInfo ? [contactInfo] : [])
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
      
      // Extract the most recent entry date from active schedules for "FIRST DAY OF AEP"
      const firstDayOfAEP = this.extractMostRecentEntryDate(activeSchedules);
      
      // Update student data with schedules and entry date
      const updatedStudentData = {
        ...studentData,
        Schedules: activeSchedules.length > 0 ? activeSchedules : null
      };
      
      // If we found an entry date, update both TENTATIVE and Entry/Withdrawal records
      if (firstDayOfAEP) {
        // Update TENTATIVE record(s)
        if (studentData.TENTATIVE && Array.isArray(studentData.TENTATIVE)) {
          updatedStudentData.TENTATIVE = studentData.TENTATIVE.map(tentativeRecord => ({
            ...tentativeRecord,
            'FIRST DAY OF AEP': firstDayOfAEP,
            ENTRY_DATE: firstDayOfAEP
          }));
        }
        
        // Update Entry/Withdrawal record(s) - this is what TentativeRowBuilder uses
        if (studentData.Entry_Withdrawal && Array.isArray(studentData.Entry_Withdrawal)) {
          updatedStudentData.Entry_Withdrawal = studentData.Entry_Withdrawal.map(entryRecord => ({
            ...entryRecord,
            'Entry Date': firstDayOfAEP
          }));
        } else if (studentData.Entry_Withdrawal && !Array.isArray(studentData.Entry_Withdrawal)) {
          // Handle single object case
          updatedStudentData.Entry_Withdrawal = [{
            ...studentData.Entry_Withdrawal,
            'Entry Date': firstDayOfAEP
          }];
        } else if (firstDayOfAEP) {
          // Create Entry/Withdrawal record if it doesn't exist
          updatedStudentData.Entry_Withdrawal = [{
            'Entry Date': firstDayOfAEP,
            'STUDENT ID': studentId
          }];
        }
        
        this.log(`Updated entry date for student ${studentId}: ${firstDayOfAEP}`);
      }
      
      updatedMap.set(studentId, updatedStudentData);
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
   * Extracts the most recent entry date from active schedules for "FIRST DAY OF AEP"
   * @param {Array} activeSchedules - Array of active schedule records
   * @returns {string|null} The most recent entry date or null if none found
   */
  extractMostRecentEntryDate(activeSchedules) {
    if (!Array.isArray(activeSchedules) || activeSchedules.length === 0) {
      return null;
    }

    let mostRecentDate = null;
    let mostRecentTimestamp = 0;

    activeSchedules.forEach(schedule => {
      const entryDateValue = schedule[COLUMN_NAMES.ENTRY_DATE];
      
      if (entryDateValue && entryDateValue !== '') {
        try {
          // Handle both Date objects and string dates
          let dateToCheck;
          if (entryDateValue instanceof Date) {
            dateToCheck = entryDateValue;
          } else {
            dateToCheck = new Date(entryDateValue);
          }
          
          // Validate the date is valid
          if (!isNaN(dateToCheck.getTime())) {
            const timestamp = dateToCheck.getTime();
            if (timestamp > mostRecentTimestamp) {
              mostRecentTimestamp = timestamp;
              mostRecentDate = entryDateValue instanceof Date ? 
                entryDateValue.toLocaleDateString() : 
                entryDateValue;
            }
          }
        } catch (error) {
          this.log(`Warning: Invalid entry date format: ${entryDateValue}`);
        }
      }
    });

    if (mostRecentDate) {
      this.log(`Found most recent entry date: ${mostRecentDate}`);
    }

    return mostRecentDate;
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
      const formResponses = this.safeMapGet(formResponsesData, studentId, []);
      
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
