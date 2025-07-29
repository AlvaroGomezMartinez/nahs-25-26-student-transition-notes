/**
 * Utility functions for date operations
 * 
 * Centralizes all date-related functionality to ensure consistency
 * and easier maintenance.
 */

/**
 * Formats a date to MM/DD/YYYY format
 * @param {Date|string} date - The date to format
 * @returns {string|null} Formatted date string or null if invalid
 */
function formatDateToMMDDYYYY(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null; // Check for invalid date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(d.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

/**
 * Checks if a date falls on a weekend
 * @param {Date} date - The date to check
 * @returns {boolean} True if weekend, false otherwise
 */
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Checks if a date is a holiday
 * @param {Date} date - The date to check
 * @param {Array} holidays - Array of holiday date strings
 * @returns {boolean} True if holiday, false otherwise
 */
function isHoliday(date, holidays) {
  const formattedDate = formatDateForHolidays(date);
  return holidays.includes(formattedDate);
}

/**
 * Formats a date for holiday comparison (YYYY-MM-DD)
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
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
