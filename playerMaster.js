/**
 * Main function that orchestrates the entire process.
 * Pretty much does everything in the prefered order.
 * Fetches data from the CSV and Declaration sheets, processes the data, writes the processed data to the Master sheet, logs any errors, and updates the Club sheets.
 */
function doEverything() {
  try {
    updateStatus("Starting Update", "Initializing the update process...");
    const csvSheet = SHEETS.SQUARE_CSV;
    const masterSheet = SHEETS.PLAYER_MASTER;
    const declarationSheet = SHEETS.DECLARATION_FORM;
    
    updateStatus("Fetching Data", "Retrieving data from CSV and Declaration sheets...");
    const [csvData, declarationData] = fetchCsvAndDeclarationData(csvSheet, declarationSheet);

    updateStatus("Processing Data", "Analyzing and processing data...");
    const [dataToWrite, errorRows] = processCsvAndDeclarationData(csvData, declarationData);

    updateStatus("Writing to Master Sheet", "Populating the master sheet with processed data...");
    writeDataToMasterSheet(masterSheet, dataToWrite);

    updateStatus("Logging Errors", "Documenting errors encountered during processing...");
    logUnfilledDeclarationsInSheet(errorRows);
    highlightIncorrectOrderNumber(csvData, declarationData);

    updateStatus("Creating/Updating Club Sheets", "Sheets being updated");
    updateClubSheets();

    updateStatus("Update Complete", "All tasks completed successfully at " + new Date());
  }
  catch (err) {
    console.log("Error", err);
    logError(err);
  }
}
/**
 * Fetches data from CSV and declaration sheets.
 * @param {Object} csvSheet - The CSV sheet object.
 * @param {Object} declarationSheet - The declaration sheet object.
 * @returns {Array} An array containing the CSV data and the declaration data.
 */
function fetchCsvAndDeclarationData(csvSheet, declarationSheet) {
  const csvData = csvSheet.getRange(2, 1, csvSheet.getLastRow() - 1, csvSheet.getLastColumn()).getValues();
  const declarationData = declarationSheet.getRange(2, 1, declarationSheet.getLastRow() - 1, 5).getValues();
  return [csvData, declarationData];
}
/**
 * Processes data from CSV and declaration sheets.
 * @param {Array} csvData - The CSV data.
 * @param {Array} declarationData - The declaration data.
 * @returns {Array} An array containing the data to write and the error rows.
 */
function processCsvAndDeclarationData(csvData, declarationData) {
  const declarationMap = createDeclarationMap(declarationData);
  let dataToWrite = [];
  let errorRows = [];

  csvData.forEach(row => {
    const [isValid, newRow] = createRowFromCsvData(row, declarationMap);
    isValid ? dataToWrite.push(newRow) : errorRows.push(newRow);
  });

  return [dataToWrite, errorRows];
}
/**
 * Creates a map from declaration data.
 * @param {Array} declarationData - The declaration data.
 * @returns {Map} The declaration map.
 */
function createDeclarationMap(declarationData) {
  return new Map(declarationData.map(row => [normalizeOrderNumber(row[1]), row]));
}
/**
 * Generates a data row from CSV data using declaration map.
 * @param {Array} row - The CSV row.
 * @param {Map} declarationMap - The declaration map.
 * @returns {Array} An array containing a boolean indicating if the row is valid and the new row.
 */
function createRowFromCsvData(row, declarationMap) {
  const orderNumber = normalizeOrderNumber(row[0]);
  const declarationRow = declarationMap.get(orderNumber);
  const newRow = constructRowFromData(row, declarationRow);
  return [!!declarationRow, newRow];
}
/**
 * Constructs a row for master sheet from CSV and declaration data.
 * @param {Array} csvRow - The CSV row.
 * @param {Array} declarationRow - The declaration row.
 * @returns {Array} The constructed row.
 */
function constructRowFromData(csvRow, declarationRow) {
  const [orderNumber, orderDate, recipientName, recipientEmail, recipientPhone, itemSKU, itemName, orderTotal, refundedAmount] = extractCsvValues(csvRow);
  const remainingAmount = orderTotal - refundedAmount;
  const club = declarationRow ? declarationRow[3] : "";

  return [
    orderNumber, orderDate, recipientName, recipientEmail, recipientPhone,
    itemSKU, itemName, club, orderTotal, refundedAmount, remainingAmount
  ];
}
/**
 * Write data rows to the Master sheet with alternating colors.
 * @param {Object} masterSheet - The master sheet object.
 * @param {Array} dataToWrite - The data to write.
 */
function writeDataToMasterSheet(masterSheet, dataToWrite) {
  dataToWrite.sort((a, b) => a[7].localeCompare(b[7]));
  masterSheet.clear();
  writeDataToSheet(masterSheet, dataToWrite, HEADERS.MASTER_SHEET);
  applyAlternatingRowStyles(masterSheet);
}

/**
 * Logs errors in a designated 'Errors' sheet.
 * @param {Array} errorRows - The error rows.
 */
function logUnfilledDeclarationsInSheet(errorRows) {
  const missingDeclarationsSheet = SHEETS.MISSING_DECLARATIONS;
  var rowNumber = missingDeclarationsSheet.appendRow(["Error: Unfilled Declarations"]).getLastRow();

  var cell = missingDeclarationsSheet.getRange(rowNumber, 1, 1, 11);

  cell.setBackground(COLOR.LAVENDER).setFontWeight("bold").setFontSize(14);
  writeDataToSheet(missingDeclarationsSheet, errorRows, HEADERS.ERRORS);
}
/**
 * Highlights missing declarations in the 'Errors' sheet.
 * @param {Array} csvData - The CSV data.
 * @param {Array} declarationData - The declaration data.
 */
function highlightIncorrectOrderNumber(csvData, declarationData) {
  const sheet = SHEETS.INCORRECT_ORDER_NUMBER;
  const errorHeader = ["Error: Declarations without Corresponding CSV Entry"];

  const csvOrderNumbers = csvData.map(row => normalizeOrderNumber(row[0]));
  const errorRows = declarationData
    .filter(row => !csvOrderNumbers.includes(normalizeOrderNumber(row[1])))
    .map(row => [normalizeOrderNumber(row[1]), ...row.slice(0, 1), ...row.slice(2, 5)]);

  if (errorRows.length > 0) {
    writeDataToSheet(sheet, errorRows, errorHeader);
  }
  applyAlternatingRowStyles(sheet);
}