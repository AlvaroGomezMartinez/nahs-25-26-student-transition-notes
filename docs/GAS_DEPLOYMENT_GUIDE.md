# Google Apps Script Deployment Guide

## File Loading Order in Google Apps Script

Google Apps Script loads files alphabetically, which can cause dependency issues when classes extend other classes. To solve this, we use numbered prefixes for critical base files.

## Required Files in Correct Order

### 1. Root Level Files (Load First)
These files must be at the root level of your Google Apps Script project:

```
00_bootstrap.js         - System initialization
01_baseDataLoader.js    - Base class for all data loaders  
02_baseDataProcessor.js - Base class for all data processors
03_constants.js         - System constants (SHEET_NAMES, COLUMN_NAMES, etc.)
```

### 2. Source Files (Load After Base Classes)
All files in the `src/` folder structure:

```
src/main.js
src/config/...
src/data-loaders/...
src/data-processors/...
src/writers/...
src/utils/...
```

### 3. Test Files (Load Last)
```
tests/unit/testRunner.js
tests/unit/testUtils.js
tests/unit/.../...
```

## Deployment Steps

### Step 1: Copy Base Files to Root
1. Copy `src/data-loaders/baseDataLoader.js` to `01_baseDataLoader.js`
2. Copy `src/data-processors/baseDataProcessor.js` to `02_baseDataProcessor.js`
3. Copy `src/config/constants.js` to `03_constants.js`
4. Ensure `00_bootstrap.js` exists

### Step 2: Upload to Google Apps Script
1. Create a new Google Apps Script project
2. Upload files in this order:
   - First: `00_bootstrap.js`
   - Second: `01_baseDataLoader.js`
   - Third: `02_baseDataProcessor.js`
   - Fourth: `03_constants.js`
   - Then: All other files from `src/` folder
   - Last: Test files

### Step 3: Verify Dependencies
Run this in the Google Apps Script editor:
```javascript
initializeNAHSSystem();
```

You should see:
```
Initializing NAHS Student Transition Notes System...
NAHS System initialized successfully
Available base classes: {BaseDataLoader: true, BaseDataProcessor: true, ...}
```

## Troubleshooting

### Error: "BaseDataLoader is not defined"
**Solution**: Make sure `01_baseDataLoader.js` is uploaded and appears before any files that use it.

### Error: "SHEET_NAMES is not defined"  
**Solution**: Make sure `03_constants.js` is uploaded and appears before any files that use constants.

### Error: "Cannot extend undefined"
**Solution**: Check that base classes are loaded before derived classes. Use the numbered prefix system.

## File Structure in Google Apps Script IDE

Your files should appear in this order in the GAS IDE:
```
📄 00_bootstrap.js
📄 01_baseDataLoader.js  
📄 02_baseDataProcessor.js
📄 03_constants.js
📄 appsscript.json
📄 borders.js
📄 expectedWithdrawDate.js
📄 holidayDates.js
📄 importAPIData.js
📁 src/
  📄 main.js
  📁 config/...
  📁 data-loaders/...
  📁 data-processors/...
  📁 writers/...
  📁 utils/...
📄 reminderEmails.js
📄 sql-likeFunctions.js
📁 tests/
  📁 unit/...
```

## Running Tests

1. Ensure all base files are uploaded first
2. Run the test function:
   ```javascript
   doGet(); // This will initialize the system and run tests
   ```

## Notes

- The numbered prefix system ensures proper loading order
- Base files at root level are duplicates of those in `src/` - this is necessary for GAS
- The bootstrap file provides initialization checking
- Always test the initialization before running the main system

## Alternative: Manual Dependency Checking

If you still get dependency errors, add this to the top of any file that uses base classes:

```javascript
// Check dependencies before class definition
if (typeof BaseDataLoader === 'undefined') {
  throw new Error('BaseDataLoader must be loaded before this file');
}

class YourClass extends BaseDataLoader {
  // ... your implementation
}
```
