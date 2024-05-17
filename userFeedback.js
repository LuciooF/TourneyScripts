//I fucking hate how complicated this got real quick.
function updateStatus(currentStep, message, isError = false) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const progressSheet = spreadsheet.getSheetByName("Progress") || spreadsheet.insertSheet("Progress");
  spreadsheet.setActiveSheet(progressSheet);

  // Setup headers if not already set
  if (progressSheet.getRange('A1').getValue() === '') {
    progressSheet.getRange('A1:D1').merge().setValue('Progress Updates').setBackground(COLOLR.BLUE_GREY).setFontColor(COLOR.GREY).setFontSize(16).setFontWeight('bold');
    progressSheet.setColumnWidths(1, 4, 200);
    progressSheet.setFrozenRows(1);
  }

  const steps = [
    "Starting Update",
    "Fetching Data",
    "Processing Data",
    "Writing to Master Sheet",
    "Logging Errors",
    "Creating/Updating Club Sheets",
    "Update Complete", 
  ];

  const neededRows = steps.length + 2;
  if (progressSheet.getMaxRows() < neededRows) {
    progressSheet.insertRowsAfter(progressSheet.getMaxRows(), neededRows - progressSheet.getMaxRows());
  }

  let previousStepDone = true;
  let allPreviousCompleted = true;

  steps.forEach((stepName, index) => {
    let rowNumber = index + 2;
    let cellRange = progressSheet.getRange(rowNumber, 1, 1, 4);
    cellRange.merge();
    let existingValue = cellRange.getValue();
    let backgroundColor = COLOR.WHITE; // Default background for pending steps
    let fontColor = COLOR.black;
    let statusMessage = `${stepName}: Pending...`;

    if (stepName === currentStep) {
      statusMessage = `${stepName}: In Process - ${message}`;
      backgroundColor = COLOR.DARK_GREEN;
      fontColor = COLOR.WHITE; 
      previousStepDone = false;
      allPreviousCompleted = false;
    } else if (existingValue.includes("In Process") && previousStepDone) {
      statusMessage = `${stepName}: Done`;
      backgroundColor = COLOR.LIGHT_GREEN;
    } else if (existingValue.includes("Pending") && !previousStepDone) {
      statusMessage = existingValue;
      allPreviousCompleted = false;
    } else if (existingValue.includes("Done") || existingValue.includes("Error")) {
      statusMessage = existingValue;
      backgroundColor = existingValue.includes("Done") ? COLOR.LIGHT_GREEN : COLOR.SALMON;
      if (existingValue.includes("Error")) {
        allPreviousCompleted = false;
      }
    }

    // Check if it's the final step
    if (stepName === "Update Complete" && allPreviousCompleted) {
      statusMessage = `${stepName}: Done`;
      backgroundColor = COLOR.LIGHT_GREEN;// Light green for completed steps
      fontColor = COLOR.BLACK;
    }

    cellRange.setValue(statusMessage);
    cellRange.setBackground(backgroundColor).setFontColor(fontColor).setFontSize(12);
    if (statusMessage.includes("Done")) previousStepDone = true;
  });
}

function clearProgressSheet() {
  // Get the sheet named "Progress"
  var sheet = SpreadsheetApp.getActive().getSheetByName("Progress");
  var range = sheet.getRange(1, 1, sheet.getMaxRows(), 4);

  // Clear the content of the specified range
  range.clear();
}
function logError(err){
  var sheet = SpreadsheetApp.getActive().getSheetByName("Progress");
  const summaryRange = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 8);
  summaryRange.setValue(`The following error occured `+ err).setFontWeight("bold").setFontSize(14).setFontColor(COLOR.RED).mergeAcross();
}

function appendErrorRow(errorsSheet, row, backgroundColor) {
  errorsSheet.appendRow(row);
  errorsSheet.getRange(errorsSheet.getLastRow(), 1, 1, row.length).setBackground(backgroundColor).setFontWeight("bold");
}