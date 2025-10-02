/**
 * @fileoverview System configuration validation and diagnostics.
 * 
 * This file provides utilities to validate the system configuration,
 * diagnose spreadsheet structure issues, and provide suggestions for
 * fixing common problems.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2.0.0
 */

/**
 * Validates the system configuration and diagnoses issues.
 * 
 * This function checks for common configuration problems such as:
 * - Missing sheets
 * - Missing columns
 * - Sheet name mismatches
 * - Column name mismatches
 * 
 * @function validateSystemConfiguration
 * @memberof Utils
 * 
 * @returns {Object} Validation result object containing:
 *   - {boolean} isValid - Whether the system configuration is valid
 *   - {Array<string>} errors - Critical errors that prevent operation
 *   - {Array<string>} warnings - Non-critical issues that may affect functionality
 *   - {Array<string>} suggestions - Suggested fixes for identified issues
 *   - {Object} sheetAnalysis - Detailed analysis of each sheet
 * 
 * @example
 * // Validate system before running main process
 * const validation = validateSystemConfiguration();
 * if (!validation.isValid) {
 *   console.error('System configuration errors:', validation.errors);
 *   return;
 * }
 * 
 * @since 2.0.0
 */
function validateSystemConfiguration() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    sheetAnalysis: {}
  };

  try {
    console.log('=== Validating System Configuration ===');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const actualSheets = spreadsheet.getSheets();
    const actualSheetNames = actualSheets.map(sheet => sheet.getName());

    // Check each expected sheet
    Object.entries(SHEET_NAMES).forEach(([constantName, expectedSheetName]) => {
      const analysis = {
        exists: false,
        hasRequiredColumns: false,
        missingColumns: [],
        actualColumns: [],
        suggestions: [],
        isExternal: SHEET_LOCATIONS && SHEET_LOCATIONS[expectedSheetName] === 'EXTERNAL'
      };

      // For external sheets, skip the current spreadsheet validation
      if (analysis.isExternal) {
        analysis.exists = true; // Assume external sheets exist for now
        analysis.suggestions.push('External sheet - not validated in current spreadsheet');
        result.warnings.push(`External sheet '${expectedSheetName}' not validated - requires manual verification`);
        result.sheetAnalysis[constantName] = analysis;
        return;
      }

      // Check if sheet exists in current spreadsheet
      const sheet = actualSheets.find(s => s.getName() === expectedSheetName);
      if (!sheet) {
        analysis.exists = false;
        result.errors.push(`Missing sheet: '${expectedSheetName}' (${constantName})`);
        
        // Look for similar sheet names
        const similarSheets = actualSheetNames.filter(name => 
          name.toLowerCase().includes(expectedSheetName.toLowerCase().substring(0, 5)) ||
          expectedSheetName.toLowerCase().includes(name.toLowerCase().substring(0, 5))
        );
        
        if (similarSheets.length > 0) {
          analysis.suggestions.push(`Similar sheets found: ${similarSheets.join(', ')}`);
          result.suggestions.push(`For '${expectedSheetName}', consider renaming: ${similarSheets.join(', ')}`);
        }
      } else {
        analysis.exists = true;
        
        // Check columns if sheet exists
        try {
          const lastCol = sheet.getLastColumn();
          if (lastCol > 0) {
            analysis.actualColumns = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
            
            // Check for required STUDENT ID column
            if (!analysis.actualColumns.includes(COLUMN_NAMES.STUDENT_ID)) {
              analysis.missingColumns.push(COLUMN_NAMES.STUDENT_ID);
              result.warnings.push(`Sheet '${expectedSheetName}' missing '${COLUMN_NAMES.STUDENT_ID}' column`);
              
              // Look for similar column names
              const similarColumns = analysis.actualColumns.filter(col => 
                typeof col === 'string' && (
                  col.toLowerCase().includes('student') ||
                  col.toLowerCase().includes('id') ||
                  col.toLowerCase().includes('number')
                )
              );
              
              if (similarColumns.length > 0) {
                analysis.suggestions.push(`Possible ID columns: ${similarColumns.join(', ')}`);
                result.suggestions.push(`In '${expectedSheetName}', check these columns for student IDs: ${similarColumns.join(', ')}`);
              }
            } else {
              analysis.hasRequiredColumns = true;
            }
          }
        } catch (error) {
          result.warnings.push(`Error reading columns from '${expectedSheetName}': ${error.message}`);
        }
      }

      result.sheetAnalysis[constantName] = analysis;
    });

    // Check for unexpected sheets that might be useful
    const unexpectedSheets = actualSheetNames.filter(name => 
      !Object.values(SHEET_NAMES).includes(name)
    );
    
    if (unexpectedSheets.length > 0) {
      result.warnings.push(`Additional sheets found: ${unexpectedSheets.join(', ')}`);
    }

    // Determine overall validity
    result.isValid = result.errors.length === 0;

    // Log summary
    console.log(`Configuration check complete:`);
    console.log(`- Errors: ${result.errors.length}`);
    console.log(`- Warnings: ${result.warnings.length}`);
    console.log(`- Suggestions: ${result.suggestions.length}`);

    if (result.errors.length > 0) {
      console.error('Critical errors found:');
      result.errors.forEach(error => console.error(`  ❌ ${error}`));
    }

    if (result.warnings.length > 0) {
      console.warn('Warnings:');
      result.warnings.forEach(warning => console.warn(`  ⚠️ ${warning}`));
    }

    if (result.suggestions.length > 0) {
      console.info('Suggestions:');
      result.suggestions.forEach(suggestion => console.info(`  💡 ${suggestion}`));
    }

    return result;

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Configuration validation failed: ${error.message}`);
    console.error('Error during configuration validation:', error);
    return result;
  }
}

/**
 * Creates a configuration report for documentation purposes.
 * 
 * @function generateConfigurationReport
 * @memberof Utils
 * 
 * @returns {string} Formatted configuration report
 * 
 * @example
 * const report = generateConfigurationReport();
 * console.log(report);
 * 
 * @since 2.0.0
 */
function generateConfigurationReport() {
  const validation = validateSystemConfiguration();
  
  let report = '=== NAHS System Configuration Report ===\n\n';
  
  report += `Overall Status: ${validation.isValid ? '✅ VALID' : '❌ INVALID'}\n`;
  report += `Errors: ${validation.errors.length}\n`;
  report += `Warnings: ${validation.warnings.length}\n`;
  report += `Suggestions: ${validation.suggestions.length}\n\n`;
  
  // Sheet analysis
  report += '=== Sheet Analysis ===\n';
  Object.entries(validation.sheetAnalysis).forEach(([constantName, analysis]) => {
    const sheetName = SHEET_NAMES[constantName];
    report += `\n${constantName} ("${sheetName}"):\n`;
    report += `  Exists: ${analysis.exists ? '✅' : '❌'}\n`;
    
    if (analysis.exists) {
      report += `  Has Required Columns: ${analysis.hasRequiredColumns ? '✅' : '⚠️'}\n`;
      report += `  Column Count: ${analysis.actualColumns.length}\n`;
      
      if (analysis.missingColumns.length > 0) {
        report += `  Missing Columns: ${analysis.missingColumns.join(', ')}\n`;
      }
      
      if (analysis.suggestions.length > 0) {
        report += `  Suggestions: ${analysis.suggestions.join('; ')}\n`;
      }
    }
  });
  
  // Errors section
  if (validation.errors.length > 0) {
    report += '\n=== Critical Errors ===\n';
    validation.errors.forEach(error => {
      report += `❌ ${error}\n`;
    });
  }
  
  // Warnings section
  if (validation.warnings.length > 0) {
    report += '\n=== Warnings ===\n';
    validation.warnings.forEach(warning => {
      report += `⚠️ ${warning}\n`;
    });
  }
  
  // Suggestions section
  if (validation.suggestions.length > 0) {
    report += '\n=== Suggestions ===\n';
    validation.suggestions.forEach(suggestion => {
      report += `💡 ${suggestion}\n`;
    });
  }
  
  report += '\n=== End Report ===';
  
  return report;
}
