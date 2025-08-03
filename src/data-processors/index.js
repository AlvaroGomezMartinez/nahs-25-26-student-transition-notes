/**
 * @fileoverview Data Processors Index and Factory for the NAHS system.
 * 
 * This module serves as the central registry and factory for all data processor
 * classes in the NAHS system. It provides documentation of available processors,
 * factory methods for creating processor instances, and utilities for coordinated
 * data processing operations across the entire student data pipeline.
 * 
 * The processors handle complex business logic transformations, data merging,
 * filtering, and validation required for comprehensive transition tracking.
 * 
 * @author NAHS Development Team
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataProcessors
 */

/**
 * Registry of available Data Processor Classes in the NAHS system.
 * 
 * This documentation serves as a reference for all available data processors,
 * their purposes, and their usage patterns. Each processor extends BaseDataProcessor
 * and provides specialized functionality for specific data transformation needs.
 * 
 * **Available Data Processor Classes:**
 * - **BaseDataProcessor**: Abstract base class with common processing functionality
 * - **StudentDataMerger**: Merges student data from multiple sources into unified records
 * - **StudentFilterProcessor**: Filters out withdrawn/inactive students based on business rules
 * - **ScheduleProcessor**: Processes schedule data, course information, and period mappings
 * - **TeacherInputProcessor**: Processes complex teacher form responses and feedback integration
 * 
 * @namespace DataProcessorRegistry
 * @memberof DataProcessors
 * 
 * @example
 * // Create specific processor instances
 * const merger = new StudentDataMerger();
 * const filter = new StudentFilterProcessor();
 * const scheduleProcessor = new ScheduleProcessor();
 * 
 * @example
 * // Use factory for coordinated processing
 * const processors = createAllDataProcessors();
 * const mergedData = processors.merger.process(studentData);
 * const filteredData = processors.filter.process(filterCriteria);
 * 
 * @since 2.0.0
 */

/**
 * Factory function to create all data processor instances.
 * 
 * This factory provides a convenient way to create all data processor
 * instances needed for complete student data processing. It ensures
 * consistent processor initialization and provides a clean interface
 * for accessing the full processing pipeline.
 * 
 * @function createAllDataProcessors
 * @memberof DataProcessors
 * 
 * @returns {Object} Object containing all processor instances:
 *   - **merger**: StudentDataMerger instance for data integration
 *   - **filter**: StudentFilterProcessor instance for student filtering
 *   - **schedule**: ScheduleProcessor instance for schedule processing
 *   - **teacherInput**: TeacherInputProcessor instance for teacher feedback processing
 * 
 * @example
 * // Create complete processor suite
 * const processors = createAllDataProcessors();
 * 
 * // Use processors in sequence
 * const mergedData = processors.merger.process(rawStudentData);
 * const activeStudents = processors.filter.process(filterData);
 * const processedSchedules = processors.schedule.process(scheduleData);
 * const teacherFeedback = processors.teacherInput.processTeacherInput(studentId, studentData);
 * 
 * @since 2.0.0
 */
function createAllDataProcessors() {
  return {
    merger: new StudentDataMerger(),
    filter: new StudentFilterProcessor(),
    schedule: new ScheduleProcessor(),
    teacherInput: new TeacherInputProcessor()
  };
}

/**
 * Main data processing orchestrator
 * This function replaces the complex processing logic from loadTENTATIVEVersion2
 * @param {Object} rawData - Raw data from all data loaders
 * @returns {Map} Fully processed and filtered student data
 */
function processAllStudentData(rawData) {
  console.log('Starting comprehensive student data processing...');
  
  const processors = createAllDataProcessors();
  
  try {
    // Step 1: Merge all data sources
    console.log('Step 1: Merging data sources...');
    const mergedData = processors.merger.process(rawData);
    
    // Step 2: Filter out withdrawn and inactive students
    console.log('Step 2: Filtering students...');
    const filteredData = processors.filter.process({
      studentData: mergedData,
      withdrawnData: rawData.withdrawnData,
      wdOtherData: rawData.wdOtherData,
      entryWithdrawalData: rawData.entryWithdrawalData
    });
    
    // Step 3: Process schedules for remaining students
    console.log('Step 3: Processing schedules...');
    const processedSchedules = processors.schedule.process(rawData.schedulesData);
    
    // Step 4: Merge processed schedules back into student data
    const finalData = new Map();
    filteredData.forEach((studentData, studentId) => {
      const studentSchedules = processedSchedules.get(studentId);
      finalData.set(studentId, {
        ...studentData,
        Schedules: studentSchedules || null
      });
    });
    
    console.log(`Data processing complete. Final student count: ${finalData.size}`);
    return finalData;
    
  } catch (error) {
    console.error('Error in data processing pipeline:', error);
    throw error;
  }
}

/**
 * Processes teacher input for a single student
 * This replaces the complex teacher input logic from writeToTENTATIVEVersion2
 * @param {number} studentId - Student ID
 * @param {Object} studentData - Complete student data object
 * @returns {Object} Processed teacher input structure
 */
function processStudentTeacherInput(studentId, studentData) {
  const processor = new TeacherInputProcessor();
  
  return processor.process({
    studentId: studentId,
    formResponses: studentData.Form_Responses_1,
    scheduleData: studentData.Schedules,
    tentativeData: studentData.TENTATIVE
  });
}

/**
 * Processes multiple students' teacher input in batch
 * @param {Map} studentDataMap - Map of student data
 * @returns {Map} Map of processed teacher inputs
 */
function processAllTeacherInputs(studentDataMap) {
  console.log('Processing teacher inputs for all students...');
  
  const teacherInputs = new Map();
  
  studentDataMap.forEach((studentData, studentId) => {
    try {
      const teacherInput = processStudentTeacherInput(studentId, studentData);
      teacherInputs.set(studentId, teacherInput);
    } catch (error) {
      console.error(`Error processing teacher input for student ${studentId}:`, error);
      // Continue processing other students
    }
  });
  
  console.log(`Teacher input processing complete. Processed: ${teacherInputs.size} students`);
  return teacherInputs;
}

/**
 * Legacy function compatibility - replaces enhancedFilterOutMatches
 * @param {Map} baseData - Base data map
 * @param {Map} excludeData - Data to exclude
 * @returns {Array} Filtered results
 */
function enhancedFilterOutMatches(baseData, excludeData) {
  const processor = new StudentFilterProcessor();
  return processor.enhancedFilterOutMatches(baseData, excludeData);
}

/**
 * Legacy function compatibility - filters schedules with empty withdraw dates
 * @param {Array} schedules - Schedule array
 * @returns {Array} Filtered schedules
 */
function filterSchedulesWithEmptyWdrawDate(schedules) {
  const processor = new ScheduleProcessor();
  return schedules ? schedules.filter(schedule => processor.isActiveSchedule(schedule)) : [];
}
