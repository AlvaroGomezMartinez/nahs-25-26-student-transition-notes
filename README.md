/**
 * README for NAHS Student Transition Notes Refactoring Project
 * 
 * This document explains the refactored structure and how to use the new system.
 */

# NAHS Student Transition Notes - Refactored Structure

## Overview
This project manages student transition data for NAHS (Alternative High School) students. The system loads data from multiple Google Sheets, processes it, and writes consolidated information to a TENTATIVE-Version2 sheet.

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── constants.js        # System constants and sheet names
│   └── sheetConfigs.js     # Sheet configuration mappings
├── data-loaders/           # Data loading classes
│   └── baseDataLoader.js   # Base class for loading sheet data
├── data-processors/        # Data processing logic
├── writers/               # Sheet writing functionality
├── utils/                 # Utility functions
│   ├── dateUtils.js       # Date manipulation functions
│   └── dataUtils.js       # Data validation and processing
├── services/              # Business logic services
└── main.js               # Main entry point

tests/
├── unit/                  # Unit tests
└── integration/           # Integration tests

legacy/ (old files at root level)
```

## Key Improvements

### 1. **Fixed Naming Conventions**
- Replaced `updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap` with `activeStudentDataMap`
- Consistent, descriptive function and variable names
- Centralized constants in `src/config/constants.js`

### 2. **Modular Structure**
- Separated concerns into logical folders
- Base classes for common functionality
- Reusable utility functions

### 3. **Configuration Management**
- All sheet names in `SHEET_NAMES` constant
- Column mappings in `COLUMN_NAMES` constant
- Configurable system settings

## Usage

### Main Entry Point
```javascript
// Call this function to run the complete data processing
loadTENTATIVEVersion2();
```

### Configuration
All configuration is centralized in `src/config/`:
- Sheet names and IDs
- Column mappings
- Teacher email mappings
- System settings

### Data Loading
The new structure uses a base class pattern with specific loaders:
```javascript
// Using individual loaders
const tentativeLoader = new TentativeDataLoader();
const tentativeData = tentativeLoader.loadData();

const registrationLoader = new RegistrationDataLoader();
const registrationData = registrationLoader.loadData();

// Or load all data at once
const allData = loadAllStudentDataWithLoaders();

// Backward compatible functions still work
const scheduleData = schedulesSheet(); // Still works
const contactData = loadContactData(); // Still works
```

## Migration Status

### ✅ Completed
- [x] Created folder structure
- [x] Added configuration files
- [x] Created utility functions
- [x] Added base data loader class
- [x] Created main entry point
- [x] Implemented all specific data loader classes
- [x] Created backward-compatible functions
- [x] Updated main.js to use new data loaders
- [x] Implemented data processor classes
- [x] Created validation utilities
- [x] Built comprehensive processing pipeline

### 🚧 In Progress
- [ ] Break down the 701-line writeToTENTATIVEVersion2Sheet function
- [ ] Implement sheet writer classes
- [ ] Add comprehensive error handling

### 📋 Todo
- [ ] Add unit tests for all functions
- [ ] Create integration tests
- [ ] Add JSDoc documentation
- [ ] Remove legacy version1scripts folder
- [ ] Add logging system
- [ ] Create deployment guide

## File Migration Plan

### Phase 1: Configuration (✅ Complete)
- Move constants to `src/config/constants.js`
- Create sheet configurations

### Phase 2: Utilities (✅ Complete)
- Extract date functions to `src/utils/dateUtils.js`
- Extract data functions to `src/utils/dataUtils.js`

### Phase 3: Data Loaders (✅ Complete)
- [x] `loadTentativeData.js` → `src/data-loaders/tentativeDataLoader.js`
- [x] `loadRegistrationsData.js` → `src/data-loaders/registrationDataLoader.js`
- [x] `loadSchedules.js` → `src/data-loaders/scheduleDataLoader.js`
- [x] `loadContactData.js` → `src/data-loaders/contactDataLoader.js`
- [x] `loadEntryWithdrawalData.js` → `src/data-loaders/entryWithdrawalDataLoader.js`
- [x] `loadFormResponses1Data.js` → `src/data-loaders/formResponsesDataLoader.js`
- [x] `loadWithdrawnData.js` → `src/data-loaders/withdrawnDataLoader.js`
- [x] `loadWDOther.js` → `src/data-loaders/wdOtherDataLoader.js`
- [x] `loadStudentAttendanceData.js` → `src/data-loaders/attendanceDataLoader.js`
- [x] Created `src/data-loaders/index.js` for centralized access

### Phase 4: Processors
- Extract processing logic from main functions
- Create testable, single-purpose processors

### Phase 5: Writers
- `writeToTENTATIVEVersion2.js` → `src/writers/tentativeSheetWriter.js`
- Break into smaller functions

## Testing

### Unit Tests
Located in `tests/unit/`. Test individual functions and classes.

### Integration Tests  
Located in `tests/integration/`. Test complete workflows.

### Running Tests
```javascript
// Run from Google Apps Script editor
doGet(); // Runs QUnit tests
```

## Contributing

When adding new functionality:

1. Follow the established folder structure
2. Use the constants from `src/config/constants.js`
3. Add appropriate error handling
4. Write unit tests for new functions
5. Update this README with changes

## Support

Contact: Alvaro Gomez (alvaro.gomez@nisd.net)
Office: +1-210-397-9408
Mobile: +1-210-363-1577
