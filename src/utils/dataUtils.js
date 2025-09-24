/**
 * @fileoverview Data Utility Functions for the NAHS system.
 * 
 * This module provides essential utility functions for data manipulation,
 * validation, and processing throughout the NAHS Student Transition Notes
 * system. It includes functions for student ID extraction, data structure
 * manipulation, and common data operations used across multiple components.
 * 
 * These utilities ensure consistent data handling patterns and provide
 * reliable helper functions for complex data processing workflows.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof Utils
 */

/**
 * Safely extracts a student ID from various input formats.
 * 
 * This utility handles the different ways student IDs appear throughout
 * the system, including numeric values, strings, and formatted text
 * like "Student Name (123456)". It provides consistent ID extraction
 * across all data sources and ensures reliable student identification.
 * 
 * @function extractStudentId
 * @memberof Utils.DataUtils
 * 
 * @param {string|number} input - The input containing student ID in various formats
 * @returns {number|null} The extracted student ID as a number, or null if not found
 * 
 * @example
 * // Extract from formatted string
 * const id1 = extractStudentId("John Doe (123456)");
 * console.log(id1); // 123456
 * 
 * @example
 * // Handle different input types
 * const id2 = extractStudentId(123456);     // 123456
 * const id3 = extractStudentId("123456");   // 123456  
 * const id4 = extractStudentId("invalid");  // null
 * const id5 = extractStudentId("");         // null
 * 
 * @since 2.0.0
 */
function extractStudentId(input) {
  if (typeof input === 'number') {
    return input;
  }
  
  if (typeof input === 'string') {
    // Handle format like "Student Name (123456)"
    const match = input.match(/\((\d{6})\)/);
    if (match) {
      return Number(match[1]);
    }
    
    // Handle direct number string
    const directNumber = Number(input);
    if (!isNaN(directNumber) && directNumber > 0) {
      return directNumber;
    }
  }
  
  return null;
}

/**
 * Safely gets a nested property from an object
 * @param {Object} obj - The object to search
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if property not found
 * @returns {*} The property value or default value
 */
function getNestedProperty(obj, path, defaultValue = null) {
  return path.split('.').reduce((current, key) => {
    return (current && current[key] !== undefined) ? current[key] : defaultValue;
  }, obj);
}

/**
 * Checks if a value contains "504" (for special education status)
 * @param {string} value - The value to check
 * @returns {string} "Yes" if contains 504, empty string otherwise
 */
function contains504(value) {
  return value && value.toString().includes("504") ? "Yes" : "";
}

/**
 * Checks if a value contains "ESL" (English as Second Language)
 * @param {string} value - The value to check
 * @returns {string} "Yes" if contains ESL, empty string otherwise
 */
function containsESL(value) {
  return value && value.toString().includes("ESL") ? "Yes" : "";
}

/**
 * Converts period text to number format
 * @param {string} period - Period text (e.g., "1st", "2nd")
 * @returns {number} The period number
 */
function periodToNumber(period) {
  const periodMap = {
    "1st": 1, "2nd": 2, "3rd": 3, "4th": 4,
    "5th": 5, "6th": 6, "7th": 7, "8th": 8
  };
  return periodMap[period] || 0;
}

/**
 * Flattens a nested array structure
 * @param {Array} arr - The array to flatten
 * @returns {Array} Flattened array
 */
function flattenArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
}

/**
 * Validates required fields in an object
 * @param {Object} obj - Object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and missing fields
 */
function validateRequiredFields(obj, requiredFields) {
  const missing = requiredFields.filter(field => !obj || obj[field] === undefined || obj[field] === null || obj[field] === '');
  
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
}

/**
 * Safely converts a value to string, handling null/undefined
 * @param {*} value - Value to convert
 * @param {string} defaultValue - Default value if conversion fails
 * @returns {string} String representation of value
 */
function safeToString(value, defaultValue = '') {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirstLetter(str) {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Creates a deep copy of an object
 * @param {*} obj - Object to clone
 * @returns {*} Deep copy of the object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

/**
 * Removes empty or null values from an array
 * @param {Array} arr - Array to clean
 * @returns {Array} Cleaned array
 */
function removeEmptyValues(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(item => item !== null && item !== undefined && item !== '');
}

/**
 * Utility class for data operations in the NAHS system.
 * 
 * This class wraps the standalone data utility functions to provide
 * a consistent object-oriented interface for data operations.
 * 
 * @class DataUtils
 * @memberof Utils
 * 
 * @example
 * const dataUtils = new DataUtils();
 * const studentId = dataUtils.extractStudentId("John Doe (123456)");
 * 
 * @since 2.0.0
 */
class DataUtils {
  
  /**
   * Creates a new DataUtils instance.
   * @constructor
   */
  constructor() {
    // No initialization needed - all methods are wrappers around standalone functions
  }

  /**
   * Safely extracts a student ID from various formats.
   * 
   * This utility handles the different ways student IDs appear throughout
   * the system, including numeric values, strings, and formatted text
   * like "Student Name (123456)". It provides consistent ID extraction
   * across all data sources.
   * 
   * @function extractStudentId
   * @memberof Utils.DataUtils
   * 
   * @param {string|number} input - The input containing student ID in various formats
   * @returns {number|null} The extracted student ID as a number, or null if not found
   * 
   * @example
   * // Extract from formatted string
   * const id1 = extractStudentId("John Doe (123456)");
   * console.log(id1); // 123456
   * 
   * @example
   * // Handle different input types
   * const id2 = extractStudentId(123456);     // 123456
   * const id3 = extractStudentId("123456");   // 123456
   * const id4 = extractStudentId("invalid");  // null
   * 
   * @since 2.0.0
   */
  extractStudentId(input) {
    return extractStudentId(input);
  }

  /**
   * Sanitizes data by removing unwanted characters and normalizing format.
   * @param {string} data - Data to sanitize
   * @returns {string} Sanitized data
   */
  sanitizeData(data) {
    return sanitizeData(data);
  }

  /**
   * Normalizes a student name to consistent format.
   * @param {string} name - Name to normalize
   * @returns {string} Normalized name
   */
  normalizeStudentName(name) {
    return normalizeStudentName(name);
  }

  /**
   * Safely gets a nested property from an object.
   * @param {Object} obj - Object to search
   * @param {string} path - Dot notation path (e.g., 'user.profile.name')
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Value at path or default value
   */
  getNestedProperty(obj, path, defaultValue) {
    return getNestedProperty(obj, path, defaultValue);
  }

  /**
   * Creates a deep clone of an object.
   * @param {*} obj - Object to clone
   * @returns {*} Deep cloned object
   */
  deepClone(obj) {
    return deepClone(obj);
  }

  /**
   * Removes empty or null values from an array.
   * @param {Array} arr - Array to clean
   * @returns {Array} Cleaned array
   */
  removeEmptyValues(arr) {
    return removeEmptyValues(arr);
  }
}

/**
 * Global instance of DataUtils for easy access
 * @type {DataUtils}
 */
const globalDataUtils = new DataUtils();

/**
 * Ensures checkboxes are present in a specific column of a sheet.
 * 
 * This utility function creates checkboxes for all data rows in the specified
 * column, ensuring that existing boolean values are preserved and non-boolean
 * values are converted to false (unchecked). This is commonly used for
 * tracking columns in various sheets.
 * 
 * @function ensureCheckboxesInColumn
 * @memberof Utils.DataUtils
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to modify
 * @param {number} columnNumber - The column number (1-based) where to add checkboxes
 * @param {string} [columnLetter] - Optional column letter for logging (e.g., "BX")
 * @returns {boolean} True if checkboxes were successfully created, false otherwise
 * 
 * @example
 * // Add checkboxes to column BX (column 76) in TENTATIVE-Version2 sheet
 * const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TENTATIVE-Version2');
 * const success = ensureCheckboxesInColumn(sheet, 76, 'BX');
 * if (success) {
 *   console.log('Checkboxes added successfully');
 * }
 * 
 * @since 2.0.0
 */
function ensureCheckboxesInColumn(sheet, columnNumber, columnLetter = null) {
  try {
    if (!sheet || typeof columnNumber !== 'number' || columnNumber < 1) {
      console.error('Invalid parameters for ensureCheckboxesInColumn');
      return false;
    }

    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      console.log(`No data rows found in sheet ${sheet.getName()} - skipping checkbox creation`);
      return true; // Not an error, just no data
    }

    // Process in chunks of 50 rows to prevent memory issues
    const CHUNK_SIZE = 50;
    const totalRows = lastRow - 1;  // Exclude header row
    let processedRows = 0;

    for (let startRow = 2; startRow <= lastRow; startRow += CHUNK_SIZE) {
      // Calculate the number of rows for this chunk
      const rowsInChunk = Math.min(CHUNK_SIZE, lastRow - startRow + 1);
      
      // Get the range for this chunk
      const range = sheet.getRange(startRow, columnNumber, rowsInChunk, 1);
      const values = range.getValues();
      
      // Ensure all cells have proper boolean values before adding checkboxes
      let changedValues = false;
      for (let i = 0; i < values.length; i++) {
        const currentValue = values[i][0];
        // Convert string 'TRUE'/'FALSE' to boolean if needed
        if (typeof currentValue === 'string') {
          const upperValue = currentValue.toUpperCase();
          if (upperValue === 'TRUE') {
            values[i][0] = true;
            changedValues = true;
          } else if (upperValue === 'FALSE') {
            values[i][0] = false;
            changedValues = true;
          }
        }
        // Set non-boolean/non-string values to false
        if (values[i][0] !== true && values[i][0] !== false) {
          values[i][0] = false;
          changedValues = true;
        }
      }
      
      // Set the values first if any were changed, then insert checkboxes
      if (changedValues) {
        range.setValues(values);
      }
      range.insertCheckboxes();
      
      processedRows += rowsInChunk;
      
      // Add a small delay every few chunks to prevent quota issues
      if (processedRows % (CHUNK_SIZE * 4) === 0) {
        Utilities.sleep(100);
      }
    }
    
    const columnDesc = columnLetter ? `column ${columnLetter} (${columnNumber})` : `column ${columnNumber}`;
    console.log(`Added checkboxes to ${columnDesc} for ${totalRows} rows in sheet ${sheet.getName()}`);
    return true;
    
  } catch (error) {
    const columnDesc = columnLetter ? `column ${columnLetter} (${columnNumber})` : `column ${columnNumber}`;
    console.error(`Error creating checkboxes in ${columnDesc}:`, error);
    return false;
  }
}

// Make commonly used functions globally available for Google Apps Script
// This ensures backward compatibility with existing code
// Only export functions that actually exist as standalone functions
if (typeof global !== 'undefined') {
  global.extractStudentId = extractStudentId;
  global.ensureCheckboxesInColumn = ensureCheckboxesInColumn;
  global.DataUtils = DataUtils;
  global.dataUtils = globalDataUtils;
} else if (typeof window !== 'undefined') {
  window.extractStudentId = extractStudentId;
  window.ensureCheckboxesInColumn = ensureCheckboxesInColumn;
  window.DataUtils = DataUtils;  
  window.dataUtils = globalDataUtils;
} else {
  // For Google Apps Script, functions are automatically global when declared
  // But we need to ensure they're accessible
  this.extractStudentId = extractStudentId;
  this.ensureCheckboxesInColumn = ensureCheckboxesInColumn;
  this.DataUtils = DataUtils;
  this.dataUtils = globalDataUtils;
}
