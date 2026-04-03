# Implementation Plan

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - FIRST DAY OF AEP Overwrite and Wrong Date Extraction
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior — they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate both compounding bugs exist
  - **Scoped PBT Approach**: Scope the property to concrete failing cases that reproduce the two bugs
  - Create test file `tests/unit/data-processors/test_transitionDateReset_bugCondition.js`
  - Use QUnitGS2 test framework (consistent with existing test infrastructure)
  - **Test 1 — Unconditional Overwrite**: Create a student with existing `FIRST DAY OF AEP` = "2/18/2026" on TENTATIVE record. Create active schedules with entry date "3/19/2026". Run `mergeScheduleData()`. Assert that `FIRST DAY OF AEP` is STILL "2/18/2026" (not overwritten). On unfixed code this will FAIL because `mergeScheduleData()` unconditionally overwrites.
  - **Test 2 — Wrong Date Extraction**: Create active schedules with entry dates ["12/9/2025", "1/6/2026", "3/4/2026", "3/19/2026"]. Run `extractMostRecentEntryDate()`. Assert result equals "12/9/2025" (earliest). On unfixed code this will FAIL because it returns "3/19/2026" (most recent).
  - **Test 3 — TentativeRowBuilder Mirror Bug**: Create student data with active schedules having entry dates ["2/18/2026", "3/19/2026"]. Run `_extractMostRecentEntryDateFromSchedules()`. Assert result equals "2/18/2026" (earliest). On unfixed code this will FAIL.
  - **Test 4 — Entry_Withdrawal Overwrite**: Create a student with existing `Entry_Withdrawal[0]["Entry Date"]` = "2/18/2026". Create active schedules with entry date "3/19/2026". Run `mergeScheduleData()`. Assert `Entry_Withdrawal[0]["Entry Date"]` is STILL "2/18/2026". On unfixed code this will FAIL.
  - Register tests via `registerBugConditionTests()` function
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: All 4 tests FAIL (this is correct — it proves both bugs exist)
  - Document counterexamples found to confirm root cause analysis
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Unchanged Behavior for Non-Bug-Condition Inputs
  - **IMPORTANT**: Follow observation-first methodology
  - Create test file `tests/unit/data-processors/test_transitionDateReset_preservation.js`
  - Use QUnitGS2 test framework (consistent with existing test infrastructure)
  - **Observe on UNFIXED code first**, then write tests asserting observed behavior:
  - **Test 1 — Fallback Population (New Student)**: Student with NO `FIRST DAY OF AEP` (empty string) and active schedules with entry date "1/15/2026". Run `mergeScheduleData()`. Observe that `FIRST DAY OF AEP` is populated from schedules. Assert it gets populated (value is truthy). On unfixed code this PASSES.
  - **Test 2 — No Active Schedules**: Student with `FIRST DAY OF AEP` = "2/18/2026" and NO active schedules (empty array). Run `mergeScheduleData()`. Observe that `FIRST DAY OF AEP` remains "2/18/2026". Assert date is unchanged. On unfixed code this PASSES.
  - **Test 3 — Active Schedule Filtering**: Create schedules array with mix of active (no `Wdraw Date`) and withdrawn (has `Wdraw Date`). Run `filterActiveSchedules()`. Assert only active schedules are returned. On unfixed code this PASSES.
  - **Test 4 — Period 10 Teacher Extraction**: Create active schedules including a Period 10 entry with teacher name. Run `mergeScheduleData()`. Assert `Period10Teacher` is correctly extracted. On unfixed code this PASSES.
  - **Test 5 — extractMostRecentEntryDate with Single Schedule**: Single active schedule with entry date "1/15/2026". Run `extractMostRecentEntryDate()`. Assert returns "1/15/2026". On unfixed code this PASSES (single date — no min/max difference).
  - **Test 6 — extractMostRecentEntryDate with Empty Array**: Empty active schedules array. Run `extractMostRecentEntryDate()`. Assert returns null. On unfixed code this PASSES.
  - **Test 7 — New Student from Schedules (createBaseStudentMap)**: Student in schedulesData but NOT in tentativeData. Verify `createBaseStudentMap()` adds them with schedule-derived entry date. On unfixed code this PASSES.
  - Register tests via `registerPreservationTests()` function
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: All tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 2.2, 2.7, 3.1, 3.2, 3.3, 3.5, 3.7_

- [x] 3. Fix for FIRST DAY OF AEP date reset bug

  - [x] 3.1 Fix `extractMostRecentEntryDate()` → rename to `extractEarliestEntryDate()` in `src/data-processors/studentDataMerger.js`
    - Reverse comparison: change `if (timestamp > mostRecentTimestamp)` to `if (timestamp < earliestTimestamp)`
    - Change initial value from `0` to `Infinity`
    - Rename variables: `mostRecentDate` → `earliestDate`, `mostRecentTimestamp` → `earliestTimestamp`
    - Rename method: `extractMostRecentEntryDate` → `extractEarliestEntryDate`
    - Update log message from "most recent" to "earliest"
    - _Bug_Condition: isBugCondition — activeSchedules have varying entry dates, method picks latest instead of earliest_
    - _Expected_Behavior: extractEarliestEntryDate(activeSchedules) returns MIN(activeSchedules[*]["Entry Date"])_
    - _Requirements: 2.3_

  - [x] 3.2 Update call site in `createBaseStudentMap()` in `src/data-processors/studentDataMerger.js`
    - Change `this.extractMostRecentEntryDate(activeSchedules)` to `this.extractEarliestEntryDate(activeSchedules)`
    - _Requirements: 2.3, 3.7_

  - [x] 3.3 Guard existing `FIRST DAY OF AEP` in `mergeScheduleData()` in `src/data-processors/studentDataMerger.js`
    - Before setting `FIRST DAY OF AEP` and `ENTRY_DATE` on TENTATIVE records, check if existing value is already valid (non-empty, non-null)
    - Only populate from schedules when existing value is falsy
    - Apply same guard for `Entry_Withdrawal` records — only overwrite `Entry Date` when no existing value
    - Update the method to call `this.extractEarliestEntryDate()` instead of `this.extractMostRecentEntryDate()`
    - _Bug_Condition: isBugCondition — student has valid FIRST DAY OF AEP AND has active schedules → unconditional overwrite_
    - _Expected_Behavior: existing FIRST DAY OF AEP preserved; only populated when empty/null_
    - _Preservation: fallback population for new students still works; no-schedule students unchanged; re-enrollment handled by filterActiveSchedules()_
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.7_

  - [x] 3.4 Fix `_extractMostRecentEntryDateFromSchedules()` → rename to `_extractEarliestEntryDateFromSchedules()` in `src/writers/tentativeRowBuilder.js`
    - Reverse comparison: change `if (timestamp > mostRecentTimestamp)` to `if (timestamp < earliestTimestamp)`
    - Change initial value from `0` to `Infinity`
    - Rename variables: `mostRecentDate` → `earliestDate`, `mostRecentTimestamp` → `earliestTimestamp`
    - Rename method: `_extractMostRecentEntryDateFromSchedules` → `_extractEarliestEntryDateFromSchedules`
    - _Bug_Condition: same wrong-comparison bug duplicated in TentativeRowBuilder_
    - _Expected_Behavior: returns earliest entry date from active schedules_
    - _Requirements: 2.6_

  - [x] 3.5 Update call site in `_calculateEstimatedExitDay()` in `src/writers/tentativeRowBuilder.js`
    - Change `this._extractMostRecentEntryDateFromSchedules(studentData)` to `this._extractEarliestEntryDateFromSchedules(studentData)` (two call sites in this method)
    - Update log message from "most recent" to "earliest"
    - _Requirements: 2.5, 2.6_

  - [x] 3.6 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - FIRST DAY OF AEP Immutability and Earliest Date Extraction
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 1
    - **EXPECTED OUTCOME**: All 4 tests PASS (confirms both bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Unchanged Behavior for Non-Bug-Condition Inputs
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: All tests PASS (confirms no regressions)
    - Confirm all preservation tests still pass after fix (no regressions)
    - _Requirements: 2.2, 2.7, 3.1, 3.2, 3.3, 3.5, 3.7_

- [x] 4. Checkpoint - Ensure all tests pass
  - Run the full test suite including bug condition tests and preservation tests
  - Verify no existing tests in `tests/unit/data-processors/test_dataProcessors.js` or `tests/unit/writers/test_writers.js` are broken
  - Ensure all tests pass, ask the user if questions arise
