/**
 * @fileoverview Main entry point for the NAHS Student Transition Notes system.
 * 
 * This file contains the primary functions that orchestrate the complete data processing
 * workflow for student transition notes. It coordinates data loading, processing, and
 * writing operations using a modular architecture.
 * 
 * @author NAHS Development Team
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * Main entry point for the NAHS Student Transition Notes system.
 * 
 * This function serves as the primary orchestrator for the complete data processing
 * workflow. It uses a clean, modular architecture that separates concerns into data loaders, processors, and writers.
 * 
 * The process follows these phases:
 * 1. **Data Loading**: Uses specialized loaders to extract data from multiple Google Sheets
 * 2. **Data Processing**: Applies business logic through modular processors
 * 3. **Data Writing**: Outputs processed data using structured writers
 * 4. **Reporting**: Provides comprehensive statistics and error reporting
 * 
 * @function loadTENTATIVEVersion2
 * @memberof Main
 * 
 * @returns {Object|undefined} Processing statistics object containing:
 *   - {number} studentsProcessed - Total number of students processed
 *   - {number} rowsWritten - Number of rows written to the output sheet
 *   - {boolean} hasErrors - Whether any errors occurred during processing
 *   - {Array<string>} errors - List of error messages (if any)
 * 
 * @throws {Error} Throws error if critical system failure occurs
 * 
 * @example
 * // Basic usage - run the complete process
 * const stats = loadTENTATIVEVersion2();
 * console.log(`Processed ${stats.studentsProcessed} students`);
 * 
 * @example
 * // Error handling
 * try {
 *   const result = loadTENTATIVEVersion2();
 *   if (result.hasErrors) {
 *     console.warn('Process completed with errors:', result.errors);
 *   }
 * } catch (error) {
 *   console.error('Critical system failure:', error.message);
 * }
 * 
 * @see {@link loadAllStudentDataWithLoaders} For data loading details
 * @see {@link writeToTENTATIVEVersion2Sheet} For data writing details
 * @see {@link https://docs.google.com/spreadsheets/d/SHEET_ID} Source data sheets
 * 
 * @since 2.0.0
 */
function loadTENTATIVEVersion2() {
  try {
    console.log('=== Starting NAHS Student Transition Notes Process ===');
    const startTime = new Date();

    // Phase 0: Validate system configuration
    console.log('Phase 0: Validating system configuration...');
    const configValidation = validateSystemConfiguration();
    
    if (!configValidation.isValid) {
      console.error('❌ System configuration is invalid. Cannot proceed.');
      console.error('Critical errors:');
      configValidation.errors.forEach(error => console.error(`  - ${error}`));
      
      if (configValidation.suggestions.length > 0) {
        console.info('💡 Suggestions to fix issues:');
        configValidation.suggestions.forEach(suggestion => console.info(`  - ${suggestion}`));
      }
      
      return {
        studentsProcessed: 0,
        rowsWritten: 0,
        hasErrors: true,
        errors: configValidation.errors,
        suggestions: configValidation.suggestions
      };
    }
    
    if (configValidation.warnings.length > 0) {
      console.warn('⚠️ Configuration warnings detected (proceeding anyway):');
      configValidation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    // Phase 1: Load all student data using the new data loaders
    console.log('Phase 1: Loading student data...');
    const rawData = loadAllStudentDataWithLoaders();
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.warn('No student data loaded. Exiting process.');
      return;
    }

    // Phase 2: Process the data using the new data processors
    console.log('Phase 2: Processing student data...');
    const activeStudentDataMap = processAllStudentData(rawData);
    
    if (!activeStudentDataMap || activeStudentDataMap.size === 0) {
      console.warn('No active students after processing. Exiting process.');
      return;
    }

    console.log(`Successfully processed data for ${activeStudentDataMap.size} students`);
    
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
 * Backward compatibility function that maintains the original function name.
 * 
 * This function exists to support legacy code that may still reference the
 * original function name. It simply delegates to the new loadTENTATIVEVersion2
 * function while issuing a deprecation warning.
 * 
 * @function loadTENTATIVEVersion2_OriginalName
 * @memberof Main
 * @deprecated Since version 2.0.0. Use loadTENTATIVEVersion2 instead.
 * 
 * @returns {Object} Same return value as loadTENTATIVEVersion2
 * 
 * @see {@link loadTENTATIVEVersion2} For the current implementation
 * 
 * @example
 * // Legacy usage (deprecated)
 * const stats = loadTENTATIVEVersion2_OriginalName(); // Issues warning
 * 
 * // Preferred usage
 * const stats = loadTENTATIVEVersion2(); // No warning
 */
function loadTENTATIVEVersion2_OriginalName() {
  console.warn('Using deprecated function name. Consider updating to loadTENTATIVEVersion2');
  return loadTENTATIVEVersion2();
}

/**
 * Loads data from all required Google Sheets using the modular data loader structure.
 * 
 * This function serves as the entry point for the data loading phase. It coordinates
 * multiple specialized data loaders to extract student information from various
 * Google Sheets sources. Each loader is responsible for a specific data domain
 * (e.g., registrations, schedules, contact information).
 * 
 * The function handles:
 * - **Multi-source data loading**: Coordinates 8+ different data loaders
 * - **Error resilience**: Continues processing if individual sheets fail
 * - **Data validation**: Ensures loaded data meets expected formats
 * - **Performance optimization**: Uses parallel loading where possible
 * 
 * @function loadAllStudentData
 * @memberof Main
 * 
 * @returns {Map<string, Object>} A Map where:
 *   - **Key**: Student ID (string) - Unique identifier for each student
 *   - **Value**: Student data object containing all loaded information
 * 
 * @throws {Error} Throws if critical data loading failures occur
 * 
 * @example
 * // Basic usage
 * const studentData = loadAllStudentData();
 * console.log(`Loaded data for ${studentData.size} students`);
 * 
 * // Access specific student data
 * const student = studentData.get('1234567');
 * if (student) {
 *   console.log(`Student: ${student.TENTATIVE[0].FIRST} ${student.TENTATIVE[0].LAST}`);
 * }
 * 
 * @example
 * // Error handling
 * try {
 *   const data = loadAllStudentData();
 *   if (data.size === 0) {
 *     console.warn('No student data loaded - check sheet access');
 *   }
 * } catch (error) {
 *   console.error('Data loading failed:', error.message);
 * }
 * 
 * @see {@link loadAllStudentDataWithLoaders} For the actual implementation
 * @see {@link DataLoaderFactory} For the loader creation mechanism
 * @see {@link BaseDataLoader} For the base loader interface
 * 
 * @since 2.0.0
 */
function loadAllStudentData() {
  console.log('Loading data from all sheets using new data loaders...');
  
  // Use the new centralized loader function
  return loadAllStudentDataWithLoaders();
}

/**
 * Processes raw data by merging and enriching student records.
 * 
 * This function takes the raw data loaded from multiple sheets and applies
 * business logic to create comprehensive student profiles. It handles:
 * 
 * - **Data Integration**: Merges data from multiple sources by student ID
 * - **Data Enrichment**: Adds calculated fields and derived information
 * - **Data Validation**: Ensures data consistency and completeness
 * - **Business Logic**: Applies NAHS-specific processing rules
 * 
 * The processing pipeline includes:
 * 1. Student data merging (combining multiple sheet data)
 * 2. Teacher input processing (form responses integration)
 * 3. Schedule data integration (course and teacher matching)
 * 4. Grade and attendance calculations
 * 5. Contact information normalization
 * 
 * @function processStudentData
 * @memberof Main
 * 
 * @param {Object} rawData - Raw data object containing data from all sheets:
 *   @param {Array} rawData.tentative - TENTATIVE sheet data
 *   @param {Array} rawData.registrations - Registration data
 *   @param {Array} rawData.schedules - Schedule information
 *   @param {Array} rawData.formResponses - Teacher form responses
 *   @param {Array} rawData.contactInfo - Contact information
 *   @param {Array} rawData.entryWithdrawal - Entry/withdrawal records
 *   @param {Array} rawData.attendance - Attendance data
 *   @param {Array} rawData.withdrawn - Withdrawn students
 *   @param {Array} rawData.wdOther - Other withdrawal data
 * 
 * @returns {Map<string, Object>} Processed student data map where:
 *   - **Key**: Student ID (string)
 *   - **Value**: Enriched student object with processed data
 * 
 * @throws {Error} Throws if data processing fails critically
 * 
 * @example
 * // Basic processing
 * const rawData = loadAllRawData();
 * const processedData = processStudentData(rawData);
 * 
 * @example
 * // Access processed student information
 * const student = processedData.get('1234567');
 * const grades = student.processedGrades; // Calculated grades
 * const schedule = student.processedSchedule; // Merged schedule data
 * 
 * @see {@link processAllStudentData} For the actual implementation
 * @see {@link StudentDataMerger} For data merging logic
 * @see {@link TeacherInputProcessor} For form response processing
 * 
 * @since 2.0.0
 */
function processStudentData(rawData) {
  console.log('Processing student data using new processors...');
  
  // Use the new comprehensive data processing pipeline
  return processAllStudentData(rawData);
}

/**
 * Filters out withdrawn students from the active student list.
 * 
 * **Note**: In the refactored architecture, student filtering is now handled
 * automatically within the data processing pipeline. This function is maintained
 * for backward compatibility but essentially acts as a pass-through.
 * 
 * The actual filtering logic is implemented in the StudentFilterProcessor
 * class, which is automatically applied during the data processing phase.
 * 
 * @function filterActiveStudents
 * @memberof Main
 * @deprecated Since version 2.0.0. Filtering is now handled in the processing pipeline.
 * 
 * @param {Map<string, Object>} studentData - Processed student data map
 * 
 * @returns {Map<string, Object>} The same student data map (filtering already applied)
 * 
 * @example
 * // Legacy usage (no longer needed)
 * const filtered = filterActiveStudents(processedData);
 * 
 * // Current approach (filtering automatic)
 * const processedData = processStudentData(rawData); // Filtering already applied
 * 
 * @see {@link StudentFilterProcessor} For the actual filtering implementation
 * @see {@link processAllStudentData} Where filtering is automatically applied
 * 
 * @since 1.0.0
 */
function filterActiveStudents(studentData) {
  console.log('Student filtering already handled in processing pipeline...');
  
  // Filtering is now handled within processAllStudentData
  // This function is kept for compatibility but may be removed later
  return studentData;
}

/**
 * Writes processed student data to the TENTATIVE-Version2 sheet.
 * 
 * This function serves as a bridge between the main processing logic and
 * the specialized writer modules. It delegates the actual writing operation
 * to the TentativeSheetWriter class while maintaining a simple interface
 * for the main processing function.
 * 
 * The writing process includes:
 * - **Data Formatting**: Ensures data matches expected sheet structure
 * - **Row Construction**: Builds complete rows for each student
 * - **Sheet Updates**: Writes data to the Google Sheet efficiently
 * - **Error Handling**: Manages writing failures gracefully
 * 
 * @function writeProcessedDataToSheet
 * @memberof Main
 * 
 * @param {Map<string, Object>} activeStudents - Map of active student data where:
 *   - **Key**: Student ID (string)
 *   - **Value**: Complete student data object with all processed information
 * 
 * @returns {Object} Write statistics object from the writer operation
 * 
 * @throws {Error} Throws if writing operation fails critically
 * 
 * @example
 * // Basic usage
 * const processedStudents = processStudentData(rawData);
 * const writeStats = writeProcessedDataToSheet(processedStudents);
 * console.log(`Wrote ${writeStats.rowsWritten} rows`);
 * 
 * @example
 * // With error handling
 * try {
 *   const stats = writeProcessedDataToSheet(activeStudents);
 *   if (stats.hasErrors) {
 *     console.warn('Some students had write errors');
 *   }
 * } catch (error) {
 *   console.error('Writing failed:', error.message);
 * }
 * 
 * @see {@link writeToTENTATIVEVersion2Sheet} For the actual implementation
 * @see {@link TentativeSheetWriter} For the writer class
 * @see {@link SHEET_NAMES.TENTATIVE_V2} For the target sheet name
 * 
 * @since 2.0.0
 */
function writeProcessedDataToSheet(activeStudents) {
  console.log('Writing data to TENTATIVE-Version2 sheet...');
  
  // Use the new writer system
  return writeToTENTATIVEVersion2Sheet(activeStudents);
}

/**
 * Preserves existing row colors from the TENTATIVE-Version2 sheet before data refresh.
 * 
 * This function captures the current background colors of all rows in the
 * TENTATIVE-Version2 sheet before the data is refreshed. This allows the
 * system to maintain any manual color coding that users may have applied
 * to highlight specific students or conditions.
 * 
 * The function handles:
 * - **Color Extraction**: Reads background colors from all sheet rows
 * - **Student Mapping**: Associates colors with specific student IDs
 * - **Data Preservation**: Creates a mapping for color restoration
 * - **Error Resilience**: Handles missing or invalid data gracefully
 * 
 * @function preserveExistingRowColors
 * @memberof Main
 * 
 * @returns {Object<string, Array<Array<string>>>} Map of student colors where:
 *   - **Key**: Student ID (string) - Unique identifier for each student
 *   - **Value**: Array of background colors for that student's row
 * 
 * @throws {Error} Throws if sheet access fails
 * 
 * @example
 * // Preserve colors before data refresh
 * const colorMap = preserveExistingRowColors();
 * 
 * // After writing new data, restore colors
 * Object.keys(colorMap).forEach(studentId => {
 *   const colors = colorMap[studentId];
 *   // Apply colors to the appropriate row
 * });
 * 
 * @example
 * // Check if student has custom colors
 * const colors = preserveExistingRowColors();
 * const studentColors = colors['1234567'];
 * if (studentColors && studentColors.some(color => color !== '#ffffff')) {
 *   console.log('Student has custom highlighting');
 * }
 * 
 * @see {@link SHEET_NAMES.TENTATIVE_V2} For the target sheet
 * @see {@link SpreadsheetApp} For Google Sheets API reference
 * 
 * @since 2.0.0
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
 * Runs system diagnostics and configuration validation.
 * Use this function to check system health before running the main process.
 * 
 * @function runSystemDiagnostics
 * @memberof Main
 * 
 * @returns {Object} Comprehensive diagnostic results
 * 
 * @example
 * // Run diagnostics to check system health
 * const diagnostics = runSystemDiagnostics();
 * console.log(diagnostics.configurationReport);
 * 
 * @since 2.0.0
 */
function runSystemDiagnostics() {
  try {
    console.log('=== Running NAHS System Diagnostics ===');
    
    // Check system initialization
    let systemInitialized = false;
    try {
      if (typeof initializeNAHSSystem === 'function') {
        initializeNAHSSystem();
        systemInitialized = true;
        console.log('✅ System initialization: SUCCESS');
      } else {
        console.error('❌ System initialization: FAILED - initializeNAHSSystem not found');
      }
    } catch (error) {
      console.error('❌ System initialization: ERROR -', error.message);
    }

    // Validate configuration
    const configValidation = validateSystemConfiguration();
    
    // Generate comprehensive report
    const configReport = generateConfigurationReport();
    
    // Check dependencies
    const dependencies = {
      DateUtils: typeof DateUtils !== 'undefined',
      ValidationUtils: typeof ValidationUtils !== 'undefined',
      DataUtils: typeof DataUtils !== 'undefined',
      BaseDataLoader: typeof BaseDataLoader !== 'undefined',
      BaseDataProcessor: typeof BaseDataProcessor !== 'undefined',
      SHEET_NAMES: typeof SHEET_NAMES !== 'undefined',
      COLUMN_NAMES: typeof COLUMN_NAMES !== 'undefined'
    };

    let allDependenciesAvailable = true;
    console.log('\n=== Dependency Check ===');
    Object.entries(dependencies).forEach(([name, available]) => {
      if (available) {
        console.log(`✅ ${name}: Available`);
      } else {
        console.error(`❌ ${name}: Missing`);
        allDependenciesAvailable = false;
      }
    });

    const diagnosticResult = {
      systemInitialized,
      configurationValid: configValidation.isValid,
      allDependenciesAvailable,
      configurationReport: configReport,
      configValidation,
      dependencies,
      overallHealth: systemInitialized && configValidation.isValid && allDependenciesAvailable
    };

    console.log('\n=== Diagnostic Summary ===');
    console.log(`Overall System Health: ${diagnosticResult.overallHealth ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    console.log(`System Initialized: ${systemInitialized ? '✅' : '❌'}`);
    console.log(`Configuration Valid: ${configValidation.isValid ? '✅' : '❌'}`);
    console.log(`Dependencies Available: ${allDependenciesAvailable ? '✅' : '❌'}`);

    if (!diagnosticResult.overallHealth) {
      console.error('\n❌ System is not ready for operation. Please address the issues above.');
      
      // Check if the main issue is external configuration
      const hasExternalSheetErrors = configValidation.errors.some(error => 
        error.includes('Registrations SY 24.25') || 
        error.includes('Alt HS Attendance & Enrollment Count') || 
        error.includes('Sheet1')
      );
      
      if (hasExternalSheetErrors) {
        console.log('\n📋 External Configuration Needed:');
        console.log('The missing sheets are located in external spreadsheets.');
        console.log('Run these functions to configure external access:');
        console.log('1. setupExternalConfiguration() - Get configuration instructions');
        console.log('2. validateExternalAccess() - Test external connections');
        console.log('3. checkExternalConfiguration() - View current status');
      }
    } else {
      console.log('\n🎉 System is ready for operation!');
    }

    return diagnosticResult;

  } catch (error) {
    console.error('Error running system diagnostics:', error);
    return {
      systemInitialized: false,
      configurationValid: false,
      allDependenciesAvailable: false,
      configurationReport: `Error: ${error.message}`,
      overallHealth: false,
      error: error.message
    };
  }
}

/**
 * Diagnostic function to check actual sheet names and column headers.
 * Use this to identify sheet and column name mismatches.
 * 
 * @function diagnoseSpreadsheetStructure
 * @memberof Main
 * 
 * @returns {Object} Structure information about the spreadsheet
 * 
 * @example
 * // Run this to see actual sheet and column names
 * const structure = diagnoseSpreadsheetStructure();
 * console.log(structure);
 * 
 * @since 2.0.0
 */
function diagnoseSpreadsheetStructure() {
  try {
    console.log('=== Diagnosing Spreadsheet Structure ===');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    const structure = {
      spreadsheetName: spreadsheet.getName(),
      sheetCount: sheets.length,
      sheets: {},
      expectedSheets: SHEET_NAMES,
      missingSheets: [],
      unexpectedSheets: []
    };
    
    // Get actual sheet names and their columns
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      
      let headers = [];
      if (lastRow > 0 && lastCol > 0) {
        try {
          headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        } catch (e) {
          headers = [`Error reading headers: ${e.message}`];
        }
      }
      
      structure.sheets[sheetName] = {
        rowCount: lastRow,
        colCount: lastCol,
        headers: headers,
        hasStudentIdColumn: headers.includes(COLUMN_NAMES.STUDENT_ID)
      };
    });
    
    // Check for expected sheets
    Object.values(SHEET_NAMES).forEach(expectedSheetName => {
      if (!structure.sheets[expectedSheetName]) {
        structure.missingSheets.push(expectedSheetName);
      }
    });
    
    // Check for unexpected sheets
    Object.keys(structure.sheets).forEach(actualSheetName => {
      if (!Object.values(SHEET_NAMES).includes(actualSheetName)) {
        structure.unexpectedSheets.push(actualSheetName);
      }
    });
    
    // Log findings
    console.log(`Spreadsheet: ${structure.spreadsheetName}`);
    console.log(`Total sheets: ${structure.sheetCount}`);
    
    if (structure.missingSheets.length > 0) {
      console.warn(`Missing expected sheets: ${structure.missingSheets.join(', ')}`);
    }
    
    if (structure.unexpectedSheets.length > 0) {
      console.info(`Additional sheets found: ${structure.unexpectedSheets.join(', ')}`);
    }
    
    // Check each expected sheet
    Object.entries(SHEET_NAMES).forEach(([key, sheetName]) => {
      const sheetInfo = structure.sheets[sheetName];
      if (sheetInfo) {
        console.log(`✅ ${key}: "${sheetName}" - ${sheetInfo.rowCount} rows, ${sheetInfo.colCount} cols`);
        if (!sheetInfo.hasStudentIdColumn) {
          console.warn(`   ⚠️ Missing '${COLUMN_NAMES.STUDENT_ID}' column`);
          console.info(`   Available columns: ${sheetInfo.headers.join(', ')}`);
        }
      } else {
        console.error(`❌ ${key}: "${sheetName}" - NOT FOUND`);
      }
    });
    
    return structure;
    
  } catch (error) {
    console.error('Error diagnosing spreadsheet structure:', error);
    throw error;
  }
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
