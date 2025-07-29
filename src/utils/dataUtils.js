/**
 * Utility functions for data manipulation and validation
 * 
 * Common helper functions used throughout the application
 * for data processing and validation.
 */

/**
 * Safely extracts a student ID from various formats
 * @param {string|number} input - The input containing student ID
 * @returns {number|null} The extracted student ID or null if not found
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
