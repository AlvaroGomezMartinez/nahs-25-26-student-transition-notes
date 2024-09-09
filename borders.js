/*****************************************************************************************
 *                         nahs-transition-project-24-25a                                *
 *                                                                                       *
 * The function (addThickBordersToSheets) reformats the sheets called 'TENTATIVE',       *
 * 'Withdrawn', and 'W/D Other' by adding borders to improve user experience.            *
 *                                                                                       *
 * A trigger is set to run addThickBordersToSheets on every change to the spreadsheet.   *
 *                                                                                       *
 * Point of Contact: Alvaro Gomez                                                        *
 *                   Academic Technology Coach                                           *
 *                   alvaro.gomez@nisd.net                                               *
 *                   Office: +1-210-397-9408                                             *
 *                   Mobile: +1-210-363-1577                                             *
 *                                                                                       *
 * Latest update: 11/21/23                                                               *
 *****************************************************************************************/

function addThickBordersToSheets() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheetsToApplyBorders = ["TENTATIVE", "Withdrawn", "W/D Other"];
  var rangesToApplyBorders = [
    "F:F",
    "L:L",
    "R:R",
    "X:X",
    "AD:AD",
    "AJ:AJ",
    "AP:AP",
    "AV:AV",
    "BB:BB",
    "BH:BH",
  ];

  for (var s = 0; s < sheetsToApplyBorders.length; s++) {
    var sheet = spreadsheet.getSheetByName(sheetsToApplyBorders[s]);
    if (sheet) {
      for (var i = 0; i < rangesToApplyBorders.length; i++) {
        var range = sheet.getRange(rangesToApplyBorders[i]);
        range.setBorder(
          null,
          true,
          null,
          null,
          null,
          null,
          "#000000",
          SpreadsheetApp.BorderStyle.SOLID_THICK,
        );
      }
    }
  }
}
