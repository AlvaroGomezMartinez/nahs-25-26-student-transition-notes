/**
 * @fileoverview JSDoc configuration and documentation index for the NAHS system.
 * 
 * This file serves as the central documentation hub and configuration for
 * generating comprehensive API documentation using JSDoc. It defines the
 * project structure, documentation standards, and provides an overview
 * of all documented modules.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * @namespace NAHS
 * @description
 * **NAHS Student Transition Notes System**
 * 
 * A comprehensive Google Apps Script application for managing student
 * transition notes and academic progress tracking at NAHS (Northside
 * Alternative High School).
 * 
 * ## System Architecture
 * 
 * The system follows a modular architecture with clear separation of concerns:
 * 
 * ### Core Modules
 * - **Main**: Entry points and orchestration functions
 * - **Config**: Configuration constants and settings
 * - **Utils**: Utility functions for common operations
 * - **DataLoaders**: Classes for loading data from Google Sheets
 * - **DataProcessors**: Business logic for data transformation
 * - **Writers**: Classes for writing processed data back to sheets
 * 
 * ### Data Flow
 * 1. **Loading**: Data loaders extract information from multiple Google Sheets
 * 2. **Processing**: Data processors apply business logic and merge data
 * 3. **Writing**: Writers format and output processed data to target sheets
 * 
 * ## Key Features
 * - **Multi-source Data Integration**: Combines data from 8+ Google Sheets
 * - **Teacher Input Processing**: Integrates form responses from teachers
 * - **Automated Report Generation**: Creates comprehensive transition notes
 * - **Error Resilience**: Graceful handling of missing or invalid data
 * - **Performance Optimization**: Efficient processing of large datasets
 * 
 * ## Usage Examples
 * 
 * ```javascript
 * // Run the complete process
 * const stats = loadTENTATIVEVersion2();
 * console.log(`Processed ${stats.studentsProcessed} students`);
 * 
 * // Load specific data
 * const loader = new TentativeDataLoader();
 * const studentData = loader.loadData();
 * 
 * // Process student information
 * const processor = new StudentDataMerger();
 * const mergedData = processor.process(studentData);
 * ```
 * 
 * @since 2.0.0
 */

/**
 * @namespace Main
 * @memberof NAHS
 * @description
 * **Main Entry Points and Orchestration Functions**
 * 
 * Contains the primary functions that coordinate the complete data processing
 * workflow. These functions serve as the external API for the system and 
 * orchestrate the various data loading, processing, and writing operations.
 * 
 * ### Key Functions
 * - {@link loadTENTATIVEVersion2} - Main system entry point
 * - {@link loadAllStudentData} - Data loading coordinator
 * - {@link processStudentData} - Data processing coordinator
 * - {@link writeProcessedDataToSheet} - Data writing coordinator
 * 
 * @see {@link module:src/main.js} For implementation details
 */

/**
 * @namespace Config
 * @memberof NAHS
 * @description
 * **Configuration Constants and Settings**
 * 
 * Centralizes all configuration values including sheet names, column mappings,
 * period definitions, and default values. This namespace prevents magic strings
 * and makes the system more maintainable.
 * 
 * ### Key Configurations
 * - {@link SHEET_NAMES} - Google Sheets name mappings
 * - {@link COLUMN_NAMES} - Column header mappings
 * - {@link PERIODS} - Period identifiers for schedules
 * - {@link DEFAULT_VALUES} - Fallback values for missing data
 * 
 * @see {@link module:src/config/constants.js} For implementation details
 */

/**
 * @namespace Utils
 * @memberof NAHS
 * @description
 * **Utility Functions for Common Operations**
 * 
 * Provides reusable utility functions for date manipulation, data validation,
 * string processing, and other common operations used throughout the system.
 * 
 * ### Utility Categories
 * - **DateUtils**: Date formatting, validation, and business logic
 * - **DataUtils**: Data structure manipulation and processing
 * - **ValidationUtils**: Input validation and data integrity checks
 * 
 * @see {@link module:src/utils/dateUtils.js} For date utilities
 * @see {@link module:src/utils/dataUtils.js} For data utilities
 * @see {@link module:src/utils/validationUtils.js} For validation utilities
 */

/**
 * @namespace DataLoaders
 * @memberof NAHS
 * @description
 * **Classes for Loading Data from Google Sheets**
 * 
 * Specialized classes that handle loading data from different Google Sheets
 * sources. Each loader is responsible for a specific data domain and provides
 * standardized access to that data.
 * 
 * ### Base Infrastructure
 * - {@link BaseDataLoader} - Abstract base class for all loaders
 * - {@link DataLoaderFactory} - Factory for creating loader instances
 * 
 * ### Specific Loaders
 * - {@link TentativeDataLoader} - TENTATIVE sheet data
 * - {@link RegistrationDataLoader} - Student registration data
 * - {@link ScheduleDataLoader} - Course schedule information
 * - {@link ContactDataLoader} - Contact information
 * - {@link FormResponsesDataLoader} - Teacher form responses
 * - {@link AttendanceDataLoader} - Attendance records
 * - {@link WithdrawnDataLoader} - Withdrawn student data
 * 
 * @see {@link module:src/data-loaders/} For loader implementations
 */

/**
 * @namespace DataProcessors
 * @memberof NAHS
 * @description
 * **Business Logic for Data Transformation**
 * 
 * Classes that implement the business logic for processing, merging, and
 * enriching student data. These processors apply NAHS-specific rules and
 * create comprehensive student profiles.
 * 
 * ### Core Processors
 * - {@link BaseDataProcessor} - Abstract base for all processors
 * - {@link StudentDataMerger} - Merges data from multiple sources
 * - {@link TeacherInputProcessor} - Processes teacher form responses
 * - {@link ScheduleProcessor} - Handles schedule integration
 * - {@link StudentFilterProcessor} - Filters active/withdrawn students
 * 
 * @see {@link module:src/data-processors/} For processor implementations
 */

/**
 * @namespace Writers
 * @memberof NAHS
 * @description
 * **Classes for Writing Processed Data to Sheets**
 * 
 * Specialized classes that handle formatting and writing processed data
 * back to Google Sheets. Writers ensure proper data formatting, cell
 * styling, and efficient batch operations.
 * 
 * ### Core Writers
 * - {@link BaseWriter} - Abstract base class for all writers
 * - {@link TentativeSheetWriter} - Writes to TENTATIVE-Version2 sheet
 * - {@link WriterFactory} - Factory for creating writer instances
 * 
 * @see {@link module:src/writers/} For writer implementations
 */

/**
 * @namespace Testing
 * @memberof NAHS
 * @description
 * **Comprehensive Testing Framework**
 * 
 * Complete unit and integration testing suite using QUnitGS2 framework.
 * Provides thorough test coverage for all system components with mock
 * objects and performance testing.
 * 
 * ### Test Categories
 * - **Unit Tests**: Individual component testing
 * - **Integration Tests**: End-to-end workflow testing
 * - **Performance Tests**: Load and efficiency testing
 * - **Mock Objects**: Google Apps Script API mocking
 * 
 * @see {@link module:tests/unit/} For test implementations
 * @see {@link TestUtils} For testing utilities
 */

// JSDoc Configuration for documentation generation
const jsdocConfig = {
  "source": {
    "include": [
      "./src/",
      "./tests/",
      "./docs/"
    ],
    "exclude": [
      "./node_modules/",
      "./legacy/"
    ],
    "includePattern": "\\.(js|md)$"
  },
  "opts": {
    "destination": "./docs/api/",
    "recurse": true,
    "readme": "./README.md"
  },
  "plugins": [
    "plugins/markdown",
    "plugins/summarize"
  ],
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false
  },
  "metadata": {
    "title": "NAHS Student Transition Notes - API Documentation",
    "version": "2.0.0"
  }
};

/**
 * Documentation generation guidelines and standards.
 * 
 * ## JSDoc Standards
 * 
 * ### Required Tags
 * - `@fileoverview` - File description and purpose
 * - `@function` or `@class` - Function/class definition
 * - `@memberof` - Namespace membership
 * - `@param` - Parameter documentation with types
 * - `@returns` - Return value documentation
 * - `@example` - Usage examples (minimum 2 per function)
 * - `@since` - Version introduced
 * 
 * ### Optional Tags
 * - `@throws` - Exception documentation
 * - `@see` - Cross-references
 * - `@deprecated` - Deprecated functionality
 * - `@todo` - Future improvements
 * - `@private` - Internal functions
 * 
 * ### Documentation Quality Standards
 * - **Comprehensive**: Cover all public APIs
 * - **Accurate**: Keep documentation in sync with code
 * - **Examples**: Provide practical usage examples
 * - **Cross-references**: Link related functions and concepts
 * - **Clear Language**: Use plain English with technical precision
 * 
 * ## Module Documentation Template
 * 
 * ```javascript
 * /**
 *  * @fileoverview Brief description of the module.
 *  * 
 *  * Detailed description explaining the module's purpose,
 *  * key functionality, and how it fits into the system.
 *  * 
 *  * @author NAHS Development Team
 *  * @version 2.0.0
 *  * @since 2024-01-01
 *  *\/
 * 
 * /**
 *  * Function description with business context.
 *  * 
 *  * @function functionName
 *  * @memberof NamespaceName
 *  * 
 *  * @param {Type} paramName - Parameter description
 *  * @returns {Type} Return value description
 *  * 
 *  * @example
 *  * // Basic usage
 *  * const result = functionName(param);
 *  * 
 *  * @since 2.0.0
 *  *\/
 * ```
 * 
 * @since 2.0.0
 */
