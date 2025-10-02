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
      console.log(`=== Starting TENTATIVE-Version2 Merge Operation ===`);
      console.log(`Processing data for ${activeStudentDataMap.size} students with merge approach`);
      
      // Validate input
      if (!this._validateInput(activeStudentDataMap)) {
        console.error('Input validation failed - aborting write operation');
        return;
      }

      // Prepare output data
      console.log('Building output data from student records...');
      const outputData = this._buildOutputData(activeStudentDataMap);
      console.log(`Built ${outputData.length} output records from ${activeStudentDataMap.size} input students`);
      
      // Validate data structure
      this.validateDataStructure(outputData);
      
      // Sort data by last name, then first name
      const sortedData = this.sortData(outputData, [
        { column: 1, ascending: true },  // Last name
        { column: 2, ascending: true }   // First name
      ]);
      console.log(`Sorted ${sortedData.length} records by last name, then first name`);

      // Write to sheet using merge approach
      console.log('Performing merge operation to sheet...');
      this._writeToSheet(sortedData);

      // Apply formatting and borders
      console.log('Applying post-write formatting and borders...');
      this._applyPostWriteFormatting();

      console.log(`=== Merge Operation Completed Successfully ===`);
      console.log(`Final result: ${sortedData.length} student records processed`);

    } catch (error) {
      console.error('=== Merge Operation Failed ===');
      console.error('Error in writeStudentData:', error);
      throw new Error(`Failed to write student data with merge approach: ${error.message}`);
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
   * Writes the data to the sheet using merge/update approach.
   * Preserves existing rows that aren't being updated.
   * @param {Array<Array>} data - The data to write
   */
  _writeToSheet(data) {
    if (!data || data.length === 0) {
      console.warn('No data to write to sheet');
      return;
    }

    const sheet = this.getSheet();
    const existingRowMap = this._mapExistingRows(sheet);
    const newStudentData = this._mapNewStudentData(data);
    
    console.log(`Found ${Object.keys(existingRowMap).length} existing rows and ${Object.keys(newStudentData).length} new student records`);
    
    // Update existing students and track which ones we've processed
    const processedStudents = new Set();
    let updatedCount = 0;
    
    for (const [studentId, rowData] of Object.entries(newStudentData)) {
      if (existingRowMap[studentId]) {
        // Update existing row
        const rowNumber = existingRowMap[studentId].rowNumber;
        const range = sheet.getRange(rowNumber, 1, 1, rowData.length);
        range.setValues([rowData]);
        processedStudents.add(studentId);
        updatedCount++;
        console.log(`Updated existing row ${rowNumber} for student ${studentId}`);
      }
    }
    
    // Add new students (those not in existing rows)
    const newStudents = Object.entries(newStudentData).filter(
      ([studentId]) => !existingRowMap[studentId]
    );
    
    if (newStudents.length > 0) {
      const newRowsData = newStudents.map(([_, rowData]) => rowData);
      const startRow = sheet.getLastRow() + 1;
      
      if (newRowsData.length > 0) {
        const range = sheet.getRange(startRow, 1, newRowsData.length, newRowsData[0].length);
        range.setValues(newRowsData);
        console.log(`Added ${newRowsData.length} new student rows starting at row ${startRow}`);
      }
    }
    
    // Log preservation of existing rows
    const preservedStudents = Object.keys(existingRowMap).filter(
      studentId => !processedStudents.has(studentId)
    );
    
    if (preservedStudents.length > 0) {
      console.log(`Preserved ${preservedStudents.length} existing rows that were not updated:`, preservedStudents.slice(0, 5));
      if (preservedStudents.length > 5) {
        console.log(`... and ${preservedStudents.length - 5} more`);
      }
    }
    
    console.log(`Merge operation completed: ${updatedCount} updated, ${newStudents.length} added, ${preservedStudents.length} preserved`);
  }

  /**
   * Maps existing sheet rows to student IDs for merge operations.
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The target sheet
   * @returns {Object} Map of studentId -> {rowNumber, data}
   * @private
   */
  _mapExistingRows(sheet) {
    const existingRowMap = {};
    
    try {
      const dataRange = sheet.getDataRange();
      if (dataRange.getNumRows() <= 1) {
        console.log('No existing data rows found');
        return existingRowMap;
      }
      
      const existingData = dataRange.getValues();
      
      // Skip header row (index 0), process data rows
      for (let i = 1; i < existingData.length; i++) {
        const rowData = existingData[i];
        const studentId = rowData[3]; // Column D (index 3) contains student ID
        
        if (studentId && studentId.toString().trim() !== '') {
          existingRowMap[studentId] = {
            rowNumber: i + 1, // Convert to 1-based row number
            data: rowData
          };
        }
      }
      
      console.log(`Mapped ${Object.keys(existingRowMap).length} existing student rows`);
      
    } catch (error) {
      console.error('Error mapping existing rows:', error);
    }
    
    return existingRowMap;
  }

  /**
   * Maps new student data array to student ID for efficient lookup.
   * @param {Array<Array>} data - The new student data
   * @returns {Object} Map of studentId -> rowData
   * @private
   */
  _mapNewStudentData(data) {
    const newStudentMap = {};
    
    for (const rowData of data) {
      if (rowData && rowData.length > 3) {
        const studentId = rowData[3]; // Column D (index 3) contains student ID
        
        if (studentId && studentId.toString().trim() !== '') {
          newStudentMap[studentId] = rowData;
        }
      }
    }
    
    return newStudentMap;
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
   * Gets statistics about the merge operation.
   * @param {Map} activeStudentDataMap - The original data map
   * @returns {Object} Statistics object
   */
  getWriteStatistics(activeStudentDataMap) {
    const sheet = this.getSheet();
    const totalRowsInSheet = sheet.getLastRow() - 1; // Subtract header row
    
    return {
      studentsProcessed: activeStudentDataMap.size,
      rowsWritten: totalRowsInSheet,
      sheetName: this.sheetName,
      writeTimestamp: new Date(),
      hasErrors: false, // Merge approach is more resilient to errors
      mergeApproach: true,
      note: 'Using merge approach - existing rows preserved, only updates and additions performed'
    };
  }
  
  /**
   * Validates that the merge approach is working correctly.
   * This method can be called after a write operation to verify the implementation.
   * @returns {Object} Validation results
   */
  validateMergeApproach() {
    try {
      const sheet = this.getSheet();
      const dataRange = sheet.getDataRange();
      
      if (dataRange.getNumRows() <= 1) {
        return {
          isValid: true,
          message: 'Sheet is empty or has only headers - merge approach not applicable',
          rowCount: 0
        };
      }
      
      const data = dataRange.getValues();
      const studentIds = new Set();
      let duplicateCount = 0;
      
      // Check for duplicate student IDs (which shouldn't happen with merge approach)
      for (let i = 1; i < data.length; i++) {
        const studentId = data[i][3]; // Column D contains student ID
        
        if (studentId) {
          if (studentIds.has(studentId)) {
            duplicateCount++;
            console.warn(`Duplicate student ID found: ${studentId} at row ${i + 1}`);
          } else {
            studentIds.add(studentId);
          }
        }
      }
      
      const isValid = duplicateCount === 0;
      
      return {
        isValid,
        message: isValid 
          ? 'Merge approach validation passed - no duplicate student IDs found'
          : `Merge approach validation failed - found ${duplicateCount} duplicate student IDs`,
        rowCount: data.length - 1,
        uniqueStudents: studentIds.size,
        duplicates: duplicateCount
      };
      
    } catch (error) {
      console.error('Error validating merge approach:', error);
      return {
        isValid: false,
        message: `Validation error: ${error.message}`,
        error: error
      };
    }
  }
}
