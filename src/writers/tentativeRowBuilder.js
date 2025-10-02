/**
 * @fileoverview Tentative Row Builder for the NAHS system.
 * 
 * This module provides specialized functionality for building complete data rows
 * for the TENTATIVE-Version2 sheet. It handles the complex logic of extracting
 * and formatting data from multiple sources, calculating derived fields, and
 * assembling the final row data structure for sheet writing operations.
 * 
 * The row builder coordinates data from tentative records, registrations,
 * contacts, schedules, and teacher inputs to create comprehensive student records.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2.0.0
 * @memberof Writers
 */

/**
 * Builds complete data rows for the TENTATIVE-Version2 sheet.
 * 
 * This specialized class handles the complex logic of extracting and formatting
 * data from multiple sources to create comprehensive student data rows. It
 * coordinates data merging, field calculation, and formatting to produce
 * the final row structure required for the TENTATIVE-Version2 sheet with
 * enhanced teacher input processing and clean production-ready implementation.
 * 
 * **Key Features:**
 * - **Multi-Source Data Integration**: Combines data from tentative, registration, contact, and schedule sources
 * - **Enhanced Teacher Input Processing**: Integrates duplicate-detection processed teacher feedback intelligently
 * - **Smart Data Precedence**: Form responses take priority over tentative data with fallback logic
 * - **Derived Field Calculation**: Computes estimated exit dates, educational factors, and status indicators
 * - **Source Data Compatibility**: Handles eligibility field mapping with proper source data spelling
 * - **Data Validation**: Ensures data integrity and handles missing or invalid data gracefully
 * - **Format Standardization**: Applies consistent formatting for dates, names, and other fields
 * - **Production-Ready Architecture**: Clean, optimized code without debugging artifacts
 * 
 * **Data Processing Flow:**
 * 1. Teacher input processed through duplicate detection system
 * 2. Form response data takes precedence over tentative data
 * 3. Intelligent fallback to tentative data when needed
 * 4. Complete row assembly with all calculated fields
 * 
 * @class TentativeRowBuilder
 * @memberof Writers
 * 
 * @example
 * // Build a student data row with enhanced teacher input
 * const builder = new TentativeRowBuilder();
 * const studentData = mergedStudentData.get('123456');
 * const teacherInput = processedTeacherInput.get('123456'); // Processed through duplicate detection
 * const rowData = builder.buildStudentRow('123456', studentData, teacherInput);
 * 
 * @example
 * // Process multiple students with data precedence
 * const builder = new TentativeRowBuilder();
 * const outputRows = [];
 * studentDataMap.forEach((data, studentId) => {
 *   const teacherData = teacherInputMap.get(studentId) || {}; // Duplicate-processed data
 *   const row = builder.buildStudentRow(studentId, data, teacherData);
 *   outputRows.push(row);
 * });
 * 
 * @since 2.0.0
 */
class TentativeRowBuilder {
  constructor() {
    this.dateUtils = new DateUtils();
    this.validationUtils = new ValidationUtils();
  }

  /**
   * Builds a complete row of data for a student.
   * @param {string} studentId - The student ID
   * @param {Object} studentData - Complete student data from all sources
   * @param {Object} teacherInput - Processed teacher input data
   * @returns {Array} Row data array
   */
  buildStudentRow(studentId, studentData, teacherInput) {
    try {
      // Extract and validate data arrays
      const tentativeEntry = this._extractTentativeEntry(studentData);
      const entryWithdrawalEntry = this._extractEntryWithdrawalEntry(studentData);
      const registrationEntry = this._extractRegistrationEntry(studentData);
      const contactEntry = this._extractContactEntry(studentData);

      // Calculate derived fields
      const estimatedExitDay = this._calculateEstimatedExitDay(studentData);
      console.log(`buildStudentRow - estimatedExitDay result: ${estimatedExitDay}`);
      const { contains504Result, containsESLResult } = this._calculateEducationalFactors(registrationEntry);
      
      // Extract names
      const { lastName, firstName } = this._extractNames(studentData, tentativeEntry, entryWithdrawalEntry);

      // Build the complete row
      const row = [
        this._getDateAddedToSpreadsheet(tentativeEntry),
        lastName,
        firstName,
        studentId || null,
        this._getGrade(tentativeEntry, entryWithdrawalEntry),

        // 1st Period data
        ...this._buildPeriodData('1st', teacherInput, tentativeEntry),
        
        // 2nd Period data
        ...this._buildPeriodData('2nd', teacherInput, tentativeEntry),
        
        // 3rd Period data
        ...this._buildPeriodData('3rd', teacherInput, tentativeEntry),
        
        // 4th Period data
        ...this._buildPeriodData('4th', teacherInput, tentativeEntry),
        
        // 5th Period data
        ...this._buildPeriodData('5th', teacherInput, tentativeEntry),
        
        // 6th Period data
        ...this._buildPeriodData('6th', teacherInput, tentativeEntry),
        
        // 7th Period data
        ...this._buildPeriodData('7th', teacherInput, tentativeEntry),
        
        // 8th Period data
        ...this._buildPeriodData('8th', teacherInput, tentativeEntry),

        // Special Education data
        ...this._buildSpecialEducationData(teacherInput, tentativeEntry),

        // Additional fields
        registrationEntry?.["Home Campus"] || null,
        this._getFormattedEntryDate(entryWithdrawalEntry),
        this.dateUtils.formatToMMDDYYYY(estimatedExitDay) || null,
        tentativeEntry?.["Parent Notice Date"] || "", // Preserve existing Parent Notice Date
        tentativeEntry?.["Withdrawn Date"] || "", // Preserve existing Withdrawn Date
        tentativeEntry?.["Attendance Recovery"] || "", // Preserve existing Attendance Recovery
        registrationEntry?.["Eligibilty"] || null,
        tentativeEntry?.["Credit Retrieval"] || "", // Preserve existing Credit Retrieval
        registrationEntry?.["Behavior Contract"] || null,
        tentativeEntry?.["Campus Mentor"] || "", // Preserve existing Campus Mentor
        tentativeEntry?.["Other Intervention 1"] || "", // Preserve existing Other Intervention 1
        tentativeEntry?.["Other Intervention 2"] || "", // Preserve existing Other Intervention 2
        contains504Result,
        containsESLResult,
        tentativeEntry?.["Additional notes or counseling services and Support"] || "", // Preserve existing notes
        tentativeEntry?.["Licensed social worker consultation"] || "", // Preserve existing consultation notes
        tentativeEntry?.["Check if you're ready to create Transition Letter with Autocrat"] ?? "", // Preserve existing autocrat checkbox (use ?? to preserve false)
        contactEntry?.["Student Email"] || null,
        contactEntry?.["Parent Name"] || null,
        contactEntry?.["Guardian 1 Email"] || null,
        
        // Document merge fields
        tentativeEntry?.["Merged Doc ID - Transition Letter"] || null,
        tentativeEntry?.["Merged Doc URL - Transition Letter"] || null,
        tentativeEntry?.["Link to merged Doc - Transition Letter"] || null,
        tentativeEntry?.["Document Merge Status - Transition Letter"] || null,
      ];

      return row;
    } catch (error) {
      console.error(`Error building row for student ${studentId}:`, error);
      // Return a minimal row to prevent complete failure
      return this._buildErrorRow(studentId, error.message);
    }
  }

  /**
   * Extracts tentative entry data safely.
   */
  _extractTentativeEntry(studentData) {
    const tentativeArray = studentData["TENTATIVE"];
    return (tentativeArray && tentativeArray.length > 0) ? tentativeArray[0] : {};
  }

  /**
   * Extracts entry/withdrawal data safely.
   */
  _extractEntryWithdrawalEntry(studentData) {
    const entryWithdrawalArray = studentData["Entry_Withdrawal"];
    return (entryWithdrawalArray && entryWithdrawalArray.length > 0) ? entryWithdrawalArray[0] : {};
  }

  /**
   * Extracts registration data safely.
   */
  _extractRegistrationEntry(studentData) {
    const registrationArray = studentData["Registrations_SY_24_25"];
    return (registrationArray && registrationArray.length > 0) ? registrationArray[0] : {};
  }

  /**
   * Extracts contact data safely.
   */
  _extractContactEntry(studentData) {
    const contactArray = studentData["ContactInfo"];
    return (contactArray && contactArray.length > 0) ? contactArray[0] : {};
  }

  /**
   * Calculates estimated exit day.
   */
  _calculateEstimatedExitDay(studentData) {
    const entryWithdrawalEntry = this._extractEntryWithdrawalEntry(studentData);
    const registrationEntry = this._extractRegistrationEntry(studentData);
    const attendanceArray = studentData["Alt_HS_Attendance_Enrollment_Count"];

    // Try to get entry date from multiple sources
    let entryData = entryWithdrawalEntry["Entry Date"];
    
    // Fallback to most recent Entry Date from Schedules if Entry/Withdrawal date is not available
    if (!entryData) {
      entryData = this._extractMostRecentEntryDateFromSchedules(studentData);
      if (entryData) {
        console.log('Using most recent Entry Date from schedules:', entryData);
      }
    }
    
    // Try to get placement days with fallback to backup sheet
    let placementDays = registrationEntry?.["Placement Days"];
    let placementDaysSource = "Form Responses 2";
    
    // If placement days is missing from Form Responses 2, try backup sheet
    if (!placementDays || placementDays === "" || placementDays === null) {
      placementDays = this._getPlacementDaysFromBackupSheet(studentData);
      if (placementDays) {
        placementDaysSource = "Registrations SY 24.25 (backup)";
      }
    }
    
    // Simple debug: Log what we found for placement days
    console.log(`Student placement days: ${placementDays} (from ${placementDaysSource})`);
    
    // Early return if essential data is missing
    if (!entryData || !placementDays) {
      console.log(`Missing essential data for anticipated release date calculation:
        Entry Date: ${entryData}
        Placement Days: ${placementDays}
        Available in Entry/Withdrawal: ${entryWithdrawalEntry["Entry Date"]}
        Available in Schedules: ${this._extractMostRecentEntryDateFromSchedules(studentData)}`);
      return null;
    }

    // Extract attendance data with correct field names
    let daysInAttendance = 0;
    let daysInEnrl = 0;
    
    if (attendanceArray && Array.isArray(attendanceArray) && attendanceArray.length > 0) {
      const attendanceRecord = attendanceArray[0];
      // Use the correct field names from the attendance data
      daysInAttendance = attendanceRecord["DAYS IN ATT"] || 0;
      daysInEnrl = attendanceRecord["EAYS IN Enrl"] || 0;
    }

    // Fix: Don't double-format the date - pass the original date object/string
    const additionalDays = [daysInAttendance, daysInEnrl];

    console.log(`Calculating anticipated release date for student:
      Entry Date: ${entryData}
      Placement Days: ${placementDays}
      Days in Attendance: ${daysInAttendance}
      Days in Enrollment: ${daysInEnrl}`);

    return NAHS_EXPECTED_WITHDRAW_DATE(
      entryData, // Pass original entry date (don't double-format)
      placementDays,
      holidayDates || [],
      additionalDays
    );
  }

  /**
   * Extracts the most recent entry date from active schedules (same logic as StudentDataMerger)
   */
  _extractMostRecentEntryDateFromSchedules(studentData) {
    const schedules = studentData["Schedules"];
    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      return null;
    }

    // Filter to only active schedules (no withdrawal date)
    const activeSchedules = schedules.filter(schedule => 
      !schedule[COLUMN_NAMES.WITHDRAW_DATE] || 
      schedule[COLUMN_NAMES.WITHDRAW_DATE] === '' || 
      schedule[COLUMN_NAMES.WITHDRAW_DATE] === null
    );

    if (activeSchedules.length === 0) {
      return null;
    }

    let mostRecentDate = null;
    let mostRecentTimestamp = 0;

    activeSchedules.forEach(schedule => {
      const entryDateValue = schedule[COLUMN_NAMES.ENTRY_DATE];
      
      if (entryDateValue && entryDateValue !== '') {
        try {
          // Handle both Date objects and string dates
          let dateToCheck;
          if (entryDateValue instanceof Date) {
            dateToCheck = entryDateValue;
          } else {
            dateToCheck = new Date(entryDateValue);
          }
          
          // Validate the date is valid
          if (!isNaN(dateToCheck.getTime())) {
            const timestamp = dateToCheck.getTime();
            if (timestamp > mostRecentTimestamp) {
              mostRecentTimestamp = timestamp;
              mostRecentDate = entryDateValue instanceof Date ? 
                entryDateValue.toLocaleDateString() : 
                entryDateValue;
            }
          }
        } catch (error) {
          console.log(`Warning: Invalid entry date format in schedule: ${entryDateValue}`);
        }
      }
    });

    return mostRecentDate;
  }

  /**
   * Gets placement days from backup "Registrations SY 24.25" sheet when missing from primary source.
   * @param {Object} studentData - The student data object
   * @returns {number|null} Placement days from backup sheet or null if not found
   */
  _getPlacementDaysFromBackupSheet(studentData) {
    try {
      // Get the student ID from tentative data
      const tentativeEntry = this._extractTentativeEntry(studentData);
      const studentId = tentativeEntry["STUDENT ID"];
      
      if (!studentId) {
        return null;
      }

      // Access the backup "Registrations SY 24.25" sheet - specifically "Copy of Form Responses 2"
      const backupSpreadsheetId = "1kAWRpWO4xDtRShLB5YtTtWxTbVg800fuU2RvAlYhrfA";
      const backupSpreadsheet = SpreadsheetApp.openById(backupSpreadsheetId);
      const backupSheet = backupSpreadsheet.getSheetByName("Copy of Form Responses 2");
      
      // Get all data from the backup sheet
      const backupData = backupSheet.getDataRange().getValues();
      
      if (backupData.length === 0) {
        console.log('Backup sheet "Copy of Form Responses 2" is empty');
        return null;
      }
      
      // Find the header row to locate Student ID and Placement Days columns
      const headerRow = backupData[0];
      const studentIdColumnIndex = headerRow.findIndex(header => 
        header && header.toString().toLowerCase().includes('student id')
      );
      const placementDaysColumnIndex = headerRow.findIndex(header => 
        header && header.toString().toLowerCase().includes('placement days')
      );
      
      if (studentIdColumnIndex === -1 || placementDaysColumnIndex === -1) {
        console.log(`Backup sheet columns not found: Student ID index: ${studentIdColumnIndex}, Placement Days index: ${placementDaysColumnIndex}`);
        return null;
      }
      
      // Search for the student in the backup data
      for (let i = 1; i < backupData.length; i++) {
        const row = backupData[i];
        const backupStudentId = row[studentIdColumnIndex];
        
        if (backupStudentId && backupStudentId.toString() === studentId.toString()) {
          const backupPlacementDays = row[placementDaysColumnIndex];
          
          if (backupPlacementDays && backupPlacementDays !== "" && !isNaN(backupPlacementDays)) {
            console.log(`Found placement days in backup sheet for student ${studentId}: ${backupPlacementDays}`);
            return Number(backupPlacementDays);
          }
        }
      }
      
      console.log(`Student ${studentId} not found in backup sheet or placement days missing`);
      return null;
      
    } catch (error) {
      console.error(`Error accessing backup sheet for placement days: ${error.message}`);
      return null;
    }
  }

  /**
   * Calculates educational factors (504 and ESL status).
   */
  _calculateEducationalFactors(registrationEntry) {
    const educationalFactors = registrationEntry?.["Educational Factors"];
    
    const contains504 = (value) => {
      const str = value !== null && value !== undefined ? value.toString() : "";
      return str.includes("504") ? "Yes" : "No";
    };

    const containsESL = (value) => {
      const str = value !== null && value !== undefined ? value.toString() : "";
      return str.includes("ESL") ? "Yes" : "No";
    };

    return {
      contains504Result: contains504(educationalFactors),
      containsESLResult: containsESL(educationalFactors)
    };
  }

  /**
   * Extracts student names.
   */
  _extractNames(studentData, tentativeEntry, entryWithdrawalEntry) {
    const fullName = entryWithdrawalEntry["Student Name(Last, First)"] || "";
    const [backUpLastName = "", backUpFirstName = ""] = fullName.split(",").map(name => name.trim());
    
    return {
      lastName: tentativeEntry["LAST"] || backUpLastName,
      firstName: tentativeEntry["FIRST"] || backUpFirstName
    };
  }

  /**
   * Gets the date added to spreadsheet.
   */
  _getDateAddedToSpreadsheet(tentativeEntry) {
    return tentativeEntry["DATE ADDED TO SPREADSHEET"] ?
      this.dateUtils.formatToMMDDYYYY(tentativeEntry["DATE ADDED TO SPREADSHEET"]) :
      this.dateUtils.formatToMMDDYYYY(new Date());
  }

  /**
   * Gets the student's grade.
   */
  _getGrade(tentativeEntry, entryWithdrawalEntry) {
    // @todo Look to see what value entryWithdrawalEntry["Grd Lvl"] has and determin if it's needed on the statement below.
    return tentativeEntry["GRADE"] || entryWithdrawalEntry["Grd Lvl"] || null;
  }

  /**
   * Gets formatted entry date.
   */
  _getFormattedEntryDate(entryWithdrawalEntry) {
    const entryData = entryWithdrawalEntry["Entry Date"];
    return entryData ? this.dateUtils.formatToMMDDYYYY(entryData) : null;
  }

  /**
   * Builds period-specific data array.
   * Now preserves existing comments from TENTATIVE sheet when no form responses exist.
   */
  _buildPeriodData(period, teacherInput, tentativeEntry) {
    const periodData = teacherInput[period] || {};
    
    return [
      periodData["Course Title"] || "",
      periodData["Teacher Name"] || "",
      tentativeEntry?.[`${period} Period - Transfer Grade`] ?? "",
      tentativeEntry?.[`${period} Period - Current Grade`] ?? "",
      periodData["How would you assess this student's academic growth?"] || 
        tentativeEntry?.[`${period} Period - How would you assess this student's academic progress?`] || 
        tentativeEntry?.[`${period} Period - How would you assess this student's progress?`] || "",
      periodData["Academic and Behavioral Progress Notes"] || 
        tentativeEntry?.[`${period} Period - Academic and Behavioral Progress Notes`] || ""
    ];
  }

  /**
   * Builds special education data array.
   * Now preserves existing SE comments from TENTATIVE sheet when no form responses exist.
   */
  _buildSpecialEducationData(teacherInput, tentativeEntry) {
    const seData = teacherInput["Special Education"] || {};
    
    return [
      seData["Case Manager"] || 
        tentativeEntry?.["SE - Special Education Case Manager"] || "",
      seData["What accommodations seem to work well with this student to help them be successful?"] || 
        tentativeEntry?.["SE - What accommodations seem to work well with this student to help them be successful?"] || "",
      seData["What are the student's strengths, as far as behavior?"] || 
        tentativeEntry?.["SE - What are the student's strengths, as far as behavior?"] || "",
      seData["What are the student's needs, as far as behavior?"] || 
        tentativeEntry?.["SE - What are the student's needs, as far as behavior?  (Pick behavior having most effect on his/her ability to be successful in class.  If there are no concerns, note that.)"] || "",
      seData["What are the student's needs, as far as functional skills?"] || 
        tentativeEntry?.["SE - What are the student's needs, as far as functional skills?  (Include daily living skills, fine/gross motor skills, organizational skills, self-advocacy, attendance, etc.)"] || "",
      seData["Please add any other comments or concerns here:"] || 
        tentativeEntry?.["SE - Please add any other comments or concerns here:"] || ""
    ];
  }

  /**
   * Builds an error row when data processing fails.
   */
  _buildErrorRow(studentId, errorMessage) {
    const errorRow = new Array(60).fill("");  // Assuming ~60 columns
    errorRow[0] = this.dateUtils.formatToMMDDYYYY(new Date());
    errorRow[1] = "ERROR";
    errorRow[2] = "ERROR";
    errorRow[3] = studentId;
    errorRow[4] = `Error: ${errorMessage}`;
    
    return errorRow;
  }
}
