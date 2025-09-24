/**
 * @fileoverview Tentative Sheet Writer for the NAHS system.
 * 
 * This module provides specialized functionality for writing processed student
 * data to the TENTATIVE-Version2 sheet. It replaces the original 701-line
 * writeToTENTATIVEVersion2Sheet function with a modular, maintainable approach
 * that handles data formatting, sheet writing, and color preservation.
 * 
 * The writer coordinates with multiple processors to merge data from various
 * sources, format it properly, and write it efficiently to the output sheet.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof Writers
 */

/**
 * Handles writing processed student data to the TENTATIVE-Version2 sheet.
 * 
 * This class replaces the original massive 701-line writeToTENTATIVEVersion2Sheet
 * function with a modular, maintainable approach. It coordinates data merging,
 * row building, and sheet writing while preserving user workflow colors and
 * handling error conditions gracefully.
 * 
 * **Key Features:**
 * - **Data Integration**: Merges data from multiple sources into cohesive output
 * - **Efficient Writing**: Batch operations for optimal Google Sheets performance
 * - **Color Preservation**: Maintains user workflow tracking through row colors
 * - **Error Recovery**: Graceful handling of data and writing issues
 * - **Modular Design**: Uses specialized builders and processors
 * 
 * @class TentativeSheetWriter
 * @extends BaseSheetWriter
 * @memberof Writers
 * 
 * @example
 * // Basic usage for writing student data
 * const writer = new TentativeSheetWriter();
 * const studentDataMap = loadAllStudentData();
 * writer.writeStudentData(studentDataMap);
 * 
 * @example
 * // Advanced usage with error handling
 * const writer = new TentativeSheetWriter();
 * try {
 *   const result = writer.writeStudentData(processedData);
 *   console.log(`Successfully wrote ${result.rowsWritten} student records`);
 * } catch (error) {
 *   console.error('Failed to write student data:', error.message);
 * }
 * 
 * @since 2.0.0
 */
class TentativeSheetWriter extends BaseSheetWriter {
  /**
   * Creates a new TentativeSheetWriter instance.
   * 
   * Initializes the writer with all necessary components including the row builder,
   * student data merger, and teacher input processor. Sets up the target sheet
   * as TENTATIVE-Version2 and prepares for coordinated data writing operations.
   * 
   * @constructor
   * @memberof TentativeSheetWriter
   * 
   * @example
   * // Create writer instance
   * const writer = new TentativeSheetWriter();
   * // All components are initialized and ready for data writing
   * 
   * @since 2.0.0
   */
  constructor() {
    super(SHEET_NAMES.TENTATIVE_V2);
    this.rowBuilder = new TentativeRowBuilder();
    this.studentDataMerger = new StudentDataMerger();
    this.teacherInputProcessor = new TeacherInputProcessor();
  }

  /**
   * Main entry point - writes all student data to the TENTATIVE-Version2 sheet.
   * @param {Map} activeStudentDataMap - Map of student data keyed by student ID
   */
  writeStudentData(activeStudentDataMap) {
    try {
      console.log(`Starting to write data for ${activeStudentDataMap.size} students`);
      
      // Validate input
      if (!this._validateInput(activeStudentDataMap)) {
        return;
      }

      // Prepare output data
      const outputData = this._buildOutputData(activeStudentDataMap);
      
      // Validate data structure
      this.validateDataStructure(outputData);
      
      // Sort data by last name, then first name
      const sortedData = this.sortData(outputData, [
        { column: 1, ascending: true },  // Last name
        { column: 2, ascending: true }   // First name
      ]);

      // Write to sheet
      this._writeToSheet(sortedData);

      // Apply formatting and borders
      this._applyPostWriteFormatting();

      console.log(`Successfully wrote ${sortedData.length} student records to TENTATIVE-Version2 sheet`);

    } catch (error) {
      console.error('Error in writeStudentData:', error);
      throw new Error(`Failed to write student data: ${error.message}`);
    }
  }

  /**
   * Validates the input data map.
   * @param {Map} activeStudentDataMap - The input data to validate
   * @returns {boolean} True if valid, false otherwise
   */
  _validateInput(activeStudentDataMap) {
    if (!activeStudentDataMap) {
      console.error("activeStudentDataMap is undefined");
      return false;
    }

    if (typeof activeStudentDataMap !== "object" || !("forEach" in activeStudentDataMap)) {
      console.error("activeStudentDataMap is not iterable:", activeStudentDataMap);
      return false;
    }

    if (activeStudentDataMap.size === 0) {
      console.warn("activeStudentDataMap is empty - no data to write");
      return false;
    }

    return true;
  }

  /**
   * Builds the complete output data array from the student data map.
   * @param {Map} activeStudentDataMap - Map of student data
   * @returns {Array<Array>} 2D array of output data
   */
  _buildOutputData(activeStudentDataMap) {
    const outputData = [];

    activeStudentDataMap.forEach((studentData, studentId) => {
      try {
        // Process teacher input for this student
        const teacherInput = this.teacherInputProcessor.processTeacherInput(
          studentId,
          studentData
        );

        // Build the row data
        const rowData = this.rowBuilder.buildStudentRow(
          studentId,
          studentData,
          teacherInput
        );

        outputData.push(rowData);

      } catch (error) {
        console.error(`Error processing student ${studentId}:`, error);
        
        // Add an error row to maintain data integrity
        const errorRow = this._createErrorRow(studentId, error.message);
        outputData.push(errorRow);
      }
    });

    return outputData;
  }

  /**
   * Writes the data to the sheet and clears existing data.
   * @param {Array<Array>} data - The data to write
   */
  _writeToSheet(data) {
    // Clear existing data from row 2 onwards
    this.clearExistingData(2);

    // Write new data
    if (data.length > 0) {
      this.writeData(data, 2, 1);
    } else {
      console.warn('No data to write to sheet');
    }
  }

  /**
   * Applies post-write formatting including borders.
   */
  _applyPostWriteFormatting() {
    try {
      // Apply thick borders using the existing function
      if (typeof addThickBordersToSheets === 'function') {
        addThickBordersToSheets();
      } else {
        console.warn('addThickBordersToSheets function not available');
      }

      // Apply additional formatting to the data range
      const sheet = this.getSheet();
      const lastRow = sheet.getLastRow();
      
      if (lastRow > 1) {
        const dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
        this.applyFormatting(dataRange);
      }

    } catch (error) {
      console.error('Error applying post-write formatting:', error);
      // Don't throw - formatting errors shouldn't break the data write
    }
  }

  /**
   * Applies specific formatting for the TENTATIVE-Version2 sheet.
   * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to format
   */
  applyFormatting(range) {
    super.applyFormatting(range);
    
    // Additional formatting specific to TENTATIVE-Version2 sheet
    try {
      range.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
      
      // Set font size for better readability
      range.setFontSize(10);
      
      // Set vertical alignment
      range.setVerticalAlignment('top');

      // Add checkboxes in column BX
      this._ensureCheckboxesInColumnBX();
      
    } catch (error) {
      console.error('Error applying specific formatting:', error);
    }
  }

  /**
   * Ensures checkboxes are present in column BX (column 76).
   * This method creates checkboxes for all data rows in the TENTATIVE-Version2 sheet.
   * @private
   */
  _ensureCheckboxesInColumnBX() {
    try {
      const sheet = this.getSheet();
      
      // Use the utility function for checkbox creation
      const success = ensureCheckboxesInColumn(sheet, 76, 'BX');
      
      if (success) {
        console.log('Successfully added checkboxes to column BX');
      } else {
        console.warn('Failed to add checkboxes to column BX');
      }
    } catch (error) {
      console.error('Error in _ensureCheckboxesInColumnBX:', error);
      // Don't throw - checkbox errors shouldn't break the data write
    }
  }

  /**
   * Creates an error row when student processing fails.
   * @param {string} studentId - The student ID
   * @param {string} errorMessage - The error message
   * @returns {Array} Error row data
   */
  _createErrorRow(studentId, errorMessage) {
    const errorRow = new Array(60).fill("");  // Assuming ~60 columns
    const dateUtils = new DateUtils();
    
    errorRow[0] = dateUtils.formatToMMDDYYYY(new Date());
    errorRow[1] = "DATA_ERROR";
    errorRow[2] = "DATA_ERROR";
    errorRow[3] = studentId;
    errorRow[4] = `Processing Error: ${errorMessage}`;
    
    return errorRow;
  }

  /**
   * Gets statistics about the written data.
   * @param {Map} activeStudentDataMap - The original data map
   * @returns {Object} Statistics object
   */
  getWriteStatistics(activeStudentDataMap) {
    const sheet = this.getSheet();
    const totalRowsWritten = sheet.getLastRow() - 1; // Subtract header row
    
    return {
      studentsProcessed: activeStudentDataMap.size,
      rowsWritten: totalRowsWritten,
      sheetName: this.sheetName,
      writeTimestamp: new Date(),
      hasErrors: totalRowsWritten !== activeStudentDataMap.size
    };
  }
}
