/**
 * Updates the status in the Progress sheet.
 * @param {string} currentStep - The current step of the process.
 * @param {string} message - The message to be displayed.
 */
function setTaskToProcessing(message, affectedSheetLink) {
  const progressSheet = SHEETS.PROGRESS;
  const lastRow = progressSheet.getLastRow();
  const newRow = lastRow + 1;
  const hyperlinkFormula = `=HYPERLINK("${affectedSheetLink}", "Affected File(s)")`;

  progressSheet.getRange(`A${newRow}`).setValue(message).setFontColor(COLOR.BLACK).setFontSize(14).setFontWeight(FONTS.BOLD);
  progressSheet.getRange(`B${newRow}`).setValue(new Date().toLocaleString('en-US', { hour12: false })).setFontColor(COLOR.BLACK).setFontSize(12);
  if(affectedSheetLink){
    progressSheet.getRange(`C${newRow}`).setFormula(hyperlinkFormula).setFontColor(COLOR.BLACK).setFontSize(12).setFontColor(COLOR.BLUE);
  }
  else{
    progressSheet.getRange(`C${newRow}`).setValue(`None`).setFontColor(COLOR.BLACK).setFontSize(12);
  }
  progressSheet.getRange(`D${newRow}`).setValue(`Status: Processing`).setFontColor(COLOR.ORANGE).setFontSize(12).setFontWeight(FONTS.BOLD);
}

/**
 * Sets the status of the last logged task to "Done".
 */
function setLastTaskToDone() {
  const progressSheet = SHEETS.PROGRESS;
  const lastRow = progressSheet.getLastRow();
  
  if (lastRow > 1) {
    progressSheet.getRange(`D${lastRow}`).setValue("Status: Done").setFontColor(COLOR.DARK_GREEN).setFontSize(12).setFontWeight(FONTS.BOLD);
  }
}
function logError(err) {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Progress");
  const summaryRange = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 8);
  summaryRange.setValue(`The following error occured ` + err).setFontWeight(FONTS.BOLD).setFontSize(14).setFontColor(COLOR.RED).mergeAcross();
}
function clearProgressSheet() {
  const progressSheet = SHEETS.PROGRESS;
  const lastRow = progressSheet.getLastRow();
  if (lastRow > 1) {
    progressSheet.getRange(`A2:D${lastRow}`).clear();
  }
}

function addSuccessfullRunStatus() {
  const progressSheet = SHEETS.PROGRESS;
  const lastRow = progressSheet.getLastRow();
  const newRow = lastRow + 1;
  const status = `If you're seeing this, it means all tasks completed successfully! :D`;

  progressSheet.getRange(`A${newRow}`).setValue(status);
  progressSheet.getRange(`B${newRow}`).setValue(new Date().toLocaleString('en-US', { hour12: false }));
  progressSheet.getRange(`C${newRow}`).setValue("Status: Done");

  progressSheet.getRange(`A${newRow}:D${newRow}`).setFontColor(COLOR.BLACK)
    .setFontSize(14)
    .setFontWeight(FONTS.BOLD)
    .setBackground(COLOR.LIGHT_GREEN);progressSheet.getRange(`C${newRow}`).setValue("Status: Done").setFontColor(COLOR.BLACK).setFontSize(14).setFontWeight(FONTS.BOLD).setBackground(COLOR.LIGHT_GREEN);
}