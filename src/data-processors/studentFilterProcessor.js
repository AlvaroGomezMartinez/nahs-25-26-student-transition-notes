/**
 * @fileoverview Student Filter Processor for the NAHS system.
 * 
 * This module provides specialized functionality for filtering student data
 * based on withdrawal status, special categories, and business logic rules.
 * It handles the complex filtering operations required to identify active
 * students eligible for transition processing while excluding withdrawn
 * or special status students appropriately.
 * 
 * The processor replaces complex filtering logic from the original system
 * with a clean, maintainable approach for student eligibility determination.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataProcessors
 */

/**
 * Processes student filtering operations for active student identification.
 * 
 * This specialized processor handles complex filtering logic to identify
 * students eligible for transition processing. It applies business rules
 * for withdrawn students, special categories, and entry/withdrawal status
 * to produce accurate active student lists for processing.
 * 
 * **Key Features:**
 * - **Withdrawal Filtering**: Excludes withdrawn students from active processing
 * - **Special Category Handling**: Applies appropriate rules for W/D Other students
 * - **Status Validation**: Ensures student eligibility based on entry/withdrawal data
 * - **Business Rule Application**: Implements complex filtering business logic
 * - **Data Integrity**: Maintains filtering audit trails and validation logs
 * 
 * @class StudentFilterProcessor
 * @extends BaseDataProcessor
 * @memberof DataProcessors
 * 
 * @example
 * // Filter students for active processing
 * const processor = new StudentFilterProcessor();
 * const filterData = {
 *   studentData: allStudentData,
 *   withdrawnData: withdrawnStudents,
 *   wdOtherData: wdOtherStudents,
 *   entryWithdrawalData: entryWithdrawalRecords
 * };
 * const activeStudents = processor.process(filterData);
 * 
 * @example
 * // Process with validation
 * const processor = new StudentFilterProcessor();
 * const result = processor.process(filterData);
 * console.log(`Filtered to ${result.size} active students from ${filterData.studentData.size} total`);
 * 
 * @since 2.0.0
 */
class StudentFilterProcessor extends BaseDataProcessor {
  constructor() {
    super('StudentFilterProcessor');
  }

  /**
   * Filters out withdrawn students and applies other business rules
   * @param {Object} filterData - Object containing data to filter and filter criteria
   * @returns {Map} Filtered student data map
   */
  process(filterData) {
    this.log('Starting student filtering process...');

    const { 
      studentData, 
      withdrawnData, 
      wdOtherData, 
      entryWithdrawalData 
    } = filterData;

    // Validate inputs
    if (!this.validateMapInput(studentData, 'studentData')) {
      return new Map();
    }

    let filteredData = new Map(studentData);

    // Apply withdrawn students filter
    if (withdrawnData) {
      filteredData = this.filterOutWithdrawnStudents(filteredData, withdrawnData);
    }

    // Apply W/D Other filter
    if (wdOtherData) {
      filteredData = this.filterOutWDOtherStudents(filteredData, wdOtherData);
    }

    // Apply entry/withdrawal business rules
    if (entryWithdrawalData) {
      filteredData = this.applyEntryWithdrawalRules(filteredData, entryWithdrawalData);
    }

    this.log(`Filtering complete. Students remaining: ${filteredData.size}`);
    return filteredData;
  }

  /**
   * Filters out students who are in the withdrawn list
   * @param {Map} studentData - Student data map
   * @param {Map} withdrawnData - Withdrawn students data
   * @returns {Map} Filtered student data
   */
  filterOutWithdrawnStudents(studentData, withdrawnData) {
    this.log('Filtering out withdrawn students...');
    
    if (!withdrawnData || withdrawnData.size === 0) {
      this.log('No withdrawn data provided, skipping withdrawn filter');
      return studentData;
    }

    const filteredMap = new Map();
    let removedCount = 0;

    studentData.forEach((data, studentId) => {
      if (!withdrawnData.has(studentId)) {
        filteredMap.set(studentId, data);
      } else {
        removedCount++;
        this.log(`Removed withdrawn student: ${studentId}`);
      }
    });

    this.log(`Removed ${removedCount} withdrawn students`);
    return filteredMap;
  }

  /**
   * Filters out students who are in the W/D Other list
   * @param {Map} studentData - Student data map
   * @param {Map} wdOtherData - W/D Other students data
   * @returns {Map} Filtered student data
   */
  filterOutWDOtherStudents(studentData, wdOtherData) {
    this.log('Filtering out W/D Other students...');
    
    if (!wdOtherData || wdOtherData.size === 0) {
      this.log('No W/D Other data provided, skipping W/D Other filter');
      return studentData;
    }

    const filteredMap = new Map();
    let removedCount = 0;

    studentData.forEach((data, studentId) => {
      if (!wdOtherData.has(studentId)) {
        filteredMap.set(studentId, data);
      } else {
        removedCount++;
        this.log(`Removed W/D Other student: ${studentId}`);
      }
    });

    this.log(`Removed ${removedCount} W/D Other students`);
    return filteredMap;
  }

  /**
   * Applies entry/withdrawal business rules
   * @param {Map} studentData - Student data map
   * @param {Map} entryWithdrawalData - Entry/withdrawal data
   * @returns {Map} Filtered student data
   */
  applyEntryWithdrawalRules(studentData, entryWithdrawalData) {
    this.log('Applying entry/withdrawal business rules...');
    
    const filteredMap = new Map();
    let removedCount = 0;

    studentData.forEach((data, studentId) => {
      const entryData = entryWithdrawalData.get(studentId);
      
      if (this.shouldIncludeStudent(studentId, entryData)) {
        filteredMap.set(studentId, data);
      } else {
        removedCount++;
        this.log(`Removed student based on entry/withdrawal rules: ${studentId}`);
      }
    });

    this.log(`Removed ${removedCount} students based on entry/withdrawal rules`);
    return filteredMap;
  }

  /**
   * Determines if a student should be included based on entry/withdrawal data
   * @param {number} studentId - Student ID
   * @param {Array} entryData - Entry/withdrawal data for the student
   * @returns {boolean} True if student should be included
   */
  shouldIncludeStudent(studentId, entryData) {
    // If no entry data, exclude the student
    if (!entryData || !Array.isArray(entryData) || entryData.length === 0) {
      this.log(`No entry data found for student ${studentId}`, 'warn');
      return false;
    }

    // Check if student has a valid entry date
    const entryRecord = entryData[0];
    const entryDate = entryRecord[COLUMN_NAMES.ENTRY_DATE];
    
    if (!entryDate || !isValidDate(entryDate)) {
      this.log(`Invalid entry date for student ${studentId}: ${entryDate}`, 'warn');
      return false;
    }

    // Add more business rules here as needed
    // For example: check if entry date is not too old, etc.
    
    return true;
  }

  /**
   * Enhanced filtering method that combines multiple filter criteria
   * This replaces the enhancedFilterOutMatches function from the original code
   * @param {Map} baseData - Base student data
   * @param {Map} excludeData - Data containing students to exclude
   * @returns {Array} Filtered results as array
   */
  enhancedFilterOutMatches(baseData, excludeData) {
    this.log('Applying enhanced filtering...');
    
    if (!baseData || !excludeData) {
      this.log('Missing data for enhanced filtering', 'error');
      return [];
    }

    const results = [];
    
    baseData.forEach((value, key) => {
      if (!excludeData.has(key)) {
        // Convert to the expected format for backward compatibility
        const resultEntry = {};
        resultEntry[key] = value;
        results.push(resultEntry);
      }
    });

    this.log(`Enhanced filtering complete. Results: ${results.length}`);
    return results;
  }

  /**
   * Filters students based on latest registration date
   * This implements the logic from the original registrationsData function
   * @param {Map} registrationData - Registration data
   * @returns {Map} Filtered registration data with latest entries per student
   */
  filterLatestRegistrations(registrationData) {
    this.log('Filtering for latest registrations per student...');
    
    const latestRegistrations = new Map();
    const latestDates = {};

    registrationData.forEach((registrations, studentId) => {
      if (!Array.isArray(registrations)) {
        return;
      }

      registrations.forEach(registration => {
        const startDate = new Date(registration['Start Date']);
        
        if (!latestDates[studentId] || startDate > latestDates[studentId]) {
          latestDates[studentId] = startDate;
          latestRegistrations.set(studentId, [registration]);
        }
      });
    });

    this.log(`Latest registrations filtered. Students: ${latestRegistrations.size}`);
    return latestRegistrations;
  }
}
