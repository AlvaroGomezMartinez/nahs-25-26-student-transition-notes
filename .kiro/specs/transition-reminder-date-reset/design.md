# Transition Reminder Date Reset Bug Fix Design

## Overview

The `FIRST DAY OF AEP` date is being incorrectly overwritten every time the data pipeline runs, causing downstream failures in the email reminder system and exit date calculations. Two compounding bugs exist: (1) `mergeScheduleData()` unconditionally overwrites `FIRST DAY OF AEP` even when a valid date already exists, and (2) `extractMostRecentEntryDate()` picks the most recent schedule entry date instead of the earliest, so later schedule additions (like Counseling periods) shift the program start date forward.

The fix makes `FIRST DAY OF AEP` immutable once set (schedule dates only serve as fallback) and changes the date extraction logic to use the earliest active entry date instead of the most recent.

## Glossary

- **Bug_Condition (C)**: A student has a valid existing `FIRST DAY OF AEP` date AND has active schedules — `mergeScheduleData()` overwrites the date. Additionally, a student has multiple active schedule periods with different entry dates — `extractMostRecentEntryDate()` picks the latest instead of earliest.
- **Property (P)**: `FIRST DAY OF AEP` is preserved when already set; when derived from schedules, the earliest active entry date is used.
- **Preservation**: All existing behaviors unrelated to the date overwrite must remain unchanged — active schedule filtering, Period 10 teacher extraction, fallback population for new students, email reminder weekend/holiday skipping, exit date calculation mechanics.
- **`mergeScheduleData()`**: Method in `StudentDataMerger` (`src/data-processors/studentDataMerger.js`) that merges schedule data into the student map and currently overwrites `FIRST DAY OF AEP` unconditionally.
- **`extractMostRecentEntryDate()`**: Method in `StudentDataMerger` that extracts the entry date from active schedules — currently picks the most recent date instead of the earliest.
- **`_extractMostRecentEntryDateFromSchedules()`**: Mirror method in `TentativeRowBuilder` (`src/writers/tentativeRowBuilder.js`) used as fallback for exit date calculation — has the same most-recent bug.
- **`FIRST DAY OF AEP`**: Column on the TENTATIVE sheet representing when a student first entered the AEP program. Should be immutable once set.
- **Active Schedules**: Schedule rows with no `Wdraw Date` value, filtered by `filterActiveSchedules()`.

## Bug Details

### Bug Condition

The bug manifests in two compounding ways:

1. `mergeScheduleData()` unconditionally overwrites `FIRST DAY OF AEP` on every pipeline run, even when the student already has a valid date from a previous run or manual entry.
2. `extractMostRecentEntryDate()` selects the most recent entry date across active schedules. When a Counseling period is added later (e.g., 3/19/26), it becomes the "most recent" and overwrites the original program start date (e.g., 2/18/26).

**Formal Specification:**
```
FUNCTION isBugCondition(studentData, activeSchedules)
  INPUT: studentData with existing TENTATIVE record, activeSchedules array
  OUTPUT: boolean

  hasExistingDate := studentData.TENTATIVE[0]["FIRST DAY OF AEP"] IS NOT NULL
                     AND studentData.TENTATIVE[0]["FIRST DAY OF AEP"] IS NOT EMPTY

  hasActiveSchedules := activeSchedules.length > 0

  scheduleDatesVary := EXISTS schedule1, schedule2 IN activeSchedules
                       WHERE schedule1["Entry Date"] != schedule2["Entry Date"]

  RETURN (hasExistingDate AND hasActiveSchedules)
         OR (hasActiveSchedules AND scheduleDatesVary)
END FUNCTION
```

### Examples

- Student has `FIRST DAY OF AEP` = 2/18/26 from initial enrollment. Counseling period added 3/19/26. Current code overwrites to 3/19/26. Expected: preserve 2/18/26.
- Student has courses entered 12/9/25, 1/6/26, 3/4/26, 3/19/26. Current code picks 3/19/26. Expected: 12/9/25 (earliest active).
- Student has no `FIRST DAY OF AEP` (new student). Active schedules have entry date 1/15/26. Current code sets 1/15/26. Expected: still set 1/15/26 (fallback behavior preserved).
- Re-enrolled student: withdrew 10/6/25 (schedule rows have `Wdraw Date`), re-enrolled 3/26/26. `filterActiveSchedules()` excludes withdrawn rows. Expected: 3/26/26 (earliest active date).

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Active schedule filtering via `filterActiveSchedules()` must continue to exclude rows with a `Wdraw Date`
- Period 10 teacher extraction via `scheduleProcessor.extractPeriod10Teacher()` must continue working
- `EmailReminderService` weekend/holiday skip logic must remain unchanged
- `NAHS_EXPECTED_WITHDRAW_DATE()` holiday exclusion calculation must remain unchanged
- `TentativeRowBuilder.buildStudentRow()` must continue using `Entry_Withdrawal["Entry Date"]` for the displayed entry date column
- `TentativeRowBuilder._calculateEstimatedExitDay()` must continue using schedule-derived entry date as fallback when no Entry_Withdrawal date exists
- Students with no active schedules must have their `FIRST DAY OF AEP` and `ENTRY_DATE` fields left unchanged

**Scope:**
All inputs where the student already has a valid `FIRST DAY OF AEP` should have that date preserved. The only change is: (a) the date is no longer overwritten when it already exists, and (b) when derived from schedules, the earliest date is used instead of the most recent.

## Hypothesized Root Cause

Based on the code analysis, the root causes are confirmed (not hypothesized):

1. **Unconditional Overwrite in `mergeScheduleData()`**: Lines in `mergeScheduleData()` unconditionally set `FIRST DAY OF AEP` and `ENTRY_DATE` on the TENTATIVE record whenever `firstDayOfAEP` is truthy. There is no check for whether the student already has a valid date. The fix is to add a guard: only set these fields when the existing value is empty/null/undefined.

2. **Wrong Comparison Direction in `extractMostRecentEntryDate()`**: The method uses `if (timestamp > mostRecentTimestamp)` to find the maximum date. It should use `<` (or equivalent) to find the minimum date. The variable names (`mostRecentDate`, `mostRecentTimestamp`) also need renaming to reflect "earliest" semantics.

3. **Duplicate Bug in `TentativeRowBuilder._extractMostRecentEntryDateFromSchedules()`**: This method is a copy of the same logic and has the identical most-recent-instead-of-earliest bug. It needs the same fix.

4. **Duplicate Bug in `createBaseStudentMap()`**: When adding students from active schedules who aren't in the TENTATIVE sheet, this method calls `extractMostRecentEntryDate()`. After the rename/fix, this call will automatically use the corrected earliest-date logic.

## Correctness Properties

Property 1: Bug Condition - FIRST DAY OF AEP Immutability

_For any_ student whose TENTATIVE record already has a valid (non-empty, non-null) `FIRST DAY OF AEP` date, the fixed `mergeScheduleData()` SHALL preserve that existing date unchanged, regardless of what entry dates exist in the student's active schedules.

**Validates: Requirements 2.1**

Property 2: Bug Condition - Earliest Entry Date Extraction

_For any_ array of active schedules with one or more valid entry dates, the fixed `extractEarliestEntryDate()` (renamed from `extractMostRecentEntryDate()`) SHALL return the chronologically earliest entry date, not the most recent.

**Validates: Requirements 2.3**

Property 3: Preservation - Fallback Population for New Students

_For any_ student whose TENTATIVE record has NO valid `FIRST DAY OF AEP` date (empty, null, or undefined) AND who has active schedules with entry dates, the fixed `mergeScheduleData()` SHALL populate `FIRST DAY OF AEP` and `ENTRY_DATE` using the earliest active schedule entry date, preserving the existing fallback behavior.

**Validates: Requirements 2.2, 3.1**

Property 4: Preservation - No Active Schedules Leaves Date Unchanged

_For any_ student who has no active schedules (empty array after filtering), the fixed `mergeScheduleData()` SHALL leave the `FIRST DAY OF AEP` and `ENTRY_DATE` fields unchanged on the TENTATIVE record, producing the same result as the original function.

**Validates: Requirements 3.2**

## Fix Implementation

### Changes Required

**File**: `src/data-processors/studentDataMerger.js`

**Function**: `mergeScheduleData()`

**Specific Changes**:
1. **Guard existing `FIRST DAY OF AEP`**: Before setting `FIRST DAY OF AEP` and `ENTRY_DATE`, check if the student's TENTATIVE record already has a valid (non-empty, non-null) value. Only populate from schedules when the existing value is falsy.
2. **Same guard for `Entry_Withdrawal` records**: Only overwrite `Entry Date` on Entry_Withdrawal records when no existing value is present.

**Function**: `extractMostRecentEntryDate()` → rename to `extractEarliestEntryDate()`

**Specific Changes**:
3. **Reverse comparison**: Change `if (timestamp > mostRecentTimestamp)` to `if (timestamp < earliestTimestamp)` (with initial value of `Infinity` instead of `0`).
4. **Rename variables**: `mostRecentDate` → `earliestDate`, `mostRecentTimestamp` → `earliestTimestamp`.
5. **Rename method**: `extractMostRecentEntryDate` → `extractEarliestEntryDate`.

**Function**: `createBaseStudentMap()`

**Specific Changes**:
6. **Update call site**: Change `this.extractMostRecentEntryDate(activeSchedules)` to `this.extractEarliestEntryDate(activeSchedules)`.

---

**File**: `src/writers/tentativeRowBuilder.js`

**Function**: `_extractMostRecentEntryDateFromSchedules()` → rename to `_extractEarliestEntryDateFromSchedules()`

**Specific Changes**:
7. **Reverse comparison**: Same fix as #3 — change `>` to `<`, initialize to `Infinity`.
8. **Rename variables**: Same as #4.
9. **Rename method**: `_extractMostRecentEntryDateFromSchedules` → `_extractEarliestEntryDateFromSchedules`.
10. **Update call site in `_calculateEstimatedExitDay()`**: Change the method call and log message to reference the new name.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm the root cause analysis.

**Test Plan**: Write tests that create student data with existing `FIRST DAY OF AEP` dates and active schedules with different entry dates, then run `mergeScheduleData()` and `extractMostRecentEntryDate()` on the UNFIXED code to observe the overwrite and wrong-date-selection behavior.

**Test Cases**:
1. **Date Overwrite Test**: Student with `FIRST DAY OF AEP` = 2/18/26 and active schedules with entry date 3/19/26. Run `mergeScheduleData()` — expect overwrite to 3/19/26 on unfixed code (will fail assertion that date should be preserved).
2. **Wrong Date Selection Test**: Active schedules with entry dates [12/9/25, 1/6/26, 3/4/26, 3/19/26]. Run `extractMostRecentEntryDate()` — expect 3/19/26 returned on unfixed code (will fail assertion that earliest 12/9/25 should be returned).
3. **TentativeRowBuilder Mirror Test**: Same schedule data through `_extractMostRecentEntryDateFromSchedules()` — expect same wrong behavior.
4. **Downstream Impact Test**: Full pipeline with overwritten date, check that `EmailReminderService` milestone calculation uses the wrong date.

**Expected Counterexamples**:
- `mergeScheduleData()` overwrites `FIRST DAY OF AEP` from 2/18/26 to 3/19/26
- `extractMostRecentEntryDate()` returns 3/19/26 instead of 12/9/25
- Confirmed root cause: unconditional overwrite + wrong comparison direction

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed functions produce the expected behavior.

**Pseudocode:**
```
FOR ALL (studentData, activeSchedules) WHERE isBugCondition(studentData, activeSchedules) DO
  result := mergeScheduleData_fixed(studentData, activeSchedules)
  ASSERT result.TENTATIVE[0]["FIRST DAY OF AEP"] == original_FIRST_DAY_OF_AEP
  ASSERT extractEarliestEntryDate(activeSchedules) == MIN(activeSchedules[*]["Entry Date"])
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed functions produce the same result as the original functions.

**Pseudocode:**
```
FOR ALL (studentData, activeSchedules) WHERE NOT isBugCondition(studentData, activeSchedules) DO
  ASSERT mergeScheduleData_original(studentData, activeSchedules)
         == mergeScheduleData_fixed(studentData, activeSchedules)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many combinations of student data states (with/without dates, with/without schedules)
- It catches edge cases like empty strings vs null vs undefined for date fields
- It provides strong guarantees that fallback behavior is unchanged

**Test Plan**: Observe behavior on UNFIXED code first for students without existing dates and students with no schedules, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Fallback Population Preservation**: Student with no `FIRST DAY OF AEP` and active schedules — verify date is still populated from schedules (now using earliest)
2. **No Schedules Preservation**: Student with no active schedules — verify `FIRST DAY OF AEP` is unchanged
3. **Schedule Filtering Preservation**: Verify `filterActiveSchedules()` continues to exclude withdrawn schedule rows
4. **Period 10 Teacher Preservation**: Verify Period 10 teacher extraction continues working after the fix

### Unit Tests

- Test `extractEarliestEntryDate()` with single schedule, multiple schedules, mixed dates
- Test `mergeScheduleData()` with existing date (should preserve), without date (should populate)
- Test `_extractEarliestEntryDateFromSchedules()` in TentativeRowBuilder with same scenarios
- Test re-enrollment edge case: withdrawn + active schedules, earliest active date used
- Test edge cases: all schedules have same date, schedules with invalid dates, empty schedule array

### Property-Based Tests

- Generate random arrays of schedule objects with varying entry dates, verify `extractEarliestEntryDate()` always returns the minimum valid date
- Generate random student data with/without existing `FIRST DAY OF AEP`, verify `mergeScheduleData()` preserves existing dates and only populates when missing
- Generate random schedule arrays with some withdrawn rows, verify `filterActiveSchedules()` + `extractEarliestEntryDate()` chain produces correct earliest active date

### Integration Tests

- Full pipeline test: student with existing `FIRST DAY OF AEP` and Counseling period added later — verify date preserved through to `EmailReminderService` milestone calculation
- Full pipeline test: new student with no `FIRST DAY OF AEP` — verify date populated from earliest schedule entry date
- `TentativeRowBuilder` integration: verify `_calculateEstimatedExitDay()` uses correct entry date after fix
