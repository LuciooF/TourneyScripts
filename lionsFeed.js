import * as Constants from './constants';
import * as SheetsUtil from './sheetUtils';
export function createLionsFeedSheet(lionsFeedData) {
  const sheet =  Constants.SHEETS.LIONS_FEED;
  sheet.clear();
  sheet.appendRow(Constants.HEADERS.LIONS_FEED);
  lionsFeedData.sort((a, b) => a[1].localeCompare(b[1]));
  lionsFeedData.forEach(row => sheet.appendRow(row));
  SheetsUtil.appendSummaryRow(sheet, lionsFeedData.length);
}