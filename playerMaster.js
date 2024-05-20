/**
 * Fetches data from CSV, declaration, and food form sheets.
 * @function fetchAllData
 * @returns {Array} An array containing the CSV data, the declaration data, and the food form data.
 */
function fetchAllData() {
  const csvSheet = SHEETS.SQUARE_CSV;
  const declarationSheet = SHEETS.DECLARATION_FORM;
  const foodFormSheet = SHEETS.FOOD_FORM;
  const csvData = SHEETS.SQUARE_CSV.getRange(2, 1, csvSheet.getLastRow() - 1, csvSheet.getLastColumn()).getValues();
  const declarationData = SHEETS.DECLARATION_FORM.getRange(2, 1, declarationSheet.getLastRow() - 1, 5).getValues();
  const foodData = SHEETS.FOOD_FORM.getRange(2, 1, foodFormSheet.getLastRow() - 1, 11).getValues();
  
  return [csvData, declarationData, foodData];
}
/**
 * Processes data from CSV and declaration sheets.
 * @function processCsvAndDeclarationData
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
 * @function createDeclarationMap
 * @param {Array} declarationData - The declaration data.
 * @returns {Map} The declaration map.
 */
function createDeclarationMap(declarationData) {
  return new Map(declarationData.map(row => [normalizeOrderNumber(row[1]), row]));
}
/**
 * Generates a data row from CSV data using a declaration map.
 * @function createRowFromCsvData
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
 * Constructs a row for the master sheet from CSV and declaration data.
 * @function constructRowFromData
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
 * Writes data rows to the master sheet with alternating colors.
 * @function populatePlayerSheet
 * @param {Array} dataToWrite - The data to write.
 */
function populatePlayerSheet(dataToWrite) {
  const playerSheet= SHEETS.PLAYER_MASTER;
  dataToWrite.sort((a, b) => a[7].localeCompare(b[7]));
  playerSheet.clear();
  writeDataToSheet(playerSheet, dataToWrite, HEADERS.MASTER_SHEET);
  applyAlternatingRowStyles(playerSheet);
}

/**
 * Logs errors in a designated 'Errors' sheet.
 * @function logUnfilledDeclarationsInSheet
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
 * @function highlightIncorrectOrderNumber
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