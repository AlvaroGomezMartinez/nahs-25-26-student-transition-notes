/**
 * Base class for all sheet writers.
 * Provides common functionality for writing data to Google Sheets.
 */
class BaseSheetWriter {
  constructor(sheetName) {
    this.sheetName = sheetName;
    this.sheet = null;
  }

  /**
   * Gets the sheet instance, creating it if it doesn't exist.
   * @returns {GoogleAppsScript.Spreadsheet.Sheet} The sheet instance
   */
  getSheet() {
    if (!this.sheet) {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      this.sheet = spreadsheet.getSheetByName(this.sheetName);
      
      if (!this.sheet) {
        throw new Error(`Sheet "${this.sheetName}" not found`);
      }
    }
    return this.sheet;
  }

  /**
   * Clears existing data from the sheet starting from a specific row.
   * @param {number} startRow - The row to start clearing from (1-based)
   */
  clearExistingData(startRow = 2) {
    const sheet = this.getSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow >= startRow) {
      const range = sheet.getRange(startRow, 1, lastRow - startRow + 1, sheet.getLastColumn());
      range.clear();
    }
  }

  /**
   * Writes data to the sheet starting from a specific row.
   * @param {Array<Array>} data - 2D array of data to write
   * @param {number} startRow - The row to start writing to (1-based)
   * @param {number} startColumn - The column to start writing to (1-based)
   */
  writeData(data, startRow = 2, startColumn = 1) {
    if (!data || data.length === 0) {
      console.warn(`No data to write to sheet "${this.sheetName}"`);
      return;
    }

    const sheet = this.getSheet();
    const range = sheet.getRange(startRow, startColumn, data.length, data[0].length);
    
    try {
      range.setValues(data);
      range.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
      console.log(`Successfully wrote ${data.length} rows to sheet "${this.sheetName}"`);
    } catch (error) {
      console.error(`Error writing data to sheet "${this.sheetName}":`, error);
      throw error;
    }
  }

  /**
   * Sorts data by specified columns.
   * @param {Array<Array>} data - The data to sort
   * @param {Array<{column: number, ascending: boolean}>} sortCriteria - Sort criteria
   * @returns {Array<Array>} Sorted data
   */
  sortData(data, sortCriteria) {
    if (!data || data.length === 0) return data;

    return data.sort((a, b) => {
      for (const criterion of sortCriteria) {
        const { column, ascending = true } = criterion;
        const aVal = a[column] || '';
        const bVal = b[column] || '';
        
        let comparison = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else {
          comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
        
        if (comparison !== 0) {
          return ascending ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  /**
   * Validates that all rows have the same number of columns.
   * @param {Array<Array>} data - The data to validate
   * @throws {Error} If data is inconsistent
   */
  validateDataStructure(data) {
    if (!data || data.length === 0) return;

    const expectedColumns = data[0].length;
    for (let i = 1; i < data.length; i++) {
      if (data[i].length !== expectedColumns) {
        throw new Error(
          `Data structure inconsistent: Row ${i} has ${data[i].length} columns, expected ${expectedColumns}`
        );
      }
    }
  }

  /**
   * Applies formatting to the written data.
   * Override this method in subclasses for specific formatting.
   * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to format
   */
  applyFormatting(range) {
    // Base implementation - can be overridden by subclasses
    range.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  }
}
