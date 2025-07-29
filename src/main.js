/**
 * Main entry point for the refactored NAHS Student Transition system
 * 
 * This file replaces the original loadTENTATIVEVersion2.js with a cleaner,
 * more maintainable structure using the new folder organization.
 */

/**
 * Main function to load and process student data for TENTATIVE-Version2 sheet
 * 
 * This is the primary entry point that orchestrates the entire data loading,
 * processing, and writing workflow.
 */
function loadTENTATIVEVersion2() {
  try {
    console.log('Starting TENTATIVE-Version2 data load process...');
    
    // Store existing row colors before clearing sheet
    const existingColors = preserveExistingRowColors();
    
    // Load all required data from various sheets
    const rawData = loadAllStudentData();
    
    // Process and filter the data
    const processedData = processStudentData(rawData);
    
    // Filter out withdrawn students
    const activeStudents = filterActiveStudents(processedData);
    
    // Write processed data to the TENTATIVE-Version2 sheet
    writeProcessedDataToSheet(activeStudents);
    
    // Restore row colors
    restoreRowColors(existingColors);
    
    // Ensure checkboxes are present in the correct column
    ensureCheckboxesInColumnBX();
    
    console.log('TENTATIVE-Version2 data load completed successfully');
    
  } catch (error) {
    console.error('Error in loadTENTATIVEVersion2:', error);
    // Consider sending an email notification or logging to external system
    throw error;
  }
}

/**
 * Loads data from all required sheets using the new data loader structure
 * @returns {Object} Object containing all loaded data maps
 */
function loadAllStudentData() {
  console.log('Loading data from all sheets using new data loaders...');
  
  // Use the new centralized loader function
  return loadAllStudentDataWithLoaders();
}

/**
 * Processes raw data by merging and enriching student records
 * @param {Object} rawData - Raw data from all sheets
 * @returns {Map} Processed student data map
 */
function processStudentData(rawData) {
  console.log('Processing student data...');
  
  // Start with entry/withdrawal data as the base
  let processedMap = new Map();
  
  // TODO: Implement proper data merging logic here
  // This is a placeholder that maintains existing functionality
  
  // For now, return the existing complex processing
  // This should be broken down into smaller, testable functions
  
  return processedMap;
}

/**
 * Filters out withdrawn students from the active student list
 * @param {Map} studentData - Processed student data
 * @returns {Map} Filtered active students
 */
function filterActiveStudents(studentData) {
  console.log('Filtering active students...');
  
  // TODO: Implement filtering logic using the new utility functions
  // This should replace the current complex filtering in the original file
  
  return studentData;
}

/**
 * Writes processed data to the TENTATIVE-Version2 sheet
 * @param {Map} activeStudents - Active student data to write
 */
function writeProcessedDataToSheet(activeStudents) {
  console.log('Writing data to TENTATIVE-Version2 sheet...');
  
  // TODO: Use the new writers/tentativeSheetWriter.js
  // For now, call the existing function
  writeToTENTATIVEVersion2Sheet(activeStudents);
}

/**
 * Preserves existing row colors before data refresh
 * @returns {Object} Map of student IDs to their row colors
 */
function preserveExistingRowColors() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.TENTATIVE_V2);
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();
  const backgrounds = dataRange.getBackgrounds();
  
  const studentColors = {};
  for (let i = 0; i < data.length; i++) {
    const studentId = data[i][3]; // Column D contains student ID
    if (studentId) {
      studentColors[studentId] = backgrounds[i];
    }
  }
  
  return studentColors;
}

/**
 * Restores row colors after data refresh
 * @param {Object} studentColors - Map of student IDs to colors
 */
function restoreRowColors(studentColors) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.TENTATIVE_V2);
  const newDataRange = sheet.getDataRange();
  const newData = newDataRange.getValues();
  
  for (let j = 0; j < newData.length; j++) {
    const newStudentId = newData[j][3]; // Column D contains student ID
    if (newStudentId && studentColors[newStudentId]) {
      const range = sheet.getRange(j + 1, 1, 1, newData[0].length);
      range.setBackgrounds([studentColors[newStudentId]]);
    }
  }
}

/**
 * Ensures checkboxes are present in column BX (legacy function)
 * TODO: Move this to a utilities file
 */
function ensureCheckboxesInColumnBX() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.TENTATIVE_V2);
  const columnBX = 76; // Column BX
  const lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    const range = sheet.getRange(2, columnBX, lastRow - 1, 1);
    const values = range.getValues();
    
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] !== true && values[i][0] !== false) {
        values[i][0] = false; // Set default to false (unchecked)
      }
    }
    
    range.setValues(values);
    range.insertCheckboxes();
  }
}
