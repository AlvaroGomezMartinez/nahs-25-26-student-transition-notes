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
 * @author NAHS Development Team
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
 * - **Schedule Integration**: Correlates teacher input with student schedule information
 * - **Multi-Teacher Coordination**: Handles multiple teacher responses per student
 * - **Recommendation Synthesis**: Processes teacher recommendations and feedback
 * - **Data Validation**: Ensures teacher input data integrity and completeness
 * 
 * @class TeacherInputProcessor
 * @extends BaseDataProcessor
 * @memberof DataProcessors
 * 
 * @example
 * // Process teacher input for a student
 * const processor = new TeacherInputProcessor();
 * const studentData = mergedStudentData.get('123456');
 * const teacherInput = processor.processTeacherInput('123456', studentData);
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

    // Try to populate from form responses first (preferred method)
    if (formResponses && Array.isArray(formResponses) && formResponses.length > 0) {
      this.populateFromFormResponses(teacherInput, formResponses, scheduleData, studentId);
    } else {
      // Fallback to schedule and tentative data
      this.log(`No form responses for student ${studentId}, using fallback method`);
      this.populateFromScheduleAndTentative(teacherInput, scheduleData, tentativeData, studentId);
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
   * Populates teacher input from form responses data
   * @param {Object} teacherInput - Teacher input structure to populate
   * @param {Array} formResponses - Form responses data
   * @param {Array} scheduleData - Schedule data for reference
   */
  populateFromFormResponses(teacherInput, formResponses, scheduleData) {
    this.log('Populating teacher input from form responses');

    const flatSchedules = this.flattenScheduleArray(scheduleData);

    formResponses.forEach(response => {
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
    // Map basic course information
    periodInput[COLUMN_NAMES.COURSE_TITLE] = 
      schedule[COLUMN_NAMES.COURSE_TITLE] || DEFAULT_VALUES.EMPTY_STRING;
    periodInput[COLUMN_NAMES.TEACHER_NAME] = 
      response[COLUMN_NAMES.TEACHER_NAME] || DEFAULT_VALUES.EMPTY_STRING;

    // Map form response fields to teacher input
    const fieldMappings = {
      'How would you assess this student\'s academic growth?': 'How would you assess this student\'s academic progress?',
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

        teacherInput[period]["Course Title"] = 
          tentativeEntry[`${periodPrefix} - Course Title`] || "";
        teacherInput[period]["Teacher Name"] = 
          tentativeEntry[`${periodPrefix} - Teacher Name`] || "";
        teacherInput[period]["Transfer Grade"] = 
          tentativeEntry[`${periodPrefix} - Transfer Grade`] || "";
        teacherInput[period]["Current Grade"] = 
          tentativeEntry[`${periodPrefix} - Current Grade`] || "";
        teacherInput[period]["How would you assess this student's academic growth?"] = 
          tentativeEntry[`${periodPrefix} - How would you assess this student's academic growth?`] || "";
        teacherInput[period]["Academic and Behavioral Progress Notes"] = 
          tentativeEntry[`${periodPrefix} - Academic and Behavioral Progress Notes`] || "";
      }
    }

    // Handle Special Education separately
    if (teacherInput.hasOwnProperty("Special Education")) {
      teacherInput["Special Education"]["Case Manager"] = 
        tentativeEntry["Special Education - Case Manager"] || "";
      teacherInput["Special Education"]["What accommodations seem to work well with this student to help them be successful?"] = 
        tentativeEntry["Special Education - What accommodations seem to work well with this student to help them be successful?"] || "";
      teacherInput["Special Education"]["What are the student's strengths, as far as behavior?"] = 
        tentativeEntry["Special Education - What are the student's strengths, as far as behavior?"] || "";
      teacherInput["Special Education"]["What are the student's needs, as far as behavior?"] = 
        tentativeEntry["Special Education - What are the student's needs, as far as behavior?"] || "";
      teacherInput["Special Education"]["What are the student's needs, as far as functional skills?"] = 
        tentativeEntry["Special Education - What are the student's needs, as far as functional skills?"] || "";
      teacherInput["Special Education"]["Please add any other comments or concerns here:"] = 
        tentativeEntry["Special Education - Please add any other comments or concerns here:"] || "";
    }
  }
}
