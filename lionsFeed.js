function createLionsFeedSheet(lionsFeedData) {
  const ss = SPREADSHEETS.LIONS_FEED;
  const sheet = ss.getSheetByName("Lions Feed") || ss.insertSheet("Lions Feed");
  sheet.clear();
  sheet.appendRow(["Name", "Club", "Food Choices", "Dietary Requirements"]);
  lionsFeedData.sort((a, b) => a[1].localeCompare(b[1]));
  lionsFeedData.forEach(row => sheet.appendRow(row));
  appendSummaryRow(sheet, lionsFeedData.length);
}