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
 * Latest update: 12/18/24
 */

/**
 * Sends an email notification to specific recipients with a list of students 
 * who have been enrolled for 10 days at NAHS. The function checks if each 
 * student's 10-day mark matches today's date and compiles a list of such students.
 * If matches are found, an email is sent with an action item for teachers to provide 
 * input on students' academic and behavioral progress.
 */
function sendEmailsForToday() {
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`; // Adding 1 to getMonth() because months are 0-indexed

  // Check if today is a weekend
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

  // Check if today is a holiday
  const isHoliday = holidayDates.includes(formattedDate);

  // Run the emails only if it's a weekday and not a holiday
  if (!isWeekend && !isHoliday) {
    // const today = '2024-12-13' // This is for debugging and sending emails out manually. Set today's date in the variable. When using this, don't forget to turn it back off.
    const today = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    );

    // const emailRecipients = ["alvaro.gomez@nisd.net"]; // Used for debugging. Comment out the array below when debugging.
    const emailRecipients = [
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

    let dataObjects;
    try {
      dataObjects = getStudentsFromTENTATIVESheet();
    } catch (error) {
      Logger.log("Check Line 44: Error calling getStudentsFromTENTATIVESheet " + error);
      return;
    }

    if (!dataObjects || dataObjects.size === 0) {
      Logger.log("Check Line 51: No data found in dataObjects or dataObjects is undefined.");
      return;
    }

    let studentsForToday = [];

    try {
      for (let [studentID, dataArray] of dataObjects.entries()) {
        if (dataArray && dataArray[0] && dataArray[0]["FIRST DAY OF AEP"]) {
          let startDate = new Date(dataArray[0]["FIRST DAY OF AEP"]);
          let tenDaysMark = addWorkdays(startDate, 10, holidayDates || []);
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
          Logger.log(`Check Line 83: Data issue for Student ID ${studentID}: "FIRST DAY OF AEP" not found`);
        }
      }
    } catch (error) {
      Logger.log("Check Line 88: Error within for loop: " + error);
      return;
    }

    const sendEmail = (recipients, subject, body) => {
      GmailApp.sendEmail(recipients.join(","), subject, body);
    };

    if (studentsForToday.length > 0) {
      let dueDate = new Date(today);
      let workdaysAdded = 0;
      while (workdaysAdded < 2) {
        dueDate.setDate(dueDate.getDate() + 1);
        if (!isWeekend(dueDate) && !holidayDates.includes(Utilities.formatDate(dueDate, Session.getScriptTimeZone(), "yyyy-MM-dd"))) {
          workdaysAdded++;
        }
      }

      let formattedDueDate = Utilities.formatDate(dueDate, Session.getScriptTimeZone(), "MM-dd-yyyy");
      let subject = "Transition Reminder: Today's List of Students with 10 Days at NAHS";
      let formLink = "https://forms.gle/1NirWqZkvcABGgYc9";
      let body = `NAHS Teachers,\n\nBelow is today's list of students that have been enrolled for 10 days at NAHS:\n\n${studentsForToday.join(
        "\n"
      )}\n\nACTION ITEM (Due by end of day, ${formattedDueDate}): If you have one of these students on your roster, please go to: ${formLink} and provide your input on their academic growth and behavioral progress.\n\n****REMINDER****\nWhen inputting the period on the form, select the period that is listed on the student's schedule, the one you enter their attendance with.\n\nThank you`;

      sendEmail(emailRecipients, subject, body);
    } else {
      let subject = "Transition Reminder: Today's List of Students with 10 Days at NAHS";
      let body = `NAHS Teachers,\n\nWe do not have any students on today's 10-Day list!\nPlease work on any you have pending from before and be on the look out for the next list.\n\nHave a great day.`;

      sendEmail(emailRecipients, subject, body);
    }
  } else {
    Logger.log("Reminder emails were not sent because it is a holiday.")
  }
}
