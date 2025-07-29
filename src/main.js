/**
 * Main entry point for the NAHS Student Transition Notes system.
 * This function loads all student data, processes it, and writes it to the TENTATIVE-Version2 sheet.
 * 
 * This replaces the original loadTENTATIVEVersion2 function with a cleaner,
 * more maintainable architecture using data loaders, processors, and writers.
 */
function loadTENTATIVEVersion2() {
  try {
    console.log('=== Starting NAHS Student Transition Notes Process ===');
    const startTime = new Date();

    // Phase 1: Load all student data using the new data loaders
    console.log('Phase 1: Loading student data...');
    const activeStudentDataMap = loadAllStudentDataWithLoaders();
    
    if (!activeStudentDataMap || activeStudentDataMap.size === 0) {
      console.warn('No student data loaded. Exiting process.');
      return;
    }

    console.log(`Successfully loaded data for ${activeStudentDataMap.size} students`);

    // Phase 2: Process the data using the new data processors
    console.log('Phase 2: Processing student data...');
    
    // The data processors are now integrated into the writers
    // This maintains the same data flow but with better organization
    
    // Phase 3: Write processed data to sheets using the new writers
    console.log('Phase 3: Writing data to TENTATIVE-Version2 sheet...');
    
    // Use the new writer system
    const writeStats = writeToTENTATIVEVersion2Sheet(activeStudentDataMap);
    
    // Phase 4: Summary and completion
    const endTime = new Date();
    const processingTime = (endTime - startTime) / 1000;
    
    console.log('=== Process Completed Successfully ===');
    console.log(`Students processed: ${writeStats.studentsProcessed}`);
    console.log(`Rows written: ${writeStats.rowsWritten}`);
    console.log(`Processing time: ${processingTime} seconds`);
    console.log(`Completed at: ${endTime.toLocaleString()}`);
    
    if (writeStats.hasErrors) {
      console.warn('Some students had processing errors. Check the sheet for error rows.');
    }

    return writeStats;
    
  } catch (error) {
    console.error('Critical error in loadTENTATIVEVersion2:', error);
    throw error;
  }
}

/**
 * Backward compatibility function - maintains the original function name
 * with the terrible variable name from the original code.
 */
function loadTENTATIVEVersion2_OriginalName() {
  console.warn('Using deprecated function name. Consider updating to loadTENTATIVEVersion2');
  return loadTENTATIVEVersion2();
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
  console.log('Processing student data using new processors...');
  
  // Use the new comprehensive data processing pipeline
  return processAllStudentData(rawData);
}

/**
 * Filters out withdrawn students from the active student list
 * @param {Map} studentData - Processed student data
 * @returns {Map} Filtered active students
 */
function filterActiveStudents(studentData) {
  console.log('Student filtering already handled in processing pipeline...');
  
  // Filtering is now handled within processAllStudentData
  // This function is kept for compatibility but may be removed later
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
