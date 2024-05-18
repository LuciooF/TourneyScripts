/**
 * Creates and populates a Google Sheet with lions' feed data.
 * The sheet is cleared, headers are appended, and the data is sorted and appended.
 * Finally, a total count of the data rows is appended to a specific cell.
 *
 * @param {Array} lionsFeedData - The data to be added to the sheet. It's an array of arrays, where each sub-array represents a row of data.
 */
function createLionsFeedSheet(lionsFeedData) {
  const sheet = SHEETS.LIONS_FEED;
  lionsFeedData.sort((a, b) => a[1].localeCompare(b[1]));
  clearAndAppendHeaders(sheet, HEADERS.LIONS_FEED);
  writeDataToSheet(sheet, lionsFeedData);
  applyAlternatingRowStyles(sheet);
  const CELL_REFERENCE = "G1";
  const FONT_SIZE = 16;
  const IS_BOLD = true;
  const value = "Total Count: " + lionsFeedData.length;
  appendValueToCell(sheet, value, CELL_REFERENCE, FONT_SIZE, IS_BOLD);
}