/**
 *
 * The sendEmailsForToday function below references the object returned by the
 * getStudentsFromTENTATIVESheet() which is found in the loadTENTATIVEVersion2.gs
 * file in this project.
 *
 * sendEmailsForToday looks at the tenDaysMark date for each student and if the
 * date is today, then it sends an email to the teachers in emailRecipients with
 * a list of the students at the 10 Day Mark.
 *
 * sendEmailsForToday has five triggers set to run it every Monday, Tuesday,
 * Wednesday, Thursday, and Friday on Zina Gonzales' (social worker at NAHS)
 * gmail account so the emails to the teachers are recieved from her.
 *
 * Point of contact: Alvaro Gomez
 *                   Academic Technology Coach
 *                   alvaro.gomez@nisd.net
 *                   Office: +1-210-397-9408
 *                   Mobile: +1-210-363-1577
 *
 * Latest update: 11/07/24
 */

/**
 * Sends an email notification to specific recipients with a list of students 
 * who have been enrolled for 10 days at NAHS. The function checks if each 
 * student's 10-day mark matches today's date and compiles a list of such students.
 * If matches are found, an email is sent with an action item for teachers to provide 
 * input on students' academic and behavioral progress.
 */
function sendEmailsForToday() {
  let today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );
  // let today = '2024-11-07' // This is for testing and sending emails out manually. Set today's date in the variable. When using this, don't forget to turn it back off.

  let dataObjects;

  try {
    dataObjects = getStudentsFromTENTATIVESheet();
  } catch (error) {
    Logger.log("Log 44: Error calling getStudentsFromTENTATIVESheet " + error);
    return;
  }

  // Check if dataObjects is defined and not empty
  if (!dataObjects || dataObjects.size === 0) {
    Logger.log(
      "Line 51: No data found in dataObjects or dataObjects is undefined."
    );
    return;
  }

  let studentsForToday = [];

  try {
    for (let [studentID, dataArray] of dataObjects.entries()) {
      if (dataArray && dataArray[0] && dataArray[0]["FIRST DAY OF AEP"]) {
        let startDate = new Date(dataArray[0]["FIRST DAY OF AEP"]);
        let tenDaysMark = addWorkdays(startDate, 10, holidayDates);
        let formattedTenDaysMark = Utilities.formatDate(
          tenDaysMark,
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
        );

        if (formattedTenDaysMark === today) {
          let lastName = dataArray[0]["LAST"];
          let firstName = dataArray[0]["FIRST"];
          let studentID = dataArray[0]["STUDENT ID"];
          let studentGrade = dataArray[0]["GRADE"];

          studentsForToday.push(
            `${lastName}, ${firstName} (${studentID}), Grade: ${studentGrade}`
          );
        }
      } else {
        Logger.log(
          `Line 81: Data structure issue for Student ID ${studentID}: "FIRST DAY OF AEP" not found`
        );
      }
    }
  } catch (error) {
    Logger.log("Line 86: Error within for loop: " + error);
    return;
  }

  if (studentsForToday.length > 0) {
    /**
     * Helper function to check if a given date falls on a weekend.
     * @param {Date} date - The date to check.
     * @return {boolean} True if the date is a weekend, otherwise false.
     */
    function isWeekend(date) {
      return date.getDay() === 0 || date.getDay() === 6; // 0 represents Sunday, 6 represents Saturday
    }

    let dueDate = new Date(today);

    // Loop to add two workdays (excluding weekends and holidays)
    let workdaysAdded = 0;
    while (workdaysAdded < 2) {
      dueDate.setDate(dueDate.getDate() + 1);

      if (
        !isWeekend(dueDate) &&
        !holidayDates.includes(
          Utilities.formatDate(
            dueDate,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
          )
        )
      ) {
        workdaysAdded++;
      }
    }

    let formattedDueDate = Utilities.formatDate(
      dueDate,
      Session.getScriptTimeZone(),
      "MM-dd-yyyy"
    );
    let subject =
      "Transition Reminder: Today's List of Students with 10 Days at NAHS";
    let formLink = "https://forms.gle/1NirWqZkvcABGgYc9";
    let body = `NAHS Teachers,\n\nBelow is today's list of students that have been enrolled for 10 days at NAHS:\n\n${studentsForToday.join(
      "\n"
    )}\n\nACTION ITEM (Due by end of day, ${formattedDueDate}): If you have one of these students on your roster, please go to: ${formLink} and provide your input on their academic growth and behavioral progress.\n****REMINDER***a\nWhen inputting the period on the form, select the period that is listed on the student's schedule, the one you enter their attendance with. \n\nThank you`;

    // let emailRecipients = ['alvaro.gomez@nisd.net']; // This commented out version of emailRecipients is used for testing.
    let emailRecipients = [
      "marco.ayala@nisd.net",
      "alita.barrera@nisd.net",
      "gabriela.chavarria-medina@nisd.net",
      "leticia.collier@nisd.net",
      "staci.cunningham@nisd.net",
      "samantha.daywood@nisd.net",
      "richard.delarosa@nisd.net",
      "ramon.duran@nisd.net",
      "janice.flores@nisd.net",
      "lauren.flores@nisd.net",
      "roslyn.francis@nisd.net",
      "daniel.galdeano@nisd.net",
      "nancy-1.garcia@nisd.net",
      "cierra.gibson@nisd.net",
      "zina.gonzales@nisd.net",
      "alvaro.gomez@nisd.net",
      "teressa.hensley@nisd.net",
      "catherine.huff@nisd.net",
      "erin.knippa@nisd.net",
      "joshua.lacour@nisd.net",
      "thalia.mendez@nisd.net",
      "alexandria.murphy@nisd.net",
      "dennis.olivares@nisd.net",
      "loretta.owens@nisd.net",
      "denisse.perez@nisd.net",
      "jessica.poladelcastillo@nisd.net",
      "angela.rodriguez@nisd.net",
      "linda.rodriguez@nisd.net",
      "jessica-1.vela@nisd.net",
      "miranda.wenzlaff@nisd.net",
    ];

    GmailApp.sendEmail(emailRecipients.join(","), subject, body);
  }
}
