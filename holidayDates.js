/**
 * An array of holiday dates for NISD (Northside Independent School District).
 * This array is utilized to exclude non-school days from calculations
 * for determining the expected student exit date from DAEP (Disciplinary Alternative Education Program).
 *
 * Each date in the array is formatted as 'MM/DD/YYYY' and represents a school holiday or break
 * during which no classes are held.
 *
 * The holiday dates are retrieved from the NISDHolidayLibrary Google Apps Script library 
 * using the `getHolidayDates` method.
 * 
 * Script ID: 1OjYgamk2Sz8G1B4IOJKdWNM9-t6RwSJ_uq7nUJJO6h_7jSogTDT7CX10
 *
 * @constant {string[]} holidayDates - An array of strings, where each string is a holiday date
 * formatted as 'MM/DD/YYYY' representing days when school is not in session.
 */
const holidayDates = NISDHolidayLibrary.getHolidayDates();
