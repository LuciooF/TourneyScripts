function createLionsFeedSheet(lionsFeedData) {
  const sheet = SHEETS.LIONS_FEED;
  sheet.clear();
  sheet.appendRow(HEADERS.LIONS_FEED);
  lionsFeedData.sort((a, b) => a[1].localeCompare(b[1]));
  lionsFeedData.forEach(row => sheet.appendRow(row));
  const CELL_REFERENCE = "G1";
  const FONT_SIZE = 16;
  const IS_BOLD = true;

  const value = "Total Count: " + lionsFeedData.length;
  appendValueToCell(sheet, value, CELL_REFERENCE, FONT_SIZE, IS_BOLD);
}