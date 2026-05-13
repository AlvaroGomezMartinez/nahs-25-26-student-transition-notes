# NAHS Student Transition Notes - API Reference

## 🚀 Production-Ready System API

This document provides a comprehensive overview of all documented functions, classes, and constants in the enhanced NAHS Student Transition Notes system. The system now includes advanced duplicate detection, smart data precedence, and production-ready architecture.

**System Status**: ✅ Production Ready with Enhanced Features

## 🎯 Main Entry Points

### Primary Functions

| Function | Description | Returns | Usage | Status |
|----------|-------------|---------|-------|--------|
| `loadTENTATIVEVersion2()` | **Enhanced main entry point** with duplicate detection and data precedence | `Object` - Processing statistics | `const stats = loadTENTATIVEVersion2();` | ✅ **Enhanced** |
| `loadAllStudentData()` | Loads data from all Google Sheets with optimized loaders | `Map<string, Object>` - Student data by ID | `const data = loadAllStudentData();` | ✅ **Optimized** |
| `processStudentData(rawData)` | **Enhanced processing** with duplicate detection and precedence logic | `Map<string, Object>` - Processed student data | `const processed = processStudentData(raw);` | ✅ **Enhanced** |
| `writeProcessedDataToSheet(students)` | Writes processed data to TENTATIVE-Version2 sheet with validation | `Object` - Write statistics | `const stats = writeProcessedDataToSheet(data);` | ✅ **Production** |

## 🔧 Enhanced Data Processing Classes

### **TeacherInputProcessor** *(NEW Enhanced Features)*

| Method | Description | Returns | Usage |
|--------|-------------|---------|-------|
| `processTeacherInput(formData, scheduleData)` | **Enhanced with duplicate detection** - Processes teacher form responses with intelligent duplicate handling | `Map<string, Object>` | `const processed = processor.processTeacherInput(forms, schedules);` |
| `findDuplicateResponses(responses)` | **NEW** - Identifies and groups duplicate teacher submissions | `Map<string, Array>` | `const duplicates = processor.findDuplicateResponses(responses);` |
| `findMostRecentResponse(responseGroup)` | **NEW** - Selects most recent response using timestamp analysis | `Object` | `const latest = processor.findMostRecentResponse(group);` |
| `processMultipleResponsesPerTeacher(duplicates)` | **NEW** - Handles multiple responses per teacher intelligently | `Map<string, Object>` | `const processed = processor.processMultipleResponsesPerTeacher(dups);` |

### **Enhanced Data Loaders**

| Class | Description | Key Features | Status |
|-------|-------------|--------------|---------|
| `FormResponsesDataLoader` | **Enhanced** teacher form response loading with Column F extraction | Column F optimization, duplicate support | ✅ **Enhanced** |
| `StudentDataMerger` | **Enhanced** multi-source data merging with smart precedence | Form response priority, intelligent fallback | ✅ **Enhanced** |
| `TentativeRowBuilder` | **Production-ready** row building with source data compatibility | Clean architecture, eligibility field mapping | ✅ **Production** |

## 📊 Enhanced System Features

### **🔍 Duplicate Detection System**

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Teacher Response Grouping** | Groups multiple submissions by teacher email | `Map<teacherEmail, responseArray>` |
| **Timestamp Analysis** | Identifies most recent submissions using timestamps | Column A timestamp parsing with fallback |
| **Intelligent Selection** | Selects best response per teacher automatically | Newest timestamp or last in array |
| **Data Integration** | Merges selected responses with schedule data | Teacher email matching with validation |

### **🎯 Smart Data Precedence**

| Priority Level | Data Source | Usage | Fallback |
|----------------|-------------|-------|-----------|
| **1 (Highest)** | Teacher Form Responses | Transition decisions, feedback | Tentative data if missing |
| **2 (Fallback)** | Tentative Sheet Data | Complete student records | Registration data baseline |
| **3 (Baseline)** | Registration Data | Foundational information | Error handling |

## Configuration Constants

### Sheet Names (`SHEET_NAMES`)

| Constant | Sheet Name | Purpose |
|----------|------------|---------|
| `TENTATIVE_V2` | 'TENTATIVE-Version2' | Main output sheet |
| `TENTATIVE` | 'TENTATIVE' | Legacy data sheet |
| `REGISTRATIONS` | 'Registrations SY 24.25' | Student registration data |
| `SCHEDULES` | 'Schedules' | Course schedules |
| `FORM_RESPONSES_1` | 'Form Responses 1' | Teacher form responses |
| `CONTACT_INFO` | 'ContactInfo' | Contact information |
| `ENTRY_WITHDRAWAL` | 'Entry_Withdrawal' | Entry/withdrawal tracking |
| `WITHDRAWN` | 'Withdrawn' | Withdrawn students |
| `WD_OTHER` | 'W/D Other' | Additional withdrawal data |
| `ATTENDANCE` | 'Alt HS Attendance & Enrollment Count' | Attendance records |

### Column Names (`COLUMN_NAMES`)

| Constant | Column Header | Usage |
|----------|---------------|-------|
| `STUDENT_ID` | 'STUDENT ID' | Primary key for student identification |
| `STUDENT_FIRST_NAME` | 'Student First Name' | Student's first name |
| `STUDENT_LAST_NAME` | 'Student Last Name' | Student's last name |
| `STUDENT_NAME_FULL` | 'Student Name(Last, First)' | Full name format |
| `GRADE` | 'GRADE' | Current grade level |
| `HOME_CAMPUS` | 'Home Campus' | Student's home campus |
| `ENTRY_DATE` | 'Entry Date' | Program entry date |
| `TEACHER_NAME` | 'Teacher Name' | Course teacher |
| `COURSE_TITLE` | 'Course Title' | Course name |
| `PERIOD` | 'Per Beg' | Class period |

### Period Identifiers (`PERIODS`)

| Constant | Value | Description |
|----------|-------|-------------|
| `FIRST` | '1st' | First period |
| `SECOND` | '2nd' | Second period |
| `THIRD` | '3rd' | Third period |
| `FOURTH` | '4th' | Fourth period |
| `FIFTH` | '5th' | Fifth period |
| `SIXTH` | '6th' | Sixth period |
| `SEVENTH` | '7th' | Seventh period |
| `EIGHTH` | '8th' | Eighth period |
| `SPECIAL_ED` | 'Special Education' | Special education period |

## Utility Functions

### Date Utilities (`DateUtils`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `formatDateToMMDDYYYY(date)` | `Date\|string\|number` | `string\|null` | Formats date to MM/DD/YYYY |
| `isWeekend(date)` | `Date` | `boolean` | Checks if date is weekend |
| `isHoliday(date, holidays)` | `Date`, `Array<string>` | `boolean` | Checks if date is school holiday |
| `formatDateForHolidays(date)` | `Date` | `string` | Formats date for holiday comparison |

### Data Utilities (`DataUtils`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `extractStudentId(studentName)` | `string` | `string\|null` | Extracts student ID from name field |
| `cleanStudentName(name)` | `string` | `string` | Normalizes student name format |
| `parseGradeLevel(grade)` | `string\|number` | `number\|null` | Parses and validates grade level |
| `normalizeTeacherName(name)` | `string` | `string` | Standardizes teacher name format |

### Validation Utilities (`ValidationUtils`)

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `isValidEmail(email)` | `string` | `boolean` | Validates email address format |
| `isValidStudentId(id)` | `string` | `boolean` | Validates student ID format |
| `isValidGrade(grade)` | `string\|number` | `boolean` | Validates grade level |
| `hasRequiredFields(obj, fields)` | `Object`, `Array<string>` | `boolean` | Checks for required object fields |

## Data Loaders

### Base Infrastructure

| Class | Purpose | Key Methods |
|-------|---------|-------------|
| `BaseDataLoader` | Abstract base for all loaders | `loadData()`, `processRows()` |
| `DataLoaderFactory` | Creates loader instances | `createLoader(type)`, `getAllLoaders()` |

### Specific Loaders

| Class | Sheet Source | Key Column | Multiple Records |
|-------|--------------|------------|------------------|
| `TentativeDataLoader` | TENTATIVE | STUDENT ID | No |
| `RegistrationDataLoader` | Registrations SY 24.25 | STUDENT ID | No |
| `ScheduleDataLoader` | Schedules | STUDENT ID | Yes |
| `ContactDataLoader` | ContactInfo | STUDENT ID | No |
| `FormResponsesDataLoader` | Form Responses 1 | STUDENT ID | Yes |
| `AttendanceDataLoader` | Alt HS Attendance & Enrollment Count | STUDENT ID | No |
| `EntryWithdrawalDataLoader` | Entry_Withdrawal | STUDENT ID | No |
| `WithdrawnDataLoader` | Withdrawn | STUDENT ID | No |
| `WdOtherDataLoader` | W/D Other | STUDENT ID | No |

## Data Processors

### Core Processors

| Class | Purpose | Key Methods |
|-------|---------|-------------|
| `BaseDataProcessor` | Abstract base for processors | `process(data)`, `validate(data)` |
| `StudentDataMerger` | Merges multi-source data | `mergeStudentData(dataMap)` |
| `TeacherInputProcessor` | Processes teacher forms | `processTeacherInput(responses)` |
| `ScheduleProcessor` | Integrates schedule data | `processSchedules(scheduleData)` |
| `StudentFilterProcessor` | Filters active students | `filterActiveStudents(students)` |

## Writers

### Core Writers

| Class | Target Sheet | Purpose | Key Methods |
|-------|-------------|---------|-------------|
| `BaseWriter` | Abstract | Base functionality | `write(data)`, `formatRow(data)` |
| `TentativeSheetWriter` | TENTATIVE-Version2 | Main output | `writeStudentData(studentMap)` |
| `WriterFactory` | N/A | Factory pattern | `createWriter(type)` |

## Error Handling

### Common Error Types

| Error Type | Description | Handling |
|------------|-------------|----------|
| `Sheet not found` | Google Sheet doesn't exist | Returns empty Map, logs error |
| `Column not found` | Expected column missing | Returns empty Map, logs error |
| `Invalid data format` | Data doesn't match expected format | Skips record, logs warning |
| `Permission denied` | No access to sheet | Throws error, logs critical |
| `API rate limit` | Google Apps Script quota exceeded | Retries with backoff |

### Error Response Format

```javascript
// Typical error response structure
{
  studentsProcessed: number,
  rowsWritten: number,
  hasErrors: boolean,
  errors: Array<string>,
  warnings: Array<string>
}
```

## Performance Considerations

### Optimization Guidelines

| Operation | Best Practice | Performance Impact |
|-----------|---------------|-------------------|
| Sheet Access | Cache sheet references | High - Reduces API calls |
| Data Loading | Batch operations | Medium - Reduces iteration overhead |
| Map Operations | Use Map instead of Object | Low - Faster key lookup |
| Memory Usage | Process in chunks for large datasets | High - Prevents memory overflow |

### Recommended Limits

| Resource | Limit | Consequence |
|----------|-------|-------------|
| Students per batch | 500 | Memory optimization |
| Concurrent sheet access | 3 | API rate limiting |
| Execution time | 6 minutes | Google Apps Script timeout |
| Memory usage | 100MB | Script termination |

## Testing Framework

### Test Categories

| Category | Purpose | Location |
|----------|---------|----------|
| Unit Tests | Individual component testing | `tests/unit/` |
| Integration Tests | End-to-end workflow testing | `tests/unit/integration/` |
| Performance Tests | Load and efficiency testing | `tests/performance/` |
| Mock Tests | Google Apps Script API mocking | `tests/mocks/` |

### Key Test Utilities

| Function | Purpose | Usage |
|----------|---------|-------|
| `TestUtils.createMockStudentData()` | Creates test student data | Unit testing |
| `TestUtils.createMockSheet()` | Mocks Google Sheet | API testing |
| `TestUtils.measureExecutionTime()` | Performance measurement | Performance testing |
| `TestUtils.assertArraysEqual()` | Array comparison | Validation testing |

## Usage Examples

### Basic System Operation

```javascript
// Run complete system
const stats = loadTENTATIVEVersion2();
console.log(`Processed ${stats.studentsProcessed} students`);
```

### Component-Level Operations

```javascript
// Load specific data
const loader = new TentativeDataLoader();
const studentData = loader.loadData();

// Process data
const processor = new StudentDataMerger();
const merged = processor.process(studentData);

// Write results
const writer = new TentativeSheetWriter();
const stats = writer.write(merged);
```

### Error Handling Pattern

```javascript
try {
  const result = loadTENTATIVEVersion2();
  if (result.hasErrors) {
    console.warn('Completed with errors:', result.errors);
  }
} catch (error) {
  console.error('System failure:', error.message);
}
```

## Development Guidelines

### Code Standards
- **JSDoc**: All public functions must have comprehensive documentation
- **Error Handling**: Graceful degradation, not system crashes
- **Testing**: Minimum 90% test coverage for new code
- **Performance**: Monitor execution time and memory usage

### Naming Conventions
- **Classes**: PascalCase (e.g., `StudentDataLoader`)
- **Functions**: camelCase (e.g., `loadStudentData`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `SHEET_NAMES`)
- **Variables**: camelCase (e.g., `studentId`)

### Documentation Requirements
- **File Overview**: Every file needs `@fileoverview`
- **Function Docs**: Minimum 2 examples per public function
- **Class Docs**: Constructor and public method documentation
- **Cross-References**: Use `@see` tags for related functionality

---

For complete documentation with detailed examples and implementation details, see the [full JSDoc documentation](./api/index.html) and the [Documentation Guide](./DOCUMENTATION_GUIDE.md).
