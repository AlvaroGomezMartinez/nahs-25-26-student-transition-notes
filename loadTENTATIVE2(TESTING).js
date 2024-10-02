function loadTENTATIVE2_TESTING () {
  const TENTATIVE2_TESTING = getStudentsFromTENTATIVESheet();
  const Registrations_SY_24_25 = loadRegistrationsData();
  const ContactInfo = loadContactData();
  const Entry_Withdrawal = loadEntryWithdrawalData();
  const Schedules = schedulesSheet();
  const Form_Responses_1 = getStudentsFromFormResponses1Sheet();
  const Withdrawn = getWithdrawnStudentsSheet();

  // Load Entry_Withdrawal and filter it with Withdrawn
  let firstFilteredResults = filterOutMatchesFromMapA(Entry_Withdrawal, Withdrawn);

  // Left join firstFilteredResults with Registrations_SY_24_25, ContactInfo, Schedules, Form_Responses_1
  let tentativeFilteredResults = leftJoinMaps(firstFilteredResults, TENTATIVE2_TESTING, Registrations_SY_24_25, ContactInfo, Schedules, Form_Responses_1);

  // Push it to TENTATIVE2(TESTING)

  let leftJoinResults = leftJoinMaps(TENTATIVE2_TESTING, Registrations_SY_24_25, ContactInfo, Entry_Withdrawal, Schedules, Form_Responses_1);
  
  //return leftJoinResults;
}
