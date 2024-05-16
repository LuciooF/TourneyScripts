function createLionsFeedSheet(lionsFeedData) {
  const sheet =  SHEETS.LIONS_FEED;
  sheet.clear();
  sheet.appendRow(HEADERS.LIONS_FEED);
  lionsFeedData.sort((a, b) => a[1].localeCompare(b[1]));
  lionsFeedData.forEach(row => sheet.appendRow(row));
  appendSummaryRow(sheet, lionsFeedData.length);
}