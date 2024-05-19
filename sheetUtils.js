/**
 * Gets or creates a sheet by name in a given spreadsheet.
 * @param {Object} spreadsheet - The spreadsheet to search in.
 * @param {string} sheetName - The name of the sheet.
 * @param {Array} headers - The headers to append if a new sheet is created.
 * @returns {Object} The sheet.
 */
function getOrCreateSheetByName(spreadsheet, sheetName, headers = null) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (headers != null) {
      sheet.appendRow(headers);
    }
  }
  else {
    sheet.clear();
    if (headers != null) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}
/**
 * Gets a sheet by name in a given spreadsheet.
 * @param {Object} spreadsheet - The spreadsheet to search in.
 * @param {string} sheetName - The name of the sheet.
 * @returns {Object} The sheet.
 * @throws {Error} If no sheet is found with the given name.
 */
function getSheetByName(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw Error("No sheet found in spreadsheet " + spreadsheet.getName() + " with name " + sheetName);
  }
  return sheet;
}
/**
 * Clears the content of a sheet starting from a specific row.
 * @param {Object} sheet - The sheet to clear.
 */
function clearSheetContent(sheet) {
  const startRow = 6;
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow >= startRow) {
    const range = sheet.getRange(startRow, 1, lastRow - startRow + 1, lastCol);
    range.clearContent();
  } else {
    console.warn('No content to clear.');
  }
}
/**
 * Appends a value to a cell in a sheet and sets the font size and weight.
 * @param {Object} sheet - The sheet to append to.
 * @param {*} value - The value to append.
 * @param {string} cell - The cell to append to.
 * @param {number} fontSize - The font size to set.
 * @param {boolean} isBold - Whether the font weight should be bold.
 */
function appendValueToCell(sheet, value, cell, fontSize, isBold) {
  const cellRange = sheet.getRange(cell);
  cellRange.clearContent();
  cellRange.setValue(value);
  if (fontSize) {
    cellRange.setFontSize(fontSize);
  }
  if (isBold) {
    cellRange.setFontWeight("bold");
  } else {
    cellRange.setFontWeight("normal");
  }
}
/**
 * Normalizes an order number by removing non-digit characters from the start.
 * @param {string} orderNumber - The order number to normalize.
 * @returns {string} The normalized order number.
 */
function normalizeOrderNumber(orderNumber) {
  return String(orderNumber).replace(/^[^\d]+/, '');
}
/**
 * Extracts necessary values from a CSV row based on specific indices.
 * @param {Array} csvRow - The CSV row to extract values from.
 * @returns {Array} An array of extracted values.
 */
function extractCsvValues(csvRow) {
  return [
    String(csvRow[0]).replace(/^[^\d]+/, ''), // Order Number, normalized
    csvRow[1],                               // Order Date
    csvRow[14],                              // Recipient Name
    csvRow[15],                              // Recipient Email
    csvRow[16],                              // Recipient Phone
    csvRow[24],                              // Item SKU
    csvRow[25],                              // Item Name
    csvRow[6] ? parseFloat(csvRow[6]) : 0,                   // Order Total
    csvRow[7] ? parseFloat(csvRow[7]) : 0                    // Refunded Amount
  ];
}
/**
 * Write data rows to a specified sheet with alternating colors.
 * @param {Object} sheet - The sheet object.
 * @param {Array} dataToWrite - The data to write.
 * @param {Array} [headers] - The headers for the data. If not provided, it assumes headers are already in the sheet.
 */
function writeDataToSheet(sheet, dataToWrite, headers) {
  if (Array.isArray(dataToWrite) && dataToWrite.length) {
    let startRow = 2;

    if (headers) {
      clearAndAppendHeaders(sheet, headers);
    }

    const startColumn = 1;
    const numRows = dataToWrite.length;
    const numColumns = dataToWrite[0].length;

    const range = sheet.getRange(startRow, startColumn, numRows, numColumns);
    range.setValues(dataToWrite);
  }
  else {
    console.error('Invalid data format:', dataToWrite);
    throw Error('Invalid data format' + dataToWrite);
  }
}
/**
 * Apply alternating row styles to all populated rows, ignoring the header row.
 * @param {Object} sheet - The sheet object.
 */
function applyAlternatingRowStyles(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  for (let row = 2; row <= lastRow; row++) {
    const color = (row - 2) % 2 === 0 ? COLOR.WHITE : COLOR.GREY;
    sheet.getRange(row, 1, 1, lastColumn).setBackground(color);
  }
}
/**
 * Append headers to the first row of a specified sheet with styling.
 * @param {Object} sheet - The sheet object.
 * @param {Array} headers - The headers to append.
 */
function clearAndAppendHeaders(sheet, headers) {
  sheet.clear();
  sheet.appendRow(headers);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold")
    .setBackground(COLOR.LIGHT_GREEN)
    .setFontColor(COLOR.WHITE);
}