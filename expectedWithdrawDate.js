/**
 * Calculates the expected withdrawal date by adding a specified number of school days to a given date,
 * excluding weekends and holidays.
 *
 * @param {Date} inputDate - The date when the student started their DAEP placement.
 * @param {number} numberOfDays - The number of school days the student was assigned to DAEP.
 * @param {Date[]} holidays - An array of holiday dates to skip (e.g., `[Holiday1, Holiday2, ...]`).
 * @param {number[]} additionalDays - An array containing two numbers: [H, I], where H is the number of
 * absences and I is an additional adjustment for the exit day estimation.
 * @returns {Date|null} The estimated exit day from DAEP, or null if any input is invalid.
 */
function NAHS_EXPECTED_WITHDRAW_DATE(
  inputDate, // A single date
  numberOfDays, // A single number
  holidays, // An array of holiday dates
  additionalDays, // Array with two numbers [H, I]
) {
  if (
    !inputDate ||
    isNaN(new Date(inputDate)) ||
    isNaN(numberOfDays) ||
    !additionalDays ||
    isNaN(additionalDays[0]) ||
    isNaN(additionalDays[1])
  ) {
    return null; // Return null if any input is invalid
  }

  var inputDateObj = new Date(inputDate);
  var additionalDaysH = Number(additionalDays[0]); // First column in additionalDaysRange
  var additionalDaysI = Number(additionalDays[1]); // Second column in additionalDaysRange

  // Calculate the additional days to be added
  var additionalDaysTotal = additionalDaysI - additionalDaysH;

  // Update the number of days to be added to inputDate
  var totalDays = numberOfDays + additionalDaysTotal;

  var currentDate = new Date(inputDateObj);
  var count = 1; // Start count at 1 to include the input date
  var formattedHolidays = holidays.map(function (date) {
    return new Date(date).toISOString().slice(0, 10); // Convert holidays to date strings
  });

  // Loop through and count valid school days (no weekends or holidays)
  while (count < totalDays) {
    currentDate.setDate(currentDate.getDate() + 1);

    // Check if the current day is a weekend (Saturday or Sunday)
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue; // Skip weekends
    }

    // Check if the current day is a holiday
    if (
      formattedHolidays.indexOf(currentDate.toISOString().slice(0, 10)) !== -1
    ) {
      continue; // Skip holidays
    }

    count++;
  }

  return currentDate; // Return the expected withdrawal date
}
