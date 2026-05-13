# Google Apps Script Deployment Guide

## File Loading Order in Google Apps Script

Google Apps Script loads files alphabetically, which can cause dependency issues when classes extend other classes. To solve this, we use numbered prefixes for critical base files.

## Required Files in Correct Order

### 1. Root Level Files (Load First)
These files must be at the root level of your Google Apps Script project:

```
00_bootstrap.js
01_baseDataLoader.js
02_baseDataProcessor.js
03_constants.js
```

### 2. Application Files (Load After Dependencies)
```
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

### Step 1: Verify Base Files at Root

The following base files have been moved to the root level with numbered prefixes:

1. `01_baseDataLoader.js` - Base data loader class (moved from `src/data-loaders/`)
2. `02_baseDataProcessor.js` - Base data processor class (moved from `src/data-processors/`)
3. `03_constants.js` - System constants (moved from `src/config/`)

**Note**: These files have been moved (not copied) to prevent duplicate declarations that would cause `SyntaxError: Identifier 'X' has already been declared` errors.

### Step 2: Initialize System

Before running any functions or tests, call:

```javascript
initializeNAHSSystem();
```

This function (from `00_bootstrap.js`) verifies all dependencies are loaded and provides helpful error messages if anything is missing.

### Step 3: Upload to Google Apps Script

When uploading to Google Apps Script:

1. Create a new Google Apps Script project
2. Upload all files maintaining the folder structure
3. Ensure the numbered files (00_, 01_, 02_, 03_) are at the root level
4. Test the system by running `initializeNAHSSystem()`

## Troubleshooting

### Common Issues

#### "BaseDataLoader is not defined"
- **Cause**: `01_baseDataLoader.js` not at root level or not loaded
- **Solution**: Ensure `01_baseDataLoader.js` exists at root level

#### "SHEET_NAMES has already been declared"
- **Cause**: Both `src/config/constants.js` and `03_constants.js` exist
- **Solution**: Remove `src/config/constants.js` (the root-level `03_constants.js` takes precedence)

#### "BaseDataProcessor is not defined"
- **Cause**: `02_baseDataProcessor.js` not at root level or not loaded
- **Solution**: Ensure `02_baseDataProcessor.js` exists at root level

### Verification Commands

To check system status:

```javascript
// Check if system is initialized
if (typeof initializeNAHSSystem === 'function') {
  initializeNAHSSystem();
} else {
  console.error('Bootstrap system not loaded');
}

// Check specific dependencies
console.log('Available base classes:', {
  BaseDataLoader: typeof BaseDataLoader !== 'undefined',
  BaseDataProcessor: typeof BaseDataProcessor !== 'undefined',
  SHEET_NAMES: typeof SHEET_NAMES !== 'undefined'
});
```

## File Structure Summary

```
Root Level (Priority Loading):
├── 00_bootstrap.js          # System initialization
├── 01_baseDataLoader.js     # Base class for data loaders
├── 02_baseDataProcessor.js  # Base class for data processors
├── 03_constants.js          # System constants
├── appsscript.json          # Google Apps Script config
└── [legacy files...]        # Other existing files

Source Code (Load After Dependencies):
├── src/
│   ├── config/              # Configuration files (constants moved to root)
│   ├── data-loaders/        # Specific data loader implementations
│   ├── data-processors/     # Specific data processor implementations
│   ├── utils/               # Utility functions
│   └── writers/             # Data writing functions
└── tests/
    └── unit/                # Unit tests
```

## Best Practices

1. **Always initialize**: Call `initializeNAHSSystem()` before using the system
2. **Check dependencies**: Use the bootstrap system to verify all required classes are loaded
3. **Avoid duplicates**: Don't have the same class/constant defined in multiple files
4. **Use numbered prefixes**: For any new base classes that other classes depend on
5. **Test in GAS environment**: Google Apps Script behaves differently than local Node.js

## Integration with Testing

The test runner (`tests/unit/testRunner.js`) automatically calls `initializeNAHSSystem()` before running tests:

```javascript
function doGet() {
  // Initialize system before running tests
  if (typeof initializeNAHSSystem === 'function') {
    initializeNAHSSystem();
  }
  
  // Run tests...
}
```

This ensures all dependencies are properly loaded before any test execution begins.
