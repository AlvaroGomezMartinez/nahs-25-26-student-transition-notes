/**
 * Schedule Processor
 * 
 * Handles schedule-specific processing including filtering active courses,
 * mapping periods, and processing teacher assignments.
 */

class ScheduleProcessor extends BaseDataProcessor {
  constructor() {
    super('ScheduleProcessor');
  }

  /**
   * Processes schedule data for all students
   * @param {Map} scheduleData - Raw schedule data map
   * @returns {Map} Processed schedule data
   */
  process(scheduleData) {
    this.log('Starting schedule processing...');

    if (!this.validateMapInput(scheduleData, 'scheduleData')) {
      return new Map();
    }

    const processedSchedules = new Map();

    scheduleData.forEach((schedules, studentId) => {
      const processedStudentSchedules = this.processStudentSchedules(studentId, schedules);
      
      if (processedStudentSchedules.length > 0) {
        processedSchedules.set(studentId, processedStudentSchedules);
      }
    });

    this.log(`Schedule processing complete. Students with schedules: ${processedSchedules.size}`);
    return processedSchedules;
  }

  /**
   * Processes schedules for a single student
   * @param {number} studentId - Student ID
   * @param {Array} schedules - Array of schedule records
   * @returns {Array} Processed schedule array
   */
  processStudentSchedules(studentId, schedules) {
    if (!Array.isArray(schedules)) {
      this.log(`Invalid schedule data for student ${studentId}: not an array`, 'warn');
      return [];
    }

    return schedules
      .filter(schedule => this.isActiveSchedule(schedule))
      .map(schedule => this.enrichScheduleData(schedule))
      .sort((a, b) => this.compareSchedulesByPeriod(a, b));
  }

  /**
   * Determines if a schedule record represents an active course
   * @param {Object} schedule - Schedule record
   * @returns {boolean} True if schedule is active
   */
  isActiveSchedule(schedule) {
    if (!schedule || typeof schedule !== 'object') {
      return false;
    }

    const withdrawDate = schedule[COLUMN_NAMES.WITHDRAW_DATE];
    
    // Schedule is active if there's no withdrawal date
    return !withdrawDate || withdrawDate === '' || withdrawDate === null;
  }

  /**
   * Enriches schedule data with additional computed fields
   * @param {Object} schedule - Original schedule record
   * @returns {Object} Enriched schedule record
   */
  enrichScheduleData(schedule) {
    const enriched = { ...schedule };

    // Add period number for easier sorting/processing
    const periodText = schedule[COLUMN_NAMES.PERIOD];
    enriched.periodNumber = this.extractPeriodNumber(periodText);

    // Ensure teacher name is properly formatted
    enriched[COLUMN_NAMES.TEACHER_NAME] = this.formatTeacherName(
      schedule[COLUMN_NAMES.TEACHER_NAME]
    );

    // Add course type classification
    enriched.courseType = this.classifyCourse(schedule[COLUMN_NAMES.COURSE_TITLE]);

    return enriched;
  }

  /**
   * Extracts period number from period text
   * @param {string} periodText - Period text (e.g., "1st", "2nd")
   * @returns {number} Period number (1-8)
   */
  extractPeriodNumber(periodText) {
    if (!periodText || typeof periodText !== 'string') {
      return 0;
    }

    // Handle numeric periods
    if (typeof periodText === 'number') {
      return periodText;
    }

    // Extract number from text like "1st", "2nd", etc.
    const match = periodText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Formats teacher name consistently
   * @param {string} teacherName - Raw teacher name
   * @returns {string} Formatted teacher name
   */
  formatTeacherName(teacherName) {
    if (!teacherName || typeof teacherName !== 'string') {
      return DEFAULT_VALUES.UNKNOWN_TEACHER;
    }

    // Remove extra whitespace and ensure consistent formatting
    return teacherName.trim();
  }

  /**
   * Classifies course type based on course title
   * @param {string} courseTitle - Course title
   * @returns {string} Course classification
   */
  classifyCourse(courseTitle) {
    if (!courseTitle || typeof courseTitle !== 'string') {
      return 'Unknown';
    }

    const title = courseTitle.toLowerCase();

    if (title.includes('math') || title.includes('algebra') || title.includes('geometry')) {
      return 'Mathematics';
    }
    
    if (title.includes('english') || title.includes('language arts') || title.includes('reading')) {
      return 'English Language Arts';
    }
    
    if (title.includes('science') || title.includes('biology') || title.includes('chemistry')) {
      return 'Science';
    }
    
    if (title.includes('social studies') || title.includes('history') || title.includes('government')) {
      return 'Social Studies';
    }
    
    if (title.includes('special education') || title.includes('case manag')) {
      return 'Special Education';
    }

    return 'Elective';
  }

  /**
   * Compares schedules by period for sorting
   * @param {Object} scheduleA - First schedule
   * @param {Object} scheduleB - Second schedule
   * @returns {number} Comparison result
   */
  compareSchedulesByPeriod(scheduleA, scheduleB) {
    const periodA = scheduleA.periodNumber || 0;
    const periodB = scheduleB.periodNumber || 0;
    
    return periodA - periodB;
  }

  /**
   * Groups schedules by period for easier access
   * @param {Array} schedules - Array of schedule records
   * @returns {Object} Object with periods as keys
   */
  groupSchedulesByPeriod(schedules) {
    const grouped = {};

    if (!Array.isArray(schedules)) {
      return grouped;
    }

    schedules.forEach(schedule => {
      const period = schedule.periodNumber || 0;
      const periodKey = this.getPeriodKey(period);
      
      if (!grouped[periodKey]) {
        grouped[periodKey] = [];
      }
      
      grouped[periodKey].push(schedule);
    });

    return grouped;
  }

  /**
   * Gets the period key for grouping (1st, 2nd, etc.)
   * @param {number} periodNumber - Period number
   * @returns {string} Period key
   */
  getPeriodKey(periodNumber) {
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

    return periodMap[periodNumber] || `Period_${periodNumber}`;
  }

  /**
   * Finds schedules for specific teacher
   * @param {Array} schedules - Array of schedule records
   * @param {string} teacherName - Teacher name to find
   * 
   * @todo Find out if this function can be used to create
   * individualized schedules for teachers' emails.
   * 
   * @returns {Array} Matching schedule records
   */
  findSchedulesForTeacher(schedules, teacherName) {
    if (!Array.isArray(schedules) || !teacherName) {
      return [];
    }

    return schedules.filter(schedule => 
      schedule[COLUMN_NAMES.TEACHER_NAME] === teacherName
    );
  }

  /**
   * Gets all unique teachers from schedules
   * @param {Array} schedules - Array of schedule records
   * @returns {Array} Array of unique teacher names
   */
  getUniqueTeachers(schedules) {
    if (!Array.isArray(schedules)) {
      return [];
    }

    const teachers = new Set();
    
    schedules.forEach(schedule => {
      const teacher = schedule[COLUMN_NAMES.TEACHER_NAME];
      if (teacher && teacher !== DEFAULT_VALUES.UNKNOWN_TEACHER) {
        teachers.add(teacher);
      }
    });

    return Array.from(teachers).sort();
  }
}
