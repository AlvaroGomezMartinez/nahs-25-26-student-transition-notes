# Bugfix Requirements Document

## Introduction

The automated transition reminder system incorrectly resets the `FIRST DAY OF AEP` date for students already on the TENTATIVE sheet. There are two compounding issues:

**Issue 1 — Unconditional date overwrite:** `StudentDataMerger.mergeScheduleData()` unconditionally overwrites the original `FIRST DAY OF AEP` value with the schedule-derived entry date, even when a valid date already exists. `FIRST DAY OF AEP` should be immutable once set — it represents when the student first entered the AEP program.

**Issue 2 — Wrong date extraction logic:** `extractMostRecentEntryDate()` selects the *most recent* entry date from active schedules. When counselors or staff add new schedule periods (e.g., a "Counseling" period added on 3/19/26), that later date becomes the extracted value — even though the student's actual program start date is the *earliest* entry date across their original course periods (e.g., 2/18/26). The method should use the earliest entry date, not the most recent, because later schedule additions do not change when the student entered the program.

**Triggering event:** On April 1, 2026, the `autoCheckAndUpdate` function ran the full pipeline. Counselors had recently added "Counseling" periods (entry date 3/19/26) to many students' schedules. `extractMostRecentEntryDate()` picked 3/19/26 as the entry date, and `mergeScheduleData()` overwrote `FIRST DAY OF AEP` for 116 students. When `sendEmailsForToday` ran at 5:44 AM, it calculated 10 workdays from 3/19/26 = April 2, 2026, causing 63 students to incorrectly appear on the reminder email.

The `NISDHolidayLibrary.getHolidayDates()` external library is working correctly — the issue is not with holiday date handling but with the date being reset before the 10-day calculation happens.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN `mergeScheduleData()` processes a student whose TENTATIVE record already has a valid `FIRST DAY OF AEP` date AND the student has active schedules with an entry date THEN the system unconditionally overwrites the existing `FIRST DAY OF AEP` with the schedule-derived entry date, losing the original program entry date.

1.2 WHEN `extractMostRecentEntryDate()` processes a student's active schedules AND the student has schedule periods added at different times (e.g., original courses entered 2/18/26 and a Counseling period added 3/19/26) THEN the method selects the most recent entry date (3/19/26) instead of the earliest entry date (2/18/26), producing an incorrect program start date that does not reflect when the student actually entered AEP.

1.3 WHEN the `FIRST DAY OF AEP` date is overwritten with a later schedule entry date THEN the `EmailReminderService._findStudentsAtMilestone()` calculates the 10-day milestone from the wrong (later) date, causing students who have already been enrolled for more than 10 days to appear on the daily reminder email as if they just reached the milestone.

1.4 WHEN `mergeScheduleData()` overwrites `FIRST DAY OF AEP` THEN the `Entry_Withdrawal` records are also overwritten with the schedule entry date, causing `TentativeRowBuilder._calculateEstimatedExitDay()` to compute an incorrect anticipated release date based on the reset date rather than the original program entry date.

### Expected Behavior (Correct)

2.1 WHEN `mergeScheduleData()` processes a student whose TENTATIVE record already has a valid `FIRST DAY OF AEP` date THEN the system SHALL preserve the existing `FIRST DAY OF AEP` value and NOT overwrite it with the schedule-derived entry date.

2.2 WHEN `mergeScheduleData()` processes a student whose TENTATIVE record has NO `FIRST DAY OF AEP` date (empty, null, or undefined) THEN the system SHALL use the schedule-derived earliest entry date as a fallback to populate `FIRST DAY OF AEP` and `ENTRY_DATE`.

2.3 WHEN extracting the program entry date from active schedules THEN `extractMostRecentEntryDate()` (to be renamed `extractEarliestEntryDate()`) SHALL select the *earliest* entry date across all active schedule periods, not the most recent. This ensures that later schedule additions (e.g., adding a Counseling period) do not shift the student's program start date forward.

2.4 WHEN the `EmailReminderService` calculates the 10-day milestone THEN the system SHALL use the original, preserved `FIRST DAY OF AEP` date so that students are correctly identified at their actual 10-day enrollment mark and do not reappear on reminder emails after their date has passed.

2.5 WHEN `TentativeRowBuilder._calculateEstimatedExitDay()` computes the anticipated release date THEN the system SHALL use the original `FIRST DAY OF AEP` date (or the `Entry Date` from Entry_Withdrawal), ensuring the release date calculation is based on the student's actual program start date.

2.6 WHEN `TentativeRowBuilder._extractMostRecentEntryDateFromSchedules()` is used as a fallback for entry date THEN it SHALL also be updated to extract the *earliest* entry date (and renamed accordingly) to maintain consistency with the fix in `StudentDataMerger`.

### Re-enrollment Edge Case

2.7 WHEN a student has previously enrolled and withdrawn (schedule rows with a `Wdraw Date`) AND has re-enrolled with new active schedule rows (no `Wdraw Date`) THEN the system SHALL correctly use the earliest entry date from the *active* (non-withdrawn) schedule rows only, ignoring the prior enrollment's entry dates. For example, a student who enrolled 8/11/25, withdrew 10/6/25, and re-enrolled 3/26/26 should have `FIRST DAY OF AEP` set to 3/26/26 (the re-enrollment date), not 8/11/25. This is already handled by `filterActiveSchedules()` which excludes rows with a withdrawal date before the entry date extraction runs.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a student has active schedules but NO existing `FIRST DAY OF AEP` date on their TENTATIVE record THEN the system SHALL CONTINUE TO populate `FIRST DAY OF AEP` and `ENTRY_DATE` from the schedule-derived entry date (now using the earliest date instead of most recent).

3.2 WHEN a student has no active schedules THEN the system SHALL CONTINUE TO leave the `FIRST DAY OF AEP` and `ENTRY_DATE` fields unchanged on the TENTATIVE record.

3.3 WHEN `mergeScheduleData()` processes schedule data THEN the system SHALL CONTINUE TO filter active schedules (no withdrawal date), extract the Period 10 teacher, and store the active schedules on the student data object.

3.4 WHEN the `EmailReminderService` runs on weekends or holidays THEN the system SHALL CONTINUE TO skip sending reminder emails as it does today.

3.5 WHEN `TentativeRowBuilder` builds a student row THEN the system SHALL CONTINUE TO use the `Entry Date` from `Entry_Withdrawal` for the displayed entry date column and the schedule-derived entry date as a fallback for estimated exit day calculation when no Entry_Withdrawal date exists.

3.6 WHEN `NAHS_EXPECTED_WITHDRAW_DATE()` calculates the expected withdrawal date THEN the system SHALL CONTINUE TO correctly exclude weekends and holidays from the calculation using `holidayDates`.

3.7 WHEN `createBaseStudentMap()` adds students from active schedules who are not in the TENTATIVE sheet THEN the system SHALL CONTINUE TO use the schedule-derived entry date for those new students (now using the earliest date instead of most recent).
