/**
 * Writes the data from updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap to the "TENTATIVE2(TESTING)" sheet.
 */
function writeToTENTATIVE2_TESTINGSheet(
  updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap,
) {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "TENTATIVE2(TESTING)",
  );

  // Clear existing data from Row 2 downwards
  const lastRow = activeSheet.getLastRow();
  if (lastRow > 1) {
    activeSheet
      .getRange(2, 1, lastRow - 1, activeSheet.getLastColumn())
      .clear();
  }

  // Check if the input is defined and log its content
  if (!updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap) {
    console.error(
      "updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap is undefined.",
    );
    return; // Exit the function if it's undefined
  }

  if (
    typeof updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap !==
      "object" ||
    !(
      "forEach" in
      updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap
    )
  ) {
    console.error(
      "leftJoinResults is not iterable:",
      updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap,
    );
    return; // Exit the function if it's not iterable
  }

  // Array that will contain the prepared data to be written to the sheet
  const outputData = [];

  /**
   * This is a helper function used to format a date to MM/DD/YYYY.
   */
  function formatDateToMMDDYYYY(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Check for invalid date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`; // Format: YYYY-MM-DD
  }

  /**
   * Calculates the expected withdraw date for the student.
   *
   * @param {formattedEntryDate} - The date student registered at DAEP.
   * @param {placementDays} - The number of placement days.
   * @param {daysInEnrl} - The number of days the student has been enrolled at DAEP.
   * @param {daysInAtt} - The number of days the student has been in attendance at DAEP.
   * @returns
   * TODO: Is this function needed? Can we just call NAHS_EXPECTED_WITHDRAW_DATE directly?
   */
  function calculateExpectedWithdrawDate(
    formattedEntryDate,
    placementDays,
    daysInEnrl,
    daysInAtt,
  ) {
    // Validate dates
    if (!formattedEntryDate || isNaN(new Date(formattedEntryDate).getTime())) {
      console.error("Invalid formatted entry date:", formattedEntryDate);
      return null; // Return null if the entry date is invalid
    }

    if (!placementDays || !daysInEnrl || !daysInAtt) {
      return null; // Return null if any required data is missing
    }

    // Convert formattedEntryDate to the expected format
    const entryDateString = formatDateToMMDDYYYY(formattedEntryDate);

    const additionalDays = [daysInAtt, daysInEnrl];
    // Call the updated function with individual values
    return NAHS_EXPECTED_WITHDRAW_DATE(
      entryDateString,
      placementDays,
      holidayDates,
      additionalDays,
    );
  }

  updatedUpdatedUpdatedUdatedUpdatedUpdatedUpdatedActiveStudentDataMap.forEach(
    (studentData, studentId) => {
      // Access the Entry_Withdrawal array
      const entryWithdrawalArray = studentData["Entry_Withdrawal"];
      // Access the TENTATIVE array
      const tentativeArray = studentData["TENTATIVE"];
      // Access the Registrations_SY_24_25 array
      const registrationArray = studentData["Registrations_SY_24_25"];
      // Access the ContactInfo array
      const contactInfoArray = studentData["ContactInfo"];
      // Access the Schedules array
      const schedulesArray = studentData["Schedules"];
      // Access the Attendance & Enrollment array
      const attendanceArray = studentData["Alt_HS_Attendance_Enrollment_Count"];
      // Access the Form_Responses_1 array
      const formResponses1Array = studentData["Form_Responses_1"];

      // Ensure the Entry_Withdrawal array is defined and has at least one element
      if (
        !entryWithdrawalArray ||
        entryWithdrawalArray[0]["Entry Date"].length === 0
      ) {
        console.error(
          "Entry_Withdrawal data is missing for Student ID:",
          studentId,
        );
        return; // Skip this student if Entry_Withdrawal data is not available
      }

      // Access the first element of the Entry_Withdrawal array
      const entryData = entryWithdrawalArray[0]["Entry Date"];

      // Ensure entryData is defined
      if (!entryData) {
        console.error("Entry data is missing for Student ID:", studentId);
        return; // Skip this student if entry data is not available
      }

      // Continue with the rest of your logic
      const formattedEntryDate = formatDateToMMDDYYYY(entryData);
      // const gradeString = tentativeArray[0]["GRADE"]; // TODO: Is this variable needed? If not, remove it
      // const formattedGrade =
      //   typeof gradeString === "string" && gradeString
      //     ? gradeString.split("-")[0].trim().replace(/^0+/, "")
      //     : null; // TODO: Is this variable needed? If not, remove it

      // Validate the entry date
      // const entryDateString = new Date(formattedEntryDate);
      // if (isNaN(entryDateString)) {
      //   console.error(
      //     "Invalid entry date for Student ID:",
      //     studentId,
      //     "Date:",
      //     formattedEntryDate,
      //   );
      //   return; // Skip this entry if the date is invalid
      // }

      // Calculate Estimated Days Left
      const placementDays = registrationArray
        ? registrationArray[0]["Placement Days"]
        : null;
      const daysInAttendance = attendanceArray ? attendanceArray[0][4] : null;
      const estimatedDaysLeft = // TODO: Is this variable needed? If not, remove it
        placementDays !== null && daysInAttendance !== null
          ? placementDays - daysInAttendance
          : null;

      const daysInEnrl = attendanceArray ? attendanceArray[0][5] : 0;

      // Calculate Expected Withdraw Date
      const estimatedExitDay = calculateExpectedWithdrawDate(
        formattedEntryDate,
        placementDays,
        daysInEnrl,
        daysInAttendance,
      ); // Call the function to get the expected withdraw date

      const fullName =
        studentData["Entry_Withdrawal"][0]["Student Name(Last, First)"];
      const [backUpLastName, backUpFirstName] = fullName
        .split(",")
        .map((name) => name.trim());
      const lastName = tentativeArray
        ? tentativeArray[0]["LAST"]
        : backUpLastName;
      const firstName = tentativeArray
        ? tentativeArray[0]["FIRST"]
        : backUpFirstName;

      /**
       * This is a helper function that checks if the
       * value contains the word "504".
       *
       * @param {string|number|null} value - The value to check.
       * @returns {string} - "Yes" if the value contains "504", otherwise "No".
       */
      function contains504(value) {
        const str =
          value !== null && value !== undefined ? value.toString() : "";
        return str.includes("504") ? "Yes" : "No";
      }

      /**
       * This is a helper function that checks if the
       * value contains the word "ESL".
       *
       * @param {string|number|null} value - The value to check.
       * @returns {string} - "Yes" if the value contains "ESL", otherwise "No".
       */
      function containsESL(value) {
        const str =
          value !== null && value !== undefined ? value.toString() : "";
        return str.includes("ESL") ? "Yes" : "No";
      }

      const educationalFactors =
        registrationArray[0] &&
        registrationArray[0]["Educational Factors"] !== undefined
          ? registrationArray[0]["Educational Factors"]
          : null;

      const contains504Result = contains504(educationalFactors);
      const containsESLResult = containsESL(educationalFactors);

      // const contactInfo =
      //   studentData.TENTATIVE &&
      //   studentData.ContactInfo &&
      //   Array.isArray(studentData.ContactInfo) &&
      //   studentData.ContactInfo.length > 0
      //     ? studentData.ContactInfo[0]
      //     : null;

      const mergedDocId = tentativeArray
        ? tentativeArray[0]["Merged Doc ID - Transition Letter"]
        : null;
      const mergedDocUrl = tentativeArray
        ? tentativeArray[0]["Merged Doc URL - Transition Letter"]
        : null;
      const linkToMergedDoc = tentativeArray
        ? tentativeArray[0]["Link to merged Doc - Transition Letter"]
        : null;
      const documentMergeStatus = tentativeArray
        ? tentativeArray[0]["Document Merge Status - Transition Letter"]
        : null;

      /**
       * Updates the teacherInput object with values from formResponses1Array.
       *
       * @param {Object} teacherInput - The teacher input object to be updated.
       * @param {Array<Object>} formResponses1Array - The array of form responses.
       */
      function updateTeacherInput(teacherInput, formResponses1Array) {
        // Iterate through each period in the teacherInput object
        for (const period in teacherInput) {
          if (teacherInput.hasOwnProperty(period)) {
            // Find the matching entry in the formResponsesArray
            const matchingEntry = formResponses1Array.find(
              (response) =>
                response["What period do you have this student?"] === period,
            );

            // If a matching entry is found, update the teacherInput object
            if (matchingEntry) {
              teacherInput[period][
                "How would you assess this student's academic growth?"
              ] =
                matchingEntry[
                  "How would you assess this student's academic growth?"
                ] || "";
              teacherInput[period]["Academic and Behavioral Progress Notes"] =
                matchingEntry["Academic and Behavioral Progress Notes"] || "";
              teacherInput[period]["Teacher Name"] =
                matchingEntry["Teacher"] || "";
              teacherInput[period]["Course Title"] =
                matchingEntry["Course Title"] || "";
            }
          }
        }
      }

      const teacherInput = {
        "1st": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's academic growth?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "2nd": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's academic progress?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "3rd": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's academic progress?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "4th": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's academic progress?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "5th": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's academic progress?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "6th": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's academic progress?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "7th": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's progress?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "8th": {
          "Course Title": "",
          "Teacher Name": "",
          "Transfer Grade": "",
          "Current Grade": "",
          "How would you assess this student's progress?": "",
          "Academic and Behavioral Progress Notes": "",
        },
        "Special Education": {
          "Case Manager": "",
          "What accommodations seem to work well with this student to help them be successful?":
            "",
          "What are the student's strengths, as far as behavior?": "",
          "What are the student's needs, as far as behavior?": "",
          "What are the student's needs, as far as functional skills?": "",
          "Please add any other comments or concerns here:": "",
        },
      };

      // Check if formResponses1Array is null before calling updateTeacherInput
      if (formResponses1Array !== null) {
        updateTeacherInput(teacherInput, formResponses1Array);
      } else {
        console.log(
          "formResponses1Array is null. Skipping updateTeacherInput.",
        );
      }

      // Extract the needed data fields in the specified order
      outputData.push([
        tentativeArray ? formatDateToMMDDYYYY(tentativeArray[0]["DATE ADDED TO SPREADSHEET"]) : null, // TODO: ADD A FUNCTION TO CHECK IF THIS VALUE IS BLANK, IF IT IS THEN ADD THE CURRENT DATE & TIME IF IT ISN'T BLANK THEN BRING IN THE DATA
        lastName,
        firstName,
        studentId ? studentId : null,
        tentativeArray[0] ? tentativeArray[0]["GRADE"] : null,

        teacherInput["1st"]["Course Title"], // "1st Period - Course Title",
        teacherInput["1st"]["Teacher Name"], // "1st Period - Teacher Name",
        "", // "1st Period - Transfer Grade",
        "", // "1st Period - Current Grade",
        teacherInput["1st"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["1st"]["Academic and Behavioral Progress Notes"],

        teacherInput["2nd"]["Course Title"], // "2nd Period - Course Title",
        teacherInput["2nd"]["Teacher Name"], // "2nd Period - Teacher Name",
        "", // "2nd Period - Transfer Grade",
        "", // "2nd Period - Current Grade",
        teacherInput["2nd"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["2nd"]["Academic and Behavioral Progress Notes"],

        teacherInput["3rd"]["Course Title"], // "3rd Period - Course Title",
        teacherInput["3rd"]["Teacher Name"], // "3rd Period - Teacher Name",
        "", // "3rd Period - Transfer Grade",
        "", // "3rd Period - Current Grade",
        teacherInput["3rd"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["3rd"]["Academic and Behavioral Progress Notes"],

        teacherInput["4th"]["Course Title"], // "4th Period - Course Title",
        teacherInput["4th"]["Teacher Name"], // "4th Period - Teacher Name",
        "", // "4th Period - Transfer Grade",
        "", // "4th Period - Current Grade",
        teacherInput["4th"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["4th"]["Academic and Behavioral Progress Notes"],

        teacherInput["5th"]["Course Title"], // "5th Period - Course Title",
        teacherInput["5th"]["Teacher Name"], // "5th Period - Teacher Name",
        "", // "5th Period - Transfer Grade",
        "", // "5th Period - Current Grade",
        teacherInput["5th"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["5th"]["Academic and Behavioral Progress Notes"],

        teacherInput["6th"]["Course Title"], // "6th Period - Course Title",
        teacherInput["6th"]["Teacher Name"], // "6th Period - Teacher Name",
        "", // "6th Period - Transfer Grade",
        "", // "6th Period - Current Grade",
        teacherInput["6th"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["6th"]["Academic and Behavioral Progress Notes"],

        teacherInput["7th"]["Course Title"], // "7th Period - Course Title",
        teacherInput["7th"]["Teacher Name"], // "7th Period - Teacher Name",
        "", // "7th Period - Transfer Grade",
        "", // "7th Period - Current Grade",
        teacherInput["7th"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["7th"]["Academic and Behavioral Progress Notes"],

        teacherInput["8th"]["Course Title"], // "8th Period - Course Title",
        teacherInput["8th"]["Teacher Name"], // "8th Period - Teacher Name",
        "", // "8th Period - Transfer Grade",
        "", // "8th Period - Current Grade",
        teacherInput["8th"][
          "How would you assess this student's academic growth?"
        ],
        teacherInput["8th"]["Academic and Behavioral Progress Notes"],

        "", // "SE - Special Education Case Manager",
        "", // "SE - What accommodations seem to work well with this student to help them be successful?",
        "", // "SE - What are the student's strengths, as far as behavior?",
        "", // "SE - What are the student's needs, as far as behavior?  (Pick behavior having most effect on his/her ability to be successful in class.  If there are no concerns, note that.)",
        "", // "SE - What are the student's needs, as far as functional skills?  (Include daily living skills, fine/gross motor skills, organizational skills, self-advocacy, attendance, etc.)",
        "", // "SE - Please add any other comments or concerns here:",

        studentData.Registrations_SY_24_25
          ? studentData.Registrations_SY_24_25[0]["Home Campus"]
          : null, // "REGULAR CAMPUS",
        formattedEntryDate, // "FIRST DAY OF AEP",
        formatDateToMMDDYYYY(estimatedExitDay) || null, // "Anticipated Release Date",
        "", // "Parent Notice Date",
        "", // "Withdrawn Date",
        "", // "Attendance Recovery",
        studentData.Registrations_SY_24_25
          ? studentData.Registrations_SY_24_25[0]["Eligibilty"]
          : null, // "COMPASS",
        "", // "Credit Retrieval",
        studentData.Registrations_SY_24_25
          ? studentData.Registrations_SY_24_25[0]["Behavior Contract"]
          : null, // "Behavior Contract",
        "", // "Campus Mentor",
        "", // "Other Intervention 1",
        "", // "Other Intervention 2",
        contains504Result, // "504",
        containsESLResult, // "ESL",
        "", // "Additional notes or counseling services and Support",
        "", // "Licensed social worker consultation",
        "", // "Check if you're ready to create Transition Letter with Autocrat",
        studentData.ContactInfo
          ? studentData.ContactInfo[0]["Student Email"]
          : null, // "Student Email",
        studentData.ContactInfo
          ? studentData.ContactInfo[0]["Parent Name"]
          : null, // "Guardian Name",
        studentData.ContactInfo
          ? studentData.ContactInfo[0]["Guardian 1 Email"]
          : null, // "Guardian Email",
        mergedDocId, // "Merged Doc ID - Transition Letter"
        mergedDocUrl, // "Merged Doc URL - Transition Letter"
        linkToMergedDoc, // "Link to merged Doc - Transition Letter"
        documentMergeStatus, // "Document Merge Status - Transition Letter"
      ]);
    },
  );

  // Write the prepared data to the "Active" sheet starting from Row 2
  if (outputData.length > 0) {
    activeSheet
      .getRange(2, 1, outputData.length, outputData[0].length)
      .setValues(outputData);
  }
}
