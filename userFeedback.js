/**
 * Updates the status in the Progress sheet.
 * @param {string} currentStep - The current step of the process.
 * @param {string} message - The message to be displayed.
 * @param {boolean} isError - Indicates if the status is an error.
 */
function updateStatus(currentStep, message) {
  const progressSheet = SHEETS.PROGRESS;
  const status = `${currentStep}: ${message}`;
  progressSheet.getRange("A2").setValue(status).setFontColor(COLOR.BLACK).setFontSize(14).setFontWeight("bold");
  progressSheet.getRange("B2").setValue(new Date()).setFontColor(COLOR.BLACK).setFontSize(12);
}
function logError(err){
  var sheet = SpreadsheetApp.getActive().getSheetByName("Progress");
  const summaryRange = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 8);
  summaryRange.setValue(`The following error occured `+ err).setFontWeight("bold").setFontSize(14).setFontColor(COLOR.RED).mergeAcross();
}