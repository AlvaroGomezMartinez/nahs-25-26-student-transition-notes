/**********************************************************************************
 * The sendEmailsForToday function below references the object returned by        *
 * registrationsData which is found in the sourceScript file in this project.     *
 *                                                                                *
 * sendEmailsForToday looks at the tenDaysMark date for each student and if the   *
 * date is today, then it sends an email to the teachers in emailRecipients with  *
 * a list of the students at the 10 Day Mark.                                     *
 *                                                                                *
 * sendEmailsForToday has five triggers set to run it every Monday, Tuesday,      *
 * Wednesday, Thursday, and Friday on Zina Gonzales' (social worker at NAHS)      *
 * gmail account so the emails to the teachers are recieved from her.             *
 *                                                                                *
 * Point of contact: Alvaro Gomez                                                 *
 *                   Academic Technology Coach                                    *
 *                   alvaro.gomez@nisd.net                                        *
 *                   Office: +1-210-397-9408                                      *
 *                   Mobile: +1-210-363-1577                                      *
 *                                                                                *
 * Latest update: 09/03/24                                                        *
 **********************************************************************************/

function sendEmailsForToday() {
  let today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );
  // let today = '2023-09-25' // This is for testing and sending emails out manually. Set a date in the variable. When using this, don't forget to turn it back off.
  let dataObjects = registrationsData();
  let studentsForToday = [];

  for (let i = 0; i < dataObjects.length; i++) {
    let dataObject = dataObjects[i];
    let tenDaysMark = dataObject["10 Days Mark"];

    if (tenDaysMark === today) {
      let lastName = dataObject["Student Last Name"];
      let firstName = dataObject["Student First Name"];
      let studentID = dataObject["Student ID"];
      let studentGrade = dataObject["Grade"];

      studentsForToday.push(
        `${lastName}, ${firstName} (${studentID}), Grade: ${studentGrade}`
      );
    }
  }

  if (studentsForToday.length > 0) {
    let holidayDates = [
      "2024-09-02",
      "2024-10-14",
      "2024-11-05",
      "2024-11-25",
      "2024-11-26",
      "2024-11-27",
      "2024-11-28",
      "2024-11-29",
      "2024-12-23",
      "2024-12-24",
      "2024-12-25",
      "2024-12-26",
      "2024-12-27",
      "2024-12-30",
      "2024-12-31",
      "2025-01-01",
      "2025-01-02",
      "2025-01-03",
      "2025-01-06",
      "2025-01-20",
      "2025-02-17",
      "2025-03-10",
      "2025-03-11",
      "2025-03-12",
      "2025-03-13",
      "2025-03-14",
      "2025-04-18",
      "2025-04-21",
      "2025-05-02",
      "2025-05-26",
    ];

    // Function to check if a date is a weekend (Saturday or Sunday)
    function isWeekend(date) {
      return date.getDay() === 0 || date.getDay() === 6; // 0 represents Sunday, 6 represents Saturday
    }

    // Calculate the due date
    let dueDate = new Date(today);

    // Loop to add two workdays (excluding weekends and holidays)
    let workdaysAdded = 0;
    while (workdaysAdded < 2) {
      dueDate.setDate(dueDate.getDate() + 1);

      // Check if the new date is not a weekend and not in the holidayDates array
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

    // Format the due date
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
    )}\n\nACTION ITEM (Due by end of day, ${formattedDueDate}): If you have one of these students on your roster, please go to: ${formLink} and provide your input on their academic growth and behavioral progress.\n\nThank you`;

    // The emailRecipients array below is used for testing.
    // let emailRecipients = ['alvaro.gomez@nisd.net'];
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
