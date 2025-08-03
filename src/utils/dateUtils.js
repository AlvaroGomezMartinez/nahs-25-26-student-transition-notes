/**
 * @fileoverview Utility functions for date operations in the NAHS system.
 * 
 * This module centralizes all date-related functionality to ensure consistency
 * across the system and provide a single source of truth for date formatting,
 * validation, and business logic operations.
 * 
 * All functions handle edge cases such as:
 * - Invalid date inputs
 * - Timezone considerations  
 * - Leap year calculations
 * - Holiday and weekend detection
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * Formats a date to MM/DD/YYYY format with proper error handling.
 * 
 * This function converts various date inputs (Date objects, date strings, 
 * timestamps) into a standardized MM/DD/YYYY string format commonly used
 * throughout the NAHS system for display and storage purposes.
 * 
 * @function formatDateToMMDDYYYY
 * @memberof DateUtils
 * 
 * @param {Date|string|number} date - The date to format. Accepts:
 *   - Date object
 *   - ISO date string (e.g., "2024-01-15T10:30:00Z")
 *   - Date string (e.g., "January 15, 2024")
 *   - Unix timestamp (number)
 * 
 * @returns {string|null} Formatted date string in MM/DD/YYYY format, 
 *   or null if the input date is invalid
 * 
 * @example
 * // Date object
 * formatDateToMMDDYYYY(new Date(2024, 0, 15)); // "01/15/2024"
 * 
 * @example
 * // ISO string
 * formatDateToMMDDYYYY("2024-01-15T10:30:00Z"); // "01/15/2024"
 * 
 * @example
 * // Invalid date
 * formatDateToMMDDYYYY("invalid date"); // null
 * 
 * @example
 * // Error handling
 * const formatted = formatDateToMMDDYYYY(userInput);
 * if (formatted === null) {
 *   console.error('Invalid date provided');
 * } else {
 *   console.log(`Formatted date: ${formatted}`);
 * }
 * 
 * @since 2.0.0
 */
function formatDateToMMDDYYYY(date) {
  if (date === null || date === undefined) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null; // Check for invalid date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(d.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

/**
 * Formats a date according to the specified format string.
 * 
 * This function provides flexible date formatting to support various
 * display requirements throughout the NAHS system. It handles common
 * format patterns used in reports, emails, and user interfaces.
 * 
 * @function formatDate
 * @memberof DateUtils
 * 
 * @param {Date|string|number} date - The date to format
 * @param {string} format - Format string using patterns:
 *   - yyyy: 4-digit year
 *   - MM: 2-digit month (01-12)
 *   - dd: 2-digit day (01-31)
 *   - MM/dd/yyyy: US date format
 *   - yyyy-MM-dd: ISO date format
 *   - MM-dd-yyyy: Alternative US format
 * 
 * @returns {string|null} Formatted date string or null if invalid
 * 
 * @example
 * formatDate(new Date(2024, 0, 15), 'MM/dd/yyyy'); // "01/15/2024"
 * formatDate(new Date(2024, 0, 15), 'yyyy-MM-dd'); // "2024-01-15"
 * formatDate(new Date(2024, 0, 15), 'MM-dd-yyyy'); // "01-15-2024"
 */
function formatDate(date, format) {
  if (date === null || date === undefined) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  
  // Replace format patterns
  return format
    .replace(/yyyy/g, year)
    .replace(/MM/g, month)
    .replace(/dd/g, day);
}

/**
 * Determines if a given date falls on a weekend (Saturday or Sunday).
 * 
 * This function is commonly used in business logic to exclude weekends
 * from calculations such as school days, attendance tracking, and
 * deadline computations.
 * 
 * @function isWeekend
 * @memberof DateUtils
 * 
 * @param {Date} date - The date to check. Must be a valid Date object.
 * 
 * @returns {boolean} True if the date is Saturday (6) or Sunday (0), false otherwise
 * 
 * @throws {TypeError} Throws if date parameter is not a Date object
 * 
 * @example
 * // Saturday
 * isWeekend(new Date(2024, 0, 13)); // true (Saturday)
 * 
 * @example  
 * // Weekday
 * isWeekend(new Date(2024, 0, 15)); // false (Monday)
 * 
 * @example
 * // Use in business logic
 * if (!isWeekend(targetDate)) {
 *   addToSchoolDayCount(targetDate);
 * }
 * 
 * @see {@link isHoliday} For checking school holidays
 * @see {@link isSchoolDay} For combined weekend/holiday checking
 * 
 * @since 2.0.0
 */
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Determines if a given date is a school holiday.
 * 
 * This function checks if a date matches any of the predefined school
 * holidays. It's used for attendance calculations, deadline adjustments,
 * and determining valid school days for various system operations.
 * 
 * @function isHoliday
 * @memberof DateUtils
 * 
 * @param {Date} date - The date to check against the holiday list
 * @param {Array<string>} holidays - Array of holiday date strings in YYYY-MM-DD format
 * 
 * @returns {boolean} True if the date is found in the holidays array, false otherwise
 * 
 * @example
 * // Check single date
 * const holidays = ['2024-12-25', '2024-01-01', '2024-07-04'];
 * isHoliday(new Date(2024, 11, 25), holidays); // true (Christmas)
 * 
 * @example
 * // Use with school day calculations
 * if (isHoliday(date, schoolHolidays)) {
 *   console.log('School is closed on this date');
 * }
 * 
 * @example
 * // Combined with weekend check
 * function isSchoolDay(date, holidays) {
 *   return !isWeekend(date) && !isHoliday(date, holidays);
 * }
 * 
 * @see {@link formatDateForHolidays} For the date formatting used in comparison
 * @see {@link isWeekend} For weekend checking
 * 
 * @since 2.0.0
 */
function isHoliday(date, holidays) {
  if (!holidays || !Array.isArray(holidays)) {
    return false;
  }
  const formattedDate = formatDateForHolidays(date);
  return holidays.includes(formattedDate);
}

/**
 * Formats a date to YYYY-MM-DD format for holiday comparison.
 * 
 * This function provides the standardized date format used for holiday
 * comparisons throughout the system. It ensures consistent formatting
 * when checking dates against the holiday list.
 * 
 * @function formatDateForHolidays
 * @memberof DateUtils
 * @private
 * 
 * @param {Date} date - The date to format. Must be a valid Date object.
 * 
 * @returns {string} Formatted date string in YYYY-MM-DD format
 * 
 * @example
 * // Format for holiday comparison
 * formatDateForHolidays(new Date(2024, 0, 15)); // "2024-01-15"
 * 
 * @example
 * // Internal usage in isHoliday function
 * const formattedDate = formatDateForHolidays(date);
 * return holidays.includes(formattedDate);
 * 
 * @see {@link isHoliday} Primary consumer of this function
 * 
 * @since 2.0.0
 */
function formatDateForHolidays(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Adds a specified number of work days to a date, excluding weekends and holidays
 * @param {Date} startDate - The starting date
 * @param {number} numWorkdays - Number of work days to add
 * @param {Array} holidays - Array of holiday date strings
 * @returns {Date} The calculated end date
 */
function addWorkdays(startDate, numWorkdays, holidays) {
  let currentDate = new Date(startDate);
  let workdaysAdded = 0;

  while (workdaysAdded < numWorkdays) {
    currentDate.setDate(currentDate.getDate() + 1);
    
    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      workdaysAdded++;
    }
  }

  return currentDate;
}

/**
 * Calculates the projected exit date based on placement days
 * @param {Date} startDate - The start date
 * @param {number} placementDays - Number of placement days
 * @param {Array} holidays - Array of holiday date strings
 * @returns {Date} The projected exit date
 */
function calculateProjectedExit(startDate, placementDays, holidays) {
  return addWorkdays(startDate, placementDays, holidays);
}

/**
 * Calculates days remaining in placement
 * @param {Date} startDate - The start date
 * @param {number} placementDays - Total placement days
 * @param {Array} holidays - Array of holiday date strings
 * @returns {number} Days remaining
 */
function calculateDaysLeft(startDate, placementDays, holidays) {
  const today = new Date();
  const projectedExit = calculateProjectedExit(startDate, placementDays, holidays);
  
  if (today >= projectedExit) {
    return 0; // Placement period has ended
  }
  
  // Calculate business days between today and projected exit
  return calculateBusinessDays(today, projectedExit, holidays);
}

/**
 * Calculates business days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Array} holidays - Array of holiday date strings
 * @returns {number} Number of business days
 */
function calculateBusinessDays(startDate, endDate, holidays) {
  let count = 0;
  let currentDate = new Date(startDate);
  
  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 1);
    
    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidays)) {
      count++;
    }
  }
  
  return count;
}

/**
 * Validates if a date string or Date object is valid
 * @param {Date|string} date - The date to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidDate(date) {
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * Utility class for date operations in the NAHS system.
 * 
 * This class wraps the standalone date utility functions to provide
 * a consistent object-oriented interface for date operations.
 * 
 * @class DateUtils
 * @memberof Utils
 * 
 * @example
 * const dateUtils = new DateUtils();
 * const formatted = dateUtils.formatToMMDDYYYY(new Date());
 * 
 * @since 2.0.0
 */
class DateUtils {
  
  /**
   * Creates a new DateUtils instance.
   * @constructor
   */
  constructor() {
    // No initialization needed - all methods are wrappers around standalone functions
  }

  /**
   * Formats a date to MM/DD/YYYY format.
   * @param {Date|string|number} date - The date to format
   * @returns {string|null} Formatted date string or null if invalid
   */
  formatToMMDDYYYY(date) {
    return formatDateToMMDDYYYY(date);
  }

  /**
   * Formats a date according to the specified format string.
   * @param {Date|string|number} date - The date to format
   * @param {string} format - Format string (yyyy-MM-dd, MM/dd/yyyy, MM-dd-yyyy)
   * @returns {string|null} Formatted date string or null if invalid
   */
  formatDate(date, format) {
    return formatDate(date, format);
  }

  /**
   * Determines if a given date falls on a weekend.
   * @param {Date} date - The date to check
   * @returns {boolean} True if weekend, false otherwise
   */
  isWeekend(date) {
    return isWeekend(date);
  }

  /**
   * Determines if a given date is a holiday.
   * @param {Date} date - The date to check
   * @param {Array<string>} holidays - Array of holiday date strings in YYYY-MM-DD format
   * @returns {boolean} True if holiday, false otherwise
   */
  isHoliday(date, holidays) {
    return isHoliday(date, holidays);
  }

  /**
   * Adds work days to a date, excluding weekends and holidays.
   * @param {Date} startDate - The starting date
   * @param {number} numWorkdays - Number of work days to add
   * @param {Array<string>} holidays - Array of holiday date strings
   * @returns {Date} The calculated end date
   */
  addWorkdays(startDate, numWorkdays, holidays) {
    return addWorkdays(startDate, numWorkdays, holidays);
  }

  /**
   * Validates if a date is valid.
   * @param {Date|string} date - The date to validate
   * @returns {boolean} True if valid, false otherwise
   */
  isValidDate(date) {
    return isValidDate(date);
  }

  /**
   * Calculates the projected exit date based on placement days.
   * @param {Date} startDate - The start date
   * @param {number} placementDays - Number of placement days
   * @param {Array<string>} holidays - Array of holiday date strings
   * @returns {Date} The projected exit date
   */
  calculateProjectedExit(startDate, placementDays, holidays) {
    return calculateProjectedExit(startDate, placementDays, holidays);
  }

  /**
   * Calculates days remaining in placement.
   * @param {Date} startDate - The start date
   * @param {number} placementDays - Total placement days
   * @param {Array<string>} holidays - Array of holiday date strings
   * @returns {number} Days remaining
   */
  calculateDaysLeft(startDate, placementDays, holidays) {
    return calculateDaysLeft(startDate, placementDays, holidays);
  }

  /**
   * Calculates business days between two dates.
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Array<string>} holidays - Array of holiday date strings
   * @returns {number} Number of business days
   */
  calculateBusinessDays(startDate, endDate, holidays) {
    return calculateBusinessDays(startDate, endDate, holidays);
  }
}
