/**
 * Gets or creates a sheet by name in a given spreadsheet.
 * @function getOrCreateSheetByName
 * @param {Object} spreadsheet - The spreadsheet to search in.
 * @param {string} sheetName - The name of the sheet.
 * @param {Array} [headers=null] - The headers to append if a new sheet is created.
 * @returns {Object} The sheet.
 */
function getOrCreateSheetByName(spreadsheet, sheetName, headers = null) {
  if (!spreadsheet) throw new Error(`Invalid spreadsheet object when passing ${sheetName} and ${headers}`);
  let sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  sheet.clear();
  if (headers) sheet.appendRow(headers);
  return sheet;
}
/**
 * Gets a sheet by name in a given spreadsheet.
 * @function getSheetByName
 * @param {Object} spreadsheet - The spreadsheet to search in.
 * @param {string} sheetName - The name of the sheet.
 * @returns {Object} The sheet.
 * @throws {Error} If no sheet is found with the given name.
 */
function getSheetByName(spreadsheet, sheetName) {
  if (!spreadsheet) throw new Error(`Invalid spreadsheet object when passing ${sheetName}`);
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error(`No sheet found in ${spreadsheet.getName()} with the name ${sheetName}`);
  return sheet;
}
/**
 * Clears the content of a sheet starting from a specific row.
 * @function clearSheetContent
 * @param {Object} sheet - The sheet to clear.
 */
function clearSheetContent(sheet) {
  if (!sheet) throw new Error('Can\'t clear content of undefined sheet.'); 
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
 * @function appendValueToCell
 * @param {Object} sheet - The sheet to append to.
 * @param {*} value - The value to append.
 * @param {string} cell - The cell to append to.
 * @param {number} fontSize - The font size to set.
 * @param {boolean} isBold - Whether the font weight should be bold.
 */
function appendValueToCell(sheet, value, cell, fontSize, isBold) {
  if (!sheet) throw new Error('Can\'t append the following values to undefined sheet, cell: ' + cell + ', value: ' + value); 
  const cellRange = sheet.getRange(cell);
  cellRange.clearContent();
  cellRange.setValue(value);
  if (fontSize) cellRange.setFontSize(fontSize);   
  if (isBold) cellRange.setFontWeight(FONTS.BOLD);
}

/**
 * Extracts necessary values from a CSV row based on specific indices.
 * @function extractCsvValues
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
 * @function writeDataToSheet
 * @param {Object} sheet - The sheet object.
 * @param {Array} dataToWrite - The data to write.
 * @param {Array} [headers] - The headers for the data. If not provided, it assumes headers are already in the sheet.
 */
function writeDataToSheet(sheet, dataToWrite, headers) {
  if (!sheet) throw new Error('Can\'t write data following to undefined sheet, dataToWrite: ' + dataToWrite); 
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
  } else {
    throw new Error('Invalid data format');
  }
}
/**
 * Apply alternating row styles to all populated rows, ignoring the header row.
 * @function applyAlternatingRowStyles
 * @param {Object} sheet - The sheet object.
 */
function applyAlternatingRowStyles(sheet) {
  if (!sheet) throw new Error('Can\'t apply alternating row styles to undefined sheet.'); 
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  for (let row = 2; row <= lastRow; row++) {
    const color = (row - 2) % 2 === 0 ? COLOR.WHITE : COLOR.GREY;
    sheet.getRange(row, 1, 1, lastColumn).setBackground(color);
  }
}
/**
 * Append headers to the first row of a specified sheet with styling.
 * @function clearAndAppendHeaders
 * @param {Object} sheet - The sheet object.
 * @param {Array} headers - The headers to append.
 */
function clearAndAppendHeaders(sheet, headers) {
  if (!sheet) throw new Error('Can\'t append headers to undefined sheet.'); 
  sheet.clear();
  sheet.appendRow(headers);

  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight(FONTS.BOLD)
    .setBackground(COLOR.LIGHT_GREEN)
    .setFontColor(COLOR.WHITE);
}
function getActualSheetUrl(sheet){
  return `${sheet.getParent().getUrl()}#gid=${sheet.getSheetId()}`;
}