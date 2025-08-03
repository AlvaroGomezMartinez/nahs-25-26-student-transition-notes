/**
 * @fileoverview Validation Utilities for the NAHS system.
 * 
 * This module provides comprehensive validation functions to ensure data
 * integrity and quality throughout the NAHS Student Transition Notes processing
 * pipeline. It includes validation for student data, sheet structures, column
 * mappings, and data completeness checks across all system components.
 * 
 * The validation utilities help maintain data quality and provide detailed
 * error reporting for troubleshooting and system reliability.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof Utils
 */

/**
 * Validates student data completeness and integrity.
 * 
 * This function performs comprehensive validation of student data objects
 * to ensure all required sections are present, data types are correct,
 * and cross-references are valid. It provides detailed error reporting
 * for troubleshooting data quality issues.
 * 
 * @function validateStudentData
 * @memberof Utils.ValidationUtils
 * 
 * @param {Object} studentData - Student data object containing all loaded data sections
 * @param {string|number} studentId - Student ID for error reporting and logging
 * @returns {Object} Validation result object containing:
 *   - **isValid**: Boolean indicating overall validation success
 *   - **errors**: Array of critical errors that prevent processing
 *   - **warnings**: Array of non-critical issues for attention
 *   - **studentId**: Student ID for reference
 * 
 * @example
 * // Validate student data before processing
 * const studentData = loadAllStudentData().get('123456');
 * const validation = validateStudentData(studentData, '123456');
 * if (!validation.isValid) {
 *   console.error(`Student ${validation.studentId} validation failed:`, validation.errors);
 * }
 * 
 * @example
 * // Handle validation warnings
 * const result = validateStudentData(studentData, studentId);
 * if (result.warnings.length > 0) {
 *   console.warn(`Data quality issues for student ${studentId}:`, result.warnings);
 * }
 * 
 * @since 2.0.0
 */
function validateStudentData(studentData, studentId) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    studentId: studentId
  };

  if (!studentData || typeof studentData !== 'object') {
    validation.isValid = false;
    validation.errors.push('Student data is not a valid object');
    return validation;
  }

  // Check for required data sections
  const requiredSections = [
    'Entry_Withdrawal',
    'Registrations_SY_24_25'
  ];

  requiredSections.forEach(section => {
    if (!studentData[section]) {
      validation.warnings.push(`Missing ${section} data`);
    }
  });

  // Validate Entry_Withdrawal data
  if (studentData.Entry_Withdrawal) {
    const entryValidation = validateEntryWithdrawalData(studentData.Entry_Withdrawal);
    if (!entryValidation.isValid) {
      validation.errors.push(...entryValidation.errors);
    }
  }

  // Validate Schedules data
  if (studentData.Schedules) {
    const scheduleValidation = validateScheduleData(studentData.Schedules);
    if (!scheduleValidation.isValid) {
      validation.warnings.push(...scheduleValidation.errors);
    }
  }

  return validation;
}

/**
 * Validates entry/withdrawal data
 * @param {Array} entryData - Entry/withdrawal data array
 * @returns {Object} Validation result
 */
function validateEntryWithdrawalData(entryData) {
  const validation = { isValid: true, errors: [] };

  if (!Array.isArray(entryData) || entryData.length === 0) {
    validation.isValid = false;
    validation.errors.push('Entry/withdrawal data is not a valid array or is empty');
    return validation;
  }

  const entryRecord = entryData[0];
  
  // Check for required entry date
  if (!entryRecord[COLUMN_NAMES.ENTRY_DATE]) {
    validation.isValid = false;
    validation.errors.push('Missing entry date');
  } else if (!isValidDate(entryRecord[COLUMN_NAMES.ENTRY_DATE])) {
    validation.isValid = false;
    validation.errors.push('Invalid entry date format');
  }

  // Check for student name
  if (!entryRecord[COLUMN_NAMES.STUDENT_NAME_FULL]) {
    validation.errors.push('Missing student name');
  }

  return validation;
}

/**
 * Validates schedule data
 * @param {Array} scheduleData - Schedule data array
 * @returns {Object} Validation result
 */
function validateScheduleData(scheduleData) {
  const validation = { isValid: true, errors: [] };

  if (!Array.isArray(scheduleData)) {
    validation.isValid = false;
    validation.errors.push('Schedule data is not an array');
    return validation;
  }

  if (scheduleData.length === 0) {
    validation.errors.push('No schedule data available');
    return validation;
  }

  // Check each schedule record
  scheduleData.forEach((schedule, index) => {
    if (!schedule[COLUMN_NAMES.COURSE_TITLE]) {
      validation.errors.push(`Schedule ${index}: Missing course title`);
    }
    
    if (!schedule[COLUMN_NAMES.TEACHER_NAME]) {
      validation.errors.push(`Schedule ${index}: Missing teacher name`);
    }
    
    if (!schedule[COLUMN_NAMES.PERIOD]) {
      validation.errors.push(`Schedule ${index}: Missing period information`);
    }
  });

  return validation;
}

/**
 * Validates teacher input structure
 * @param {Object} teacherInput - Teacher input object
 * @returns {Object} Validation result
 */
function validateTeacherInput(teacherInput) {
  const validation = { isValid: true, errors: [] };

  if (!teacherInput || typeof teacherInput !== 'object') {
    validation.isValid = false;
    validation.errors.push('Teacher input is not a valid object');
    return validation;
  }

  // Check for required periods
  const requiredPeriods = [
    PERIODS.FIRST, PERIODS.SECOND, PERIODS.THIRD, PERIODS.FOURTH,
    PERIODS.FIFTH, PERIODS.SIXTH, PERIODS.SEVENTH, PERIODS.EIGHTH,
    PERIODS.SPECIAL_ED
  ];

  requiredPeriods.forEach(period => {
    if (!teacherInput[period]) {
      validation.errors.push(`Missing ${period} period data`);
    } else {
      // Validate period structure
      const periodData = teacherInput[period];
      if (period !== PERIODS.SPECIAL_ED) {
        if (!periodData[COLUMN_NAMES.COURSE_TITLE]) {
          validation.errors.push(`${period}: Missing course title`);
        }
      }
    }
  });

  return validation;
}

/**
 * Validates data integrity across the entire dataset
 * @param {Map} studentDataMap - Complete student data map
 * @returns {Object} Overall validation summary
 */
function validateDatasetIntegrity(studentDataMap) {
  const summary = {
    totalStudents: studentDataMap.size,
    validStudents: 0,
    studentsWithErrors: 0,
    studentsWithWarnings: 0,
    commonIssues: {},
    detailedResults: []
  };

  studentDataMap.forEach((studentData, studentId) => {
    const validation = validateStudentData(studentData, studentId);
    
    if (validation.isValid && validation.errors.length === 0) {
      summary.validStudents++;
    }
    
    if (validation.errors.length > 0) {
      summary.studentsWithErrors++;
    }
    
    if (validation.warnings.length > 0) {
      summary.studentsWithWarnings++;
    }

    // Track common issues
    [...validation.errors, ...validation.warnings].forEach(issue => {
      summary.commonIssues[issue] = (summary.commonIssues[issue] || 0) + 1;
    });

    summary.detailedResults.push(validation);
  });

  return summary;
}

/**
 * Logs validation summary to console
 * @param {Object} validationSummary - Validation summary object
 */
function logValidationSummary(validationSummary) {
  console.log('=== Data Validation Summary ===');
  console.log(`Total Students: ${validationSummary.totalStudents}`);
  console.log(`Valid Students: ${validationSummary.validStudents}`);
  console.log(`Students with Errors: ${validationSummary.studentsWithErrors}`);
  console.log(`Students with Warnings: ${validationSummary.studentsWithWarnings}`);
  
  if (Object.keys(validationSummary.commonIssues).length > 0) {
    console.log('\nCommon Issues:');
    Object.entries(validationSummary.commonIssues)
      .sort(([,a], [,b]) => b - a)
      .forEach(([issue, count]) => {
        console.log(`  ${issue}: ${count} occurrences`);
      });
  }
  
  console.log('===============================');
}

/**
 * Validates and cleans student ID format
 * @param {*} studentId - Student ID to validate
 * @returns {number|null} Cleaned student ID or null if invalid
 */
function validateAndCleanStudentId(studentId) {
  // Handle numeric IDs
  if (typeof studentId === 'number') {
    return studentId > 0 ? studentId : null;
  }
  
  // Handle string IDs
  if (typeof studentId === 'string') {
    const cleaned = studentId.trim();
    const numeric = Number(cleaned);
    
    if (!isNaN(numeric) && numeric > 0) {
      return numeric;
    }
    
    // Try to extract from format like "Name (123456)"
    const match = cleaned.match(/\((\d{6})\)/);
    if (match) {
      return Number(match[1]);
    }
  }
  
  return null;
}

/**
 * Utility class for validation operations in the NAHS system.
 * 
 * This class wraps the standalone validation utility functions to provide
 * a consistent object-oriented interface for validation operations.
 * 
 * @class ValidationUtils
 * @memberof Utils
 * 
 * @example
 * const validationUtils = new ValidationUtils();
 * const result = validationUtils.validateStudentData(studentData, studentId);
 * 
 * @since 2.0.0
 */
class ValidationUtils {
  
  /**
   * Creates a new ValidationUtils instance.
   * @constructor
   */
  constructor() {
    // No initialization needed - all methods are wrappers around standalone functions
  }

  /**
   * Validates student data completeness and integrity.
   * @param {Object} studentData - Student data object to validate
   * @param {number} studentId - Student ID for logging
   * @returns {Object} Validation result with details
   */
  validateStudentData(studentData, studentId) {
    return validateStudentData(studentData, studentId);
  }

  /**
   * Validates entry/withdrawal data structure.
   * @param {Array} entryWithdrawalData - Entry/withdrawal data array
   * @returns {Object} Validation result
   */
  validateEntryWithdrawalData(entryWithdrawalData) {
    return validateEntryWithdrawalData(entryWithdrawalData);
  }

  /**
   * Validates teacher input data.
   * @param {Array} teacherInputData - Teacher input data array
   * @returns {Object} Validation result
   */
  validateTeacherInputData(teacherInputData) {
    return validateTeacherInputData(teacherInputData);
  }

  /**
   * Validates required fields in an object.
   * @param {Object} data - Data object to validate
   * @param {Array<string>} requiredFields - Array of required field names
   * @returns {Object} Validation result
   */
  validateRequiredFields(data, requiredFields) {
    return validateRequiredFields(data, requiredFields);
  }

  /**
   * Validates email format.
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email format
   */
  validateEmail(email) {
    return validateEmail(email);
  }

  /**
   * Validates student ID format.
   * @param {string|number} studentId - Student ID to validate
   * @returns {boolean} True if valid student ID
   */
  validateStudentId(studentId) {
    return validateStudentId(studentId);
  }

  /**
   * Validates grade value.
   * @param {string|number} grade - Grade to validate
   * @returns {boolean} True if valid grade
   */
  validateGrade(grade) {
    return validateGrade(grade);
  }

  /**
   * Extracts student ID from text.
   * @param {string} text - Text that may contain a student ID
   * @returns {number|null} Extracted student ID or null
   */
  extractStudentIdFromText(text) {
    return extractStudentIdFromText(text);
  }
}
