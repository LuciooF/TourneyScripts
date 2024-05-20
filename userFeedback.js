/**
 * Updates the status in the Progress sheet.
 * @param {string} currentStep - The current step of the process.
 * @param {string} message - The message to be displayed.
 */
function updateStatus(message) {
  const progressSheet = SHEETS.PROGRESS;
  const lastRow = progressSheet.getLastRow();
  const newRow = lastRow + 1;

  progressSheet.getRange(`A${newRow}`).setValue(message).setFontColor(COLOR.BLACK).setFontSize(14).setFontWeight("bold");
  progressSheet.getRange(`B${newRow}`).setValue(new Date().toLocaleString('en-US', { hour12: false })).setFontColor(COLOR.BLACK).setFontSize(12);
  progressSheet.getRange(`C${newRow}`).setValue("Status: Done").setFontColor(COLOR.DARK_GREEN).setFontSize(12).setFontWeight("bold");
}
function logError(err) {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Progress");
  const summaryRange = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 8);
  summaryRange.setValue(`The following error occured ` + err).setFontWeight("bold").setFontSize(14).setFontColor(COLOR.RED).mergeAcross();
}
function clearProgressSheet() {
  const progressSheet = SHEETS.PROGRESS;
  const lastRow = progressSheet.getLastRow();
  if (lastRow > 1) {
    progressSheet.getRange(`A2:C${lastRow}`).clear();
  }
}

function addSuccessfullRunStatus() {
  const progressSheet = SHEETS.PROGRESS;
  const lastRow = progressSheet.getLastRow();
  const newRow = lastRow + 1;
  const status = `If you're seeing this, it means all tasks completed successfully! :D`;

  progressSheet.getRange(`A${newRow}`).setValue(status).setFontColor(COLOR.BLACK).setFontSize(14).setFontWeight("bold").setBackground(COLOR.LIGHT_GREEN);
  progressSheet.getRange(`B${newRow}`).setValue(new Date().toLocaleString('en-US', { hour12: false })).setFontColor(COLOR.BLACK).setFontSize(14).setFontWeight("bold").setBackground(COLOR.LIGHT_GREEN);
  progressSheet.getRange(`C${newRow}`).setValue("Status: Done").setFontColor(COLOR.BLACK).setFontSize(14).setFontWeight("bold").setBackground(COLOR.LIGHT_GREEN);
}