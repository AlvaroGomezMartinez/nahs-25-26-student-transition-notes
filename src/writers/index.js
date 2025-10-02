/**
 * @fileoverview Writers Index and Factory for the NAHS system.
 * 
 * This module serves as the central registry and factory for all sheet writer
 * classes in the NAHS system. It provides the main entry point for data writing
 * operations, maintains backward compatibility with the original writeToTENTATIVEVersion2Sheet
 * function, and coordinates all sheet writing activities.
 * 
 * The module replaces the original 701-line monolithic function with a modular,
 * maintainable architecture while preserving existing functionality.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2.0.0
 * @memberof Writers
 */

/**
 * Main function to write student data to the TENTATIVE-Version2 sheet.
 * 
 * This function replaces the original 701-line writeToTENTATIVEVersion2Sheet
 * function with a modular approach using specialized writer classes. It
 * maintains full backward compatibility while providing improved error
 * handling, performance, and maintainability.
 * 
 * **Key Improvements:**
 * - **Modular Design**: Uses specialized writer classes instead of monolithic function
 * - **Better Error Handling**: Comprehensive error reporting and recovery
 * - **Performance Optimization**: Efficient batch operations and memory management
 * - **Maintainability**: Clear separation of concerns and testable components
 * - **Statistics Tracking**: Detailed write operation metrics and reporting
 * 
 * @function writeToTENTATIVEVersion2Sheet
 * @memberof Writers
 * 
 * @param {Map<string, Object>} activeStudentDataMap - Map of processed student data keyed by student ID
 * @returns {Object} Write operation statistics and results including:
 *   - **rowsWritten**: Number of student records written
 *   - **executionTime**: Time taken for write operation
 *   - **errorsEncountered**: Count of non-fatal errors
 *   - **successRate**: Percentage of successful writes
 * 
 * @throws {Error} Throws if critical write operation fails
 * 
 * @example
 * // Basic usage (maintains backward compatibility)
 * const studentDataMap = loadAllStudentData();
 * const processedData = processStudentData(studentDataMap);
 * const writeStats = writeToTENTATIVEVersion2Sheet(processedData);
 * console.log(`Wrote ${writeStats.rowsWritten} student records`);
 * 
 * @example
 * // Advanced usage with error handling
 * try {
 *   const result = writeToTENTATIVEVersion2Sheet(studentData);
 *   if (result.successRate < 0.95) {
 *     console.warn(`Low success rate: ${result.successRate * 100}%`);
 *   }
 * } catch (error) {
 *   console.error('Critical write error:', error.message);
 * }
 * 
 * @see {@link TentativeSheetWriter} For the underlying writer implementation
 * @see {@link SheetWriterFactory} For writer instance management
 * 
 * @since 2.0.0
 */
function writeToTENTATIVEVersion2Sheet(activeStudentDataMap) {
  try {
    console.log(`Initializing merge-based write operation for ${activeStudentDataMap.size} students`);
    
    // Get the writer instance
    const writer = sheetWriterFactory.getWriter('tentative');
    console.log('TentativeSheetWriter instance obtained successfully');
    
    // Write the data using merge approach
    console.log('Starting merge-based data write...');
    writer.writeStudentData(activeStudentDataMap);
    
    // Get statistics
    const stats = writer.getWriteStatistics(activeStudentDataMap);
    
    console.log('=== Final Write Statistics ===');
    console.log(`Students processed: ${stats.studentsProcessed}`);
    console.log(`Total rows in sheet: ${stats.rowsWritten}`);
    console.log(`Sheet name: ${stats.sheetName}`);
    console.log(`Completed at: ${stats.writeTimestamp}`);
    console.log(`Has errors: ${stats.hasErrors ? 'Yes' : 'No'}`);
    
    return stats;
    
  } catch (error) {
    console.error('=== Write Operation Failed ===');
    console.error('Error in writeToTENTATIVEVersion2Sheet:', error);
    throw error;
  }
}

/**
 * Convenience function to write data using the new architecture.
 * Maintains backward compatibility with the original function signature.
 * 
 * @param {Map} updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap - The student data map
 */
function writeToTENTATIVEVersion2SheetLegacy(updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap) {
  console.warn('Using legacy function name. Consider updating to writeToTENTATIVEVersion2Sheet');
  return writeToTENTATIVEVersion2Sheet(updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap);
}

/**
 * Writes data to any sheet using the appropriate writer.
 * 
 * @param {string} writerType - The type of writer to use
 * @param {any} data - The data to write
 * @param {Object} options - Additional options for writing
 * @returns {Object} Write results
 */
function writeToSheet(writerType, data, options = {}) {
  try {
    const writer = sheetWriterFactory.getWriter(writerType);
    
    if (writer instanceof TentativeSheetWriter) {
      return writer.writeStudentData(data);
    } else {
      // For generic writers, use the base write method
      const { startRow = 2, startColumn = 1, clearExisting = true } = options;
      
      if (clearExisting) {
        writer.clearExistingData(startRow);
      }
      
      writer.writeData(data, startRow, startColumn);
      
      return {
        rowsWritten: Array.isArray(data) ? data.length : 0,
        sheetName: writer.sheetName,
        writeTimestamp: new Date()
      };
    }
  } catch (error) {
    console.error(`Error writing to sheet with writer type ${writerType}:`, error);
    throw error;
  }
}

/**
 * Builds a single row of data for testing or manual processing.
 * 
 * @param {string} studentId - The student ID
 * @param {Object} studentData - The student's complete data
 * @returns {Array} The built row data
 */
function buildStudentRow(studentId, studentData) {
  try {
    const rowBuilder = new TentativeRowBuilder();
    const teacherInputProcessor = new TeacherInputProcessor();
    
    // Process teacher input
    const teacherInput = teacherInputProcessor.processTeacherInput(studentId, studentData);
    
    // Build the row
    return rowBuilder.buildStudentRow(studentId, studentData, teacherInput);
    
  } catch (error) {
    console.error(`Error building row for student ${studentId}:`, error);
    throw error;
  }
}

/**
 * Gets available writer types for documentation or UI purposes.
 * 
 * @returns {Array<string>} Available writer types
 */
function getAvailableWriterTypes() {
  return sheetWriterFactory.getAvailableWriterTypes();
}

/**
 * Clears the writer cache. Useful for testing or development.
 */
function clearWriterCache() {
  sheetWriterFactory.clearCache();
}

// Export functions for backward compatibility and external use
// (In Google Apps Script, these are automatically available)
