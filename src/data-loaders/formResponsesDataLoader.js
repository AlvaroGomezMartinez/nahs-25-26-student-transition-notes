/**
 * Form Responses Data Loader
 * 
 * Loads teacher form responses and maps them with teacher email data
 */

class FormResponsesDataLoader extends BaseDataLoader {
  constructor() {
    super(SHEET_NAMES.FORM_RESPONSES_1, COLUMN_NAMES.STUDENT_ID, true);
  }

  /**
   * Loads form responses data with teacher email mapping
   * This replaces the original getStudentsFromFormResponses1Sheet function
   * @returns {Map} Map where keys are student IDs and values are form response data
   */
  loadData() {
    try {
      console.log('Loading form responses data...');
      
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.sheetName);
      if (!sheet) {
        console.error(`Sheet '${this.sheetName}' not found`);
        return new Map();
      }

      const data = sheet.getDataRange().getValues();
      if (data.length === 0) {
        console.warn(`Sheet '${this.sheetName}' is empty`);
        return new Map();
      }

      const headers = data[0];
      const studentColumnIndex = headers.indexOf('Student');
      const emailColumnIndex = headers.indexOf('Email Address');
      
      if (studentColumnIndex === -1 || emailColumnIndex === -1) {
        console.error('Required columns not found in Form Responses sheet');
        return new Map();
      }

      return this.processFormResponseRows(data, headers, studentColumnIndex, emailColumnIndex);
    } catch (error) {
      console.error('Error loading form responses data:', error);
      return new Map();
    }
  }

  /**
   * Custom processing for form responses with teacher email mapping
   * @param {Array} data - Raw sheet data
   * @param {Array} headers - Column headers
   * @param {number} studentColumnIndex - Index of student column
   * @param {number} emailColumnIndex - Index of email column
   * @returns {Map} Processed form responses map
   */
  processFormResponseRows(data, headers, studentColumnIndex, emailColumnIndex) {
    const resultMap = new Map();
    const schedulesMap = schedulesSheet(); // Load schedules for matching

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const studentText = row[studentColumnIndex];
      const email = row[emailColumnIndex];
      
      const studentId = extractStudentId(studentText);
      if (studentId === null) {
        console.warn(`Invalid student ID at row ${i + 1} in Form Responses`);
        continue;
      }

      // Create student data object
      const studentData = this.createRowObject(row, headers);
      
      // Map email to teacher name
      if (TEACHER_EMAIL_MAPPINGS[email]) {
        studentData[COLUMN_NAMES.TEACHER_NAME] = TEACHER_EMAIL_MAPPINGS[email]['proper name'];
      } else {
        studentData[COLUMN_NAMES.TEACHER_NAME] = DEFAULT_VALUES.UNKNOWN_TEACHER;
      }

      // Perform left join with schedules data
      const scheduleDataArray = schedulesMap.get(studentId) || [];
      const matchingScheduleData = scheduleDataArray.find(
        (schedule) => schedule[COLUMN_NAMES.TEACHER_NAME] === studentData[COLUMN_NAMES.TEACHER_NAME]
      );

      if (matchingScheduleData) {
        Object.assign(studentData, matchingScheduleData);
      }

      // Add to result map
      if (resultMap.has(studentId)) {
        resultMap.get(studentId).push(studentData);
      } else {
        resultMap.set(studentId, [studentData]);
      }
    }

    return resultMap;
  }
}

/**
 * Public function that maintains compatibility with existing code
 * This replaces the original getStudentsFromFormResponses1Sheet function
 * @returns {Map} A map where the key is the Student ID and values are form response data
 */
function getStudentsFromFormResponses1Sheet() {
  const loader = new FormResponsesDataLoader();
  return loader.loadData();
}
