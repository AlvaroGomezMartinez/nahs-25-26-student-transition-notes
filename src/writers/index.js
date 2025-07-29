/**
 * Index file for the writers module.
 * Provides centralized access to all writer classes and utilities.
 */

// Import all writer classes
// (In Google Apps Script, these would be loaded automatically)

/**
 * Main function to write student data to the TENTATIVE-Version2 sheet.
 * This replaces the original 701-line writeToTENTATIVEVersion2Sheet function.
 * 
 * @param {Map} activeStudentDataMap - Map of student data keyed by student ID
 * @returns {Object} Write statistics and results
 */
function writeToTENTATIVEVersion2Sheet(activeStudentDataMap) {
  try {
    // Get the writer instance
    const writer = sheetWriterFactory.getWriter('tentative');
    
    // Write the data
    writer.writeStudentData(activeStudentDataMap);
    
    // Get statistics
    const stats = writer.getWriteStatistics(activeStudentDataMap);
    
    console.log('Write completed successfully:', stats);
    return stats;
    
  } catch (error) {
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
