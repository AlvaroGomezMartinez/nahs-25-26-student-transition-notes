/**
 * Builds rows of data for the TENTATIVE-Version2 sheet.
 * Handles the complex logic of extracting and formatting data from various sources.
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
        ...this._buildSpecialEducationData(teacherInput),

        // Additional fields
        registrationEntry?.["Home Campus"] || null,
        this._getFormattedEntryDate(entryWithdrawalEntry),
        this.dateUtils.formatToMMDDYYYY(estimatedExitDay) || null,
        "", // Parent Notice Date
        "", // Withdrawn Date
        "", // Attendance Recovery
        registrationEntry?.["Eligibilty"] || null,
        "", // Credit Retrieval
        registrationEntry?.["Behavior Contract"] || null,
        "", // Campus Mentor
        "", // Other Intervention 1
        "", // Other Intervention 2
        contains504Result,
        containsESLResult,
        "", // Additional notes or counseling services and Support
        "", // Licensed social worker consultation
        "", // Check if you're ready to create Transition Letter with Autocrat
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

    const entryData = entryWithdrawalEntry["Entry Date"];
    if (!entryData) return null;

    const formattedEntryDate = this.dateUtils.formatToMMDDYYYY(entryData);
    const placementDays = registrationEntry?.["Placement Days"];
    const daysInAttendance = attendanceArray ? attendanceArray[0][4] : null;
    const daysInEnrl = attendanceArray ? attendanceArray[0][5] : 0;

    if (!formattedEntryDate || !placementDays || daysInAttendance === null) {
      return null;
    }

    const entryDateString = this.dateUtils.formatToMMDDYYYY(formattedEntryDate);
    const additionalDays = [daysInAttendance, daysInEnrl];

    return NAHS_EXPECTED_WITHDRAW_DATE(
      entryDateString,
      placementDays,
      holidayDates,
      additionalDays
    );
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
   */
  _buildPeriodData(period, teacherInput, tentativeEntry) {
    const periodData = teacherInput[period] || {};
    
    return [
      periodData["Course Title"] || "",
      periodData["Teacher Name"] || "",
      tentativeEntry?.[`${period} Period - Transfer Grade`] ?? "",
      tentativeEntry?.[`${period} Period - Current Grade`] ?? "",
      periodData["How would you assess this student's academic growth?"] || "",
      periodData["Academic and Behavioral Progress Notes"] || ""
    ];
  }

  /**
   * Builds special education data array.
   */
  _buildSpecialEducationData(teacherInput) {
    const seData = teacherInput["Special Education"] || {};
    
    return [
      seData["Case Manager"] || "",
      "", // What accommodations seem to work well
      "", // Student's strengths, behavior
      "", // Student's needs, behavior
      "", // Student's needs, functional skills
      ""  // Additional comments
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
