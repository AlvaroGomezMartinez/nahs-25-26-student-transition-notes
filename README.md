# Student Transition Notes

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Enabled-blue)
![Version](https://img.shields.io/badge/Version-2.1.0-success)

A Google Apps Script system that automates student transition note collection and processing for a district alternative education program. This system is meant to facilitate [HB 2184](https://capitol.texas.gov/tlodocs/86R/billtext/html/HB02184H.HTM) and [TEC §37.023](https://statutes.capitol.texas.gov/?tab=1&code=ED&chapter=ED.37&artSec=37.023). It pulls data from multiple Google Sheets, merges teacher form responses with student records, and writes a consolidated output sheet used to generate transition letters via [Autocrat](https://workspace.google.com/marketplace/app/autocrat/539341275670).

## What it does

- Loads student data from 8+ Google Sheets (registrations, schedules, attendance, contact info, entry/withdrawal records, and teacher form responses)
- Detects and resolves duplicate teacher submissions, keeping the most recent response
- Calculates each student's anticipated release date based on placement days, attendance, and school holidays
- Preserves manual row formatting (highlights, colors) across data refreshes
- Sends automated daily email reminders to teachers when students reach their 10-day enrollment milestone
- Writes a fully merged output to the `TENTATIVE-Version2` sheet, ready for Autocrat document generation

## Architecture

```
src/
├── config/
│   └── sheetConfigs.js         # Sheet structure and column mappings
├── data-loaders/               # One class per data source (BaseDataLoader pattern)
├── data-processors/            # Merging, filtering, schedule and teacher input processing
├── writers/                    # Row builder and sheet writer classes
├── services/
│   └── emailReminderService.js # 10-day milestone email automation
└── utils/                      # Date, data, validation, and config utilities

tests/
├── unit/                       # Unit tests by module
├── debug/                      # Diagnostic scripts for troubleshooting
└── consoleTestRunner.js

03_constants.example.js         # ← Start here when setting up a new instance
```

The entry point is `loadTENTATIVEVersion2()` in `src/main.js`.

## Setup

This project connects to several external Google Spreadsheets. The real IDs and staff email addresses are kept out of version control.

1. Copy the constants template:
   ```bash
   cp 03_constants.example.js 03_constants.js
   ```
2. Open `03_constants.js` and replace every `YOUR_..._SPREADSHEET_ID` placeholder with the actual Google Spreadsheet ID from each source sheet's URL.
3. Replace the `TEACHER_EMAIL_MAPPINGS` entries with your staff's email addresses.
4. Push to your Apps Script project:
   ```bash
   clasp push
   ```
5. Run `checkExternalConfiguration()` from the Apps Script editor to verify all external sheet connections.

## Running the system

```javascript
// Full data refresh — run from the Apps Script editor
loadTENTATIVEVersion2();

// Check system health before running
runSystemDiagnostics();

// Send daily teacher reminder emails (also runs on a time-based trigger)
sendEmailsForToday();
```

## Key design decisions

**Duplicate teacher submission handling** — Teachers sometimes submit the form more than once for the same student. `TeacherInputProcessor` groups responses by teacher name and selects the most recent by timestamp, so the output always reflects the latest feedback.

**Formatting preservation** — The output sheet is fully rewritten and sorted alphabetically on each run. Before writing, the system captures any manual row highlighting and restores it after the sort so staff annotations survive data refreshes.

**Anticipated release date** — Calculated using `NAHS_EXPECTED_WITHDRAW_DATE()`, which counts forward from the student's entry date by their placement days, skipping weekends and district holidays defined in `holidayDates.js`.

**Backward compatibility** — Legacy function names are preserved as thin wrappers so existing Apps Script triggers don't break during incremental updates.

## Contributing

1. Follow the existing folder structure — one responsibility per file
2. Use constants from `03_constants.js` rather than hardcoding strings
3. Add error handling that degrades gracefully (a single bad student record shouldn't stop the whole run)
4. Write unit tests in `tests/unit/` for new logic

## License

See [LICENSE](LICENSE).
