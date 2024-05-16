function createLionsFeedSheet(lionsFeedData) {
  const sheet =  SHEETS.LIONS_FEED;
  sheet.clear();
  sheet.appendRow(["Name", "Club", "Food Choices", "Dietary Requirements"]);
  lionsFeedData.sort((a, b) => a[1].localeCompare(b[1]));
  lionsFeedData.forEach(row => sheet.appendRow(row));
  appendSummaryRow(sheet, lionsFeedData.length);
}