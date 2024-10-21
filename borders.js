/**
 * Adds thick borders to specific columns on the sheets 'TENTATIVE', 'Withdrawn', 'W/D Other', 
 * and 'TENTATIVE2(TESTING)' in the active Google Sheets document. The borders are applied to a 
 * predefined set of column ranges on each sheet.
 * 
 * @function
 * @name addThickBordersToSheets
 * 
 * @summary
 * Applies thick borders to specified columns on select sheets to improve user experience.
 * 
 * @description
 * This function retrieves the active spreadsheet and applies a thick black border to specific 
 * columns across the sheets: 'TENTATIVE', 'Withdrawn', 'W/D Other', and 'TENTATIVE2(TESTING)'. 
 * It loops over the sheets and the predefined column ranges, applying a thick border to each range.
 * The function is triggered on every change made to the spreadsheet, improving the visual 
 * layout and enhancing readability.
 * 
 * @global
 * SpreadsheetApp - Google Apps Script service to work with Google Sheets.
 * 
 * @see SpreadsheetApp.getActive - Gets the active spreadsheet.
 * @see SpreadsheetApp.BorderStyle.SOLID_THICK - Sets a thick solid border style.
 * 
 */
function addThickBordersToSheets() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheetsToApplyBorders = ["TENTATIVE", "Withdrawn", "W/D Other", "TENTATIVE-Version2"];
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
          null, // Top
          true, // Right
          null, // Bottom
          null, // Left
          null, // Vertical
          null, // Horizontal
          "#000000", // Border color
          SpreadsheetApp.BorderStyle.SOLID_THICK // Border style
        );
      }
    }
  }
}
