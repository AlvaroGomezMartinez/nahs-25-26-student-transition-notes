/**
 * @fileoverview Teacher Input Processor for the NAHS system.
 * 
 * This module provides specialized functionality for processing complex teacher
 * input data from form responses and schedule information. It handles the intricate
 * logic required to merge teacher feedback, schedule data, and student information
 * into coherent teacher input structures for transition decision-making.
 * 
 * The processor replaces nested teacher input functions from the original monolithic
 * approach with a clean, maintainable class-based architecture.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof DataProcessors
 */

/**
 * Processes teacher input data for student transition tracking.
 * 
 * This specialized processor handles the complex logic required to transform
 * raw teacher form responses and schedule data into structured teacher input
 * information. It coordinates teacher feedback, schedule assignments, and
 * recommendation processing for comprehensive transition decision support.
 * 
 * **Key Features:**
 * - **Form Response Processing**: Transforms teacher form submissions into structured data
 * - **Duplicate Submission Handling**: Automatically detects and resolves multiple submissions from the same teacher for the same student, using the most recent response
 * - **Schedule Integration**: Correlates teacher input with student schedule information
 * - **Multi-Teacher Coordination**: Handles multiple teacher responses per student
 * - **Recommendation Synthesis**: Processes teacher recommendations and feedback
 * - **Data Validation**: Ensures teacher input data integrity and completeness
 * - **Smart Data Precedence**: Form response data takes precedence over tentative data, with intelligent fallback handling
 * 
 * @class TeacherInputProcessor
 * @extends BaseDataProcessor
 * @memberof DataProcessors
 * 
 * @example
 * // Process teacher input for a student with duplicate detection
 * const processor = new TeacherInputProcessor();
 * const studentData = mergedStudentData.get('123456');
 * const teacherInput = processor.processTeacherInput('123456', studentData);
 * // Automatically uses most recent teacher responses
 * 
 * @example
 * // Process teacher input with validation
 * const processor = new TeacherInputProcessor();
 * const result = processor.processTeacherInput(studentId, studentData);
 * if (result && result.teacherRecommendations) {
 *   console.log(`Found ${result.teacherRecommendations.length} teacher recommendations`);
 * }
 * 
 * @since 2.0.0
 * @version 2.1.0 - Added duplicate teacher submission detection and enhanced data precedence logic
 */
class TeacherInputProcessor extends BaseDataProcessor {
  constructor() {
    super('TeacherInputProcessor');
  }

  /**
   * Processes teacher input data for a single student (main entry point)
   * @param {string} studentId - The student ID
   * @param {Object} studentData - Complete student data from all sources
   * @returns {Object} Processed teacher input structure
   */
  processTeacherInput(studentId, studentData) {
    const processingData = {
      studentId,
      formResponses: studentData["Form_Responses_1"],
      scheduleData: studentData["Schedules"],
      tentativeData: studentData["TENTATIVE"]
    };

    return this.process(processingData);
  }

  /**
   * Processes teacher input data for a single student
   * @param {Object} processingData - Data needed for processing
   * @returns {Object} Processed teacher input structure
   */
  process(processingData) {
    const { 
      studentId, 
      formResponses, 
      scheduleData, 
      tentativeData 
    } = processingData;

    this.log(`Processing teacher input for student ${studentId}`);

    // Initialize the teacher input structure
    const teacherInput = this.initializeTeacherInputStructure();

    // ALWAYS populate base course titles and teacher names from schedule data first
    if (scheduleData && Array.isArray(scheduleData)) {
      this.populateBasicScheduleData(teacherInput, scheduleData);
    }

    // Then overlay form response data if available
    if (formResponses && Array.isArray(formResponses) && formResponses.length > 0) {
      this.log(`Processing form responses for student ${studentId}`);
      this.populateFromFormResponses(teacherInput, formResponses, scheduleData, studentId);
    } else {
      this.log(`No form responses for student ${studentId}`);
    }

    // Finally, overlay tentative data if available
    if (tentativeData && Array.isArray(tentativeData) && tentativeData.length > 0) {
      this.populateFromTentativeData(teacherInput, tentativeData[0], studentId);
    }

    return teacherInput;
  }

  /**
   * Initializes the teacher input structure with all periods and special education
   * @returns {Object} Initial teacher input structure
   */
  initializeTeacherInputStructure() {
    const periods = [
      PERIODS.FIRST, PERIODS.SECOND, PERIODS.THIRD, PERIODS.FOURTH,
      PERIODS.FIFTH, PERIODS.SIXTH, PERIODS.SEVENTH, PERIODS.EIGHTH
    ];

    const structure = {};

    // Initialize all periods
    periods.forEach(period => {
      structure[period] = {
        [COLUMN_NAMES.COURSE_TITLE]: DEFAULT_VALUES.EMPTY_STRING,
        [COLUMN_NAMES.TEACHER_NAME]: DEFAULT_VALUES.EMPTY_STRING,
        'Transfer Grade': DEFAULT_VALUES.EMPTY_STRING,
        'Current Grade': DEFAULT_VALUES.EMPTY_STRING,
        'How would you assess this student\'s academic growth?': DEFAULT_VALUES.EMPTY_STRING,
        'Academic and Behavioral Progress Notes': DEFAULT_VALUES.EMPTY_STRING
      };
    });

    // Initialize Special Education section
    structure[PERIODS.SPECIAL_ED] = {
      [COLUMN_NAMES.CASE_MANAGER]: DEFAULT_VALUES.EMPTY_STRING,
      'What accommodations seem to work well with this student to help them be successful?': DEFAULT_VALUES.EMPTY_STRING,
      'What are the student\'s strengths, as far as behavior?': DEFAULT_VALUES.EMPTY_STRING,
      'What are the student\'s needs, as far as behavior?': DEFAULT_VALUES.EMPTY_STRING,
      'What are the student\'s needs, as far as functional skills?': DEFAULT_VALUES.EMPTY_STRING,
      'Please add any other comments or concerns here:': DEFAULT_VALUES.EMPTY_STRING
    };

    return structure;
  }

  /**
   * Populates basic course titles and teacher names from schedule data
   * This ensures all periods have course information regardless of form response availability
   * @param {Object} teacherInput - Teacher input structure to populate
   * @param {Array} scheduleData - Schedule data
   */
  populateBasicScheduleData(teacherInput, scheduleData) {
    this.log('Populating basic course titles and teacher names from schedule data');

    const flatSchedules = this.flattenScheduleArray(scheduleData);

    flatSchedules.forEach(schedule => {
      const period = this.mapPeriodFromSchedule(schedule[COLUMN_NAMES.PERIOD]);
      
      if (period && teacherInput[period]) {
        // Only populate Course Title and Teacher Name, don't overwrite other fields
        teacherInput[period][COLUMN_NAMES.COURSE_TITLE] = 
          schedule[COLUMN_NAMES.COURSE_TITLE] || DEFAULT_VALUES.EMPTY_STRING;
        teacherInput[period][COLUMN_NAMES.TEACHER_NAME] = 
          schedule[COLUMN_NAMES.TEACHER_NAME] || DEFAULT_VALUES.EMPTY_STRING;
        
        // Handle case manager assignment
        if (schedule[COLUMN_NAMES.COURSE_TITLE] === 'Case Manag HS') {
          teacherInput[PERIODS.SPECIAL_ED][COLUMN_NAMES.CASE_MANAGER] = 
            schedule[COLUMN_NAMES.TEACHER_NAME] || DEFAULT_VALUES.EMPTY_STRING;
        }
      }
    });
  }

  /**
   * Populates teacher input from form responses data
   * @param {Object} teacherInput - Teacher input structure to populate
   * @param {Array} formResponses - Form responses data
   * @param {Array} scheduleData - Schedule data for reference
   */
  populateFromFormResponses(teacherInput, formResponses, scheduleData) {
    this.log('Populating teacher input from form responses');

    const flatSchedules = this.flattenScheduleArray(scheduleData);
    
    // Process form responses and handle multiple submissions from same teacher
    const processedResponses = this.processMultipleResponsesPerTeacher(formResponses);

    processedResponses.forEach(response => {
      const teacherName = response[COLUMN_NAMES.TEACHER_NAME];
      
      if (!teacherName) {
        this.log('Form response missing teacher name', 'warn');
        return;
      }

      // Find matching schedule entry for this teacher
      const matchingSchedule = flatSchedules.find(schedule => 
        schedule[COLUMN_NAMES.TEACHER_NAME] === teacherName
      );

      if (matchingSchedule) {
        const period = this.mapPeriodFromSchedule(matchingSchedule[COLUMN_NAMES.PERIOD]);
        
        if (period && teacherInput[period]) {
          this.mapFormResponseToTeacherInput(teacherInput[period], response, matchingSchedule);
        } else if (teacherName.includes('Case Manag') || response['Case Manager']) {
          this.mapSpecialEducationData(teacherInput[PERIODS.SPECIAL_ED], response);
        }
      } else {
        this.log(`No matching schedule found for teacher: ${teacherName}`, 'warn');
      }
    });
  }

  /**
   * Processes multiple form responses from the same teacher, keeping only the most recent.
   * 
   * This method implements intelligent duplicate detection by grouping responses by teacher
   * name and automatically selecting the most recent submission when multiple responses
   * exist from the same teacher for the same student. This ensures that updated teacher
   * feedback always takes precedence over older submissions.
   * 
   * **Algorithm:**
   * 1. Groups responses by teacher name
   * 2. For each teacher with multiple responses, finds the most recent by timestamp
   * 3. Returns deduplicated array with one response per teacher
   * 
   * @param {Array} formResponses - Array of form response objects
   * @returns {Array} Processed array with one response per teacher (most recent)
   * 
   * @example
   * // Automatic duplicate resolution
   * const responses = [
   *   { teacherName: "Smith, John", timestamp: "2024-01-01", feedback: "Old feedback" },
   *   { teacherName: "Smith, John", timestamp: "2024-01-02", feedback: "Updated feedback" }
   * ];
   * const result = processor.processMultipleResponsesPerTeacher(responses);
   * // Returns: [{ teacherName: "Smith, John", timestamp: "2024-01-02", feedback: "Updated feedback" }]
   * 
   * @since 2.1.0
   */
  processMultipleResponsesPerTeacher(formResponses) {
    if (!formResponses || !Array.isArray(formResponses)) {
      return [];
    }

    // Group responses by teacher name
    const responsesByTeacher = new Map();
    
    formResponses.forEach(response => {
      const teacherName = response[COLUMN_NAMES.TEACHER_NAME];
      
      if (!teacherName) {
        return; // Skip responses without teacher name
      }
      
      if (!responsesByTeacher.has(teacherName)) {
        responsesByTeacher.set(teacherName, []);
      }
      
      responsesByTeacher.get(teacherName).push(response);
    });

    // Process each teacher's responses to find the most recent
    const finalResponses = [];
    
    responsesByTeacher.forEach((responses, teacherName) => {
      if (responses.length === 1) {
        // Only one response from this teacher, use it
        finalResponses.push(responses[0]);
      } else {
        // Multiple responses from same teacher, find the most recent
        this.log(`Found ${responses.length} responses from teacher: ${teacherName}`, 'info');
        
        const mostRecentResponse = this.findMostRecentResponse(responses, teacherName);
        finalResponses.push(mostRecentResponse);
        
        this.log(`Using most recent response from ${teacherName}`, 'info');
      }
    });

    return finalResponses;
  }

  /**
   * Finds the most recent response from multiple responses by the same teacher.
   * 
   * Uses timestamp analysis to determine the most recent submission when a teacher
   * has submitted multiple responses for the same student. Supports various timestamp
   * field formats commonly used in Google Forms and provides fallback logic when
   * timestamps are unavailable.
   * 
   * **Timestamp Detection:**
   * - Searches for common timestamp field names: 'Timestamp', 'Date', 'Submit Time'
   * - Handles both Date objects and string representations
   * - Falls back to array position when no timestamp is available
   * 
   * @param {Array} responses - Array of response objects from the same teacher
   * @param {string} teacherName - Teacher name for logging purposes
   * @returns {Object} The most recent response object
   * 
   * @example
   * // Timestamp-based selection
   * const responses = [
   *   { teacherName: "Doe, Jane", timestamp: "2024-01-01 10:00:00", feedback: "Initial" },
   *   { teacherName: "Doe, Jane", timestamp: "2024-01-01 14:30:00", feedback: "Updated" }
   * ];
   * const latest = processor.findMostRecentResponse(responses, "Doe, Jane");
   * // Returns the 14:30:00 response
   * 
   * @since 2.1.0
   */
  findMostRecentResponse(responses, teacherName) {
    // Look for timestamp field to determine most recent
    // Common timestamp field names in Google Forms
    const timestampFields = ['Timestamp', 'timestamp', 'Date', 'date', 'Submit Time', 'Submitted'];
    
    let timestampField = null;
    
    // Find which timestamp field exists in the responses
    for (const field of timestampFields) {
      if (responses[0].hasOwnProperty(field)) {
        timestampField = field;
        break;
      }
    }
    
    if (timestampField) {
      // Sort by timestamp and return the most recent
      const sortedResponses = responses.sort((a, b) => {
        const dateA = new Date(a[timestampField]);
        const dateB = new Date(b[timestampField]);
        return dateB - dateA; // Most recent first
      });
      
      const mostRecent = sortedResponses[0];
      const oldestDate = new Date(sortedResponses[sortedResponses.length - 1][timestampField]);
      const newestDate = new Date(mostRecent[timestampField]);
      
      this.log(`Teacher ${teacherName}: Using response from ${newestDate.toLocaleString()} (vs oldest: ${oldestDate.toLocaleString()})`, 'info');
      
      return mostRecent;
    } else {
      // No timestamp field found, use the last response in the array (assuming it's more recent)
      this.log(`No timestamp field found for teacher ${teacherName}, using last response in data`, 'warn');
      return responses[responses.length - 1];
    }
  }

  /**
   * Populates teacher input from schedule and tentative data (fallback method)
   * @param {Object} teacherInput - Teacher input structure to populate
   * @param {Array} scheduleData - Schedule data
   * @param {Array} tentativeData - Tentative data
   */
  populateFromScheduleAndTentative(teacherInput, scheduleData, tentativeData) {
    this.log('Populating teacher input from schedule and tentative data (fallback)');

    if (!scheduleData || !Array.isArray(scheduleData)) {
      this.log('No valid schedule data for fallback method', 'warn');
      return;
    }

    // Map schedule data to teacher input
    scheduleData.forEach(schedule => {
      const period = this.mapPeriodFromSchedule(schedule[COLUMN_NAMES.PERIOD]);
      
      if (period && teacherInput[period]) {
        teacherInput[period][COLUMN_NAMES.COURSE_TITLE] = 
          schedule[COLUMN_NAMES.COURSE_TITLE] || DEFAULT_VALUES.EMPTY_STRING;
        teacherInput[period][COLUMN_NAMES.TEACHER_NAME] = 
          schedule[COLUMN_NAMES.TEACHER_NAME] || DEFAULT_VALUES.EMPTY_STRING;
        
        // Handle case manager assignment
        if (schedule[COLUMN_NAMES.COURSE_TITLE] === 'Case Manag HS') {
          teacherInput[period][COLUMN_NAMES.CASE_MANAGER] = 
            schedule[COLUMN_NAMES.TEACHER_NAME] || DEFAULT_VALUES.EMPTY_STRING;
        }
      }
    });

    // If tentative data exists, use it to fill in additional information
    if (tentativeData && Array.isArray(tentativeData) && tentativeData.length > 0) {
      this.mapTentativeToTeacherInput(teacherInput, tentativeData[0]);
    }
  }

  /**
   * Maps form response data to teacher input structure
   * @param {Object} periodInput - Period-specific teacher input object
   * @param {Object} response - Form response data
   * @param {Object} schedule - Matching schedule data
   */
  mapFormResponseToTeacherInput(periodInput, response, schedule) {
    // NOTE: Course Title and Teacher Name are already populated from schedule data
    // We only overlay the form response-specific data here
    
    // Map form response fields to teacher input
    const fieldMappings = {
      'How would you assess this student\'s academic growth?': 'How would you assess this student\'s academic growth?',
      'Academic and Behavioral Progress Notes': 'Academic and Behavioral Progress Notes'
    };

    Object.entries(fieldMappings).forEach(([inputField, responseField]) => {
      if (response[responseField]) {
        periodInput[inputField] = response[responseField];
      }
    });
  }

  /**
   * Maps special education data from form responses
   * @param {Object} specialEdInput - Special education input object
   * @param {Object} response - Form response data
   */
  mapSpecialEducationData(specialEdInput, response) {
    const specialEdMappings = {
      [COLUMN_NAMES.CASE_MANAGER]: 'Case Manager',
      'What accommodations seem to work well with this student to help them be successful?': 
        'What accommodations seem to work well with this student to help them be successful?',
      'What are the student\'s strengths, as far as behavior?': 
        'What are the student\'s strengths, as far as behavior?',
      'What are the student\'s needs, as far as behavior?': 
        'What are the student\'s needs, as far as behavior?',
      'What are the student\'s needs, as far as functional skills?': 
        'What are the student\'s needs, as far as functional skills?',
      'Please add any other comments or concerns here:': 
        'Please add any other comments or concerns here:'
    };

    Object.entries(specialEdMappings).forEach(([inputField, responseField]) => {
      if (response[responseField]) {
        specialEdInput[inputField] = response[responseField];
      }
    });
  }

  /**
   * Maps tentative data to teacher input (for fallback method)
   * @param {Object} teacherInput - Teacher input structure
   * @param {Object} tentativeEntry - Tentative data entry
   */
  mapTentativeToTeacherInput(teacherInput, tentativeEntry) {
    if (!tentativeEntry || typeof tentativeEntry !== 'object') {
      return;
    }

    // Map period-specific data from tentative sheet
    const periods = [
      PERIODS.FIRST, PERIODS.SECOND, PERIODS.THIRD, PERIODS.FOURTH,
      PERIODS.FIFTH, PERIODS.SIXTH, PERIODS.SEVENTH, PERIODS.EIGHTH
    ];

    periods.forEach(period => {
      const courseKey = `${period} Period - ${COLUMN_NAMES.COURSE_TITLE}`;
      const teacherKey = `${period} Period - ${COLUMN_NAMES.TEACHER_NAME}`;
      
      if (tentativeEntry[courseKey]) {
        teacherInput[period][COLUMN_NAMES.COURSE_TITLE] = tentativeEntry[courseKey];
      }
      
      if (tentativeEntry[teacherKey]) {
        teacherInput[period][COLUMN_NAMES.TEACHER_NAME] = tentativeEntry[teacherKey];
      }
    });

    // Map special education data from tentative sheet
    const specialEdPrefix = 'Special Education - ';
    Object.keys(teacherInput[PERIODS.SPECIAL_ED]).forEach(field => {
      const tentativeKey = specialEdPrefix + field;
      if (tentativeEntry[tentativeKey]) {
        teacherInput[PERIODS.SPECIAL_ED][field] = tentativeEntry[tentativeKey];
      }
    });
  }

  /**
   * Maps period from schedule format to teacher input period format
   * @param {string|number} schedulePeriod - Period from schedule data
   * @returns {string} Mapped period key
   */
  mapPeriodFromSchedule(schedulePeriod) {
    if (typeof schedulePeriod === 'number') {
      const periodMap = {
        1: PERIODS.FIRST,
        2: PERIODS.SECOND,
        3: PERIODS.THIRD,
        4: PERIODS.FOURTH,
        5: PERIODS.FIFTH,
        6: PERIODS.SIXTH,
        7: PERIODS.SEVENTH,
        8: PERIODS.EIGHTH
      };
      return periodMap[schedulePeriod];
    }

    // Handle string periods
    if (typeof schedulePeriod === 'string') {
      const periodNumber = parseInt(schedulePeriod.match(/\d+/)?.[0]);
      return this.mapPeriodFromSchedule(periodNumber);
    }

    return null;
  }

  /**
   * Flattens nested schedule array structure
   * @param {Array} scheduleArray - Schedule array data
   * @returns {Array} Flattened schedule array
   */
  flattenScheduleArray(scheduleArray) {
    if (!Array.isArray(scheduleArray)) {
      return [];
    }

    return scheduleArray.reduce((flat, item) => {
      if (Array.isArray(item)) {
        return flat.concat(this.flattenScheduleArray(item));
      }
      return flat.concat(item);
    }, []);
  }

  /**
   * Helper function to flatten arrays (general purpose)
   * @param {Array} array - Array to flatten
   * @returns {Array} Flattened array
   */
  flattenArray(array) {
    if (!Array.isArray(array)) {
      return [];
    }
    return array.reduce((flat, current) => flat.concat(current), []);
  }

  /**
   * Converts numeric period to string format
   * @param {number} period - Numeric period (1-8)
   * @returns {string|null} String period format or null if invalid
   */
  periodToNumber(period) {
    const periodMapping = {
      1: "1st",
      2: "2nd", 
      3: "3rd",
      4: "4th",
      5: "5th",
      6: "6th",
      7: "7th",
      8: "8th",
      9: "Special Education",
    };
    return periodMapping[period] || null;
  }

  /**
   * Populates teacher input from schedule data for a specific period
   * @param {Object} teacherInput - Teacher input structure
   * @param {string} period - Period string
   * @param {Array} flatScheduleData - Flattened schedule data
   * @param {string} studentId - Student ID for logging
   */
  populateFromScheduleData(teacherInput, period, flatScheduleData, studentId) {
    // Find matching schedule entry for this period
    for (let i = 0; i < flatScheduleData.length; i++) {
      const scheduleEntry = flatScheduleData[i];
      
      if (scheduleEntry && scheduleEntry.hasOwnProperty("Per Beg")) {
        const periodNumber = this.periodToNumber(scheduleEntry["Per Beg"]);
        
        if (periodNumber === period) {
          teacherInput[period]["Teacher Name"] = 
            scheduleEntry["Teacher Name"] || "";
          teacherInput[period]["Course Title"] = 
            scheduleEntry["Course Title"] || "";
          teacherInput[period]["Case Manager"] = 
            scheduleEntry["Teacher Name"] || "";
          break;
        }
      }
    }
  }

  /**
   * Populates teacher input from tentative data
   * @param {Object} teacherInput - Teacher input structure
   * @param {Object} tentativeEntry - Tentative data entry
   * @param {string} studentId - Student ID for logging
   */
  populateFromTentativeData(teacherInput, tentativeEntry, studentId) {
    const periodMap = {
      "1st": "1st Period",
      "2nd": "2nd Period", 
      "3rd": "3rd Period",
      "4th": "4th Period",
      "5th": "5th Period",
      "6th": "6th Period",
      "7th": "7th Period", 
      "8th": "8th Period",
    };

    for (const period in teacherInput) {
      if (teacherInput.hasOwnProperty(period) && periodMap.hasOwnProperty(period)) {
        const periodPrefix = periodMap[period];

        // Only overlay tentative data if it exists, don't replace with empty strings
        if (tentativeEntry[`${periodPrefix} - Course Title`]) {
          teacherInput[period]["Course Title"] = tentativeEntry[`${periodPrefix} - Course Title`];
        }
        if (tentativeEntry[`${periodPrefix} - Teacher Name`]) {
          teacherInput[period]["Teacher Name"] = tentativeEntry[`${periodPrefix} - Teacher Name`];
        }
        if (tentativeEntry[`${periodPrefix} - Transfer Grade`]) {
          teacherInput[period]["Transfer Grade"] = tentativeEntry[`${periodPrefix} - Transfer Grade`];
        }
        if (tentativeEntry[`${periodPrefix} - Current Grade`]) {
          teacherInput[period]["Current Grade"] = tentativeEntry[`${periodPrefix} - Current Grade`];
        }
        if (tentativeEntry[`${periodPrefix} - How would you assess this student's academic growth?`]) {
          // Only use tentative data if no form response data exists
          if (!teacherInput[period]["How would you assess this student's academic growth?"]) {
            teacherInput[period]["How would you assess this student's academic growth?"] = 
              tentativeEntry[`${periodPrefix} - How would you assess this student's academic growth?`];
          }
        }
        if (tentativeEntry[`${periodPrefix} - Academic and Behavioral Progress Notes`]) {
          // Only use tentative data if no form response data exists
          if (!teacherInput[period]["Academic and Behavioral Progress Notes"]) {
            teacherInput[period]["Academic and Behavioral Progress Notes"] = 
              tentativeEntry[`${periodPrefix} - Academic and Behavioral Progress Notes`];
          }
        }
      }
    }

    // Handle Special Education separately
    if (teacherInput.hasOwnProperty("Special Education")) {
      // Only overlay tentative data if it exists, don't replace with empty strings
      if (tentativeEntry["Special Education - Case Manager"]) {
        teacherInput["Special Education"]["Case Manager"] = 
          tentativeEntry["Special Education - Case Manager"];
      }
      if (tentativeEntry["Special Education - What accommodations seem to work well with this student to help them be successful?"]) {
        teacherInput["Special Education"]["What accommodations seem to work well with this student to help them be successful?"] = 
          tentativeEntry["Special Education - What accommodations seem to work well with this student to help them be successful?"];
      }
      if (tentativeEntry["Special Education - What are the student's strengths, as far as behavior?"]) {
        teacherInput["Special Education"]["What are the student's strengths, as far as behavior?"] = 
          tentativeEntry["Special Education - What are the student's strengths, as far as behavior?"];
      }
      if (tentativeEntry["Special Education - What are the student's needs, as far as behavior?"]) {
        teacherInput["Special Education"]["What are the student's needs, as far as behavior?"] = 
          tentativeEntry["Special Education - What are the student's needs, as far as behavior?"];
      }
      if (tentativeEntry["Special Education - What are the student's needs, as far as functional skills?"]) {
        teacherInput["Special Education"]["What are the student's needs, as far as functional skills?"] = 
          tentativeEntry["Special Education - What are the student's needs, as far as functional skills?"];
      }
      if (tentativeEntry["Special Education - Please add any other comments or concerns here:"]) {
        teacherInput["Special Education"]["Please add any other comments or concerns here:"] = 
          tentativeEntry["Special Education - Please add any other comments or concerns here:"];
      }
    }
  }
}
