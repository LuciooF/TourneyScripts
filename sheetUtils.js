function getOrCreateSheetByName(spreadsheet, sheetName, headers = null) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if(headers != null){
    sheet.appendRow(headers);
    }
  }
  else{
    sheet.clear();
    if(headers != null){
    sheet.appendRow(headers);
    }
  }
  return sheet;
}
// Helper function to append row and set styles
function appendRowWithStyles(sheet, row, index) {
  sheet.appendRow(row);
  let lastRow = sheet.getLastRow();
  let backgroundColor = (index % 2 === 0) ? "#f0f0f0" : "#ffffff";
  sheet.getRange(lastRow, 1, 1, row.length).setBackground(backgroundColor);
}


//This clears from row 6, can probably make it dynamic but cba
// function clearSheetContent(sheet) {
//   const startRow = 6;
//   const lastRow = sheet.getLastRow();
//   const lastCol = sheet.getLastColumn();

//   if (lastRow >= startRow) {
//     const range = sheet.getRange(startRow, 1, lastRow - startRow + 1, lastCol);
//     range.clearContent();  // Clear content only
//   } else {
//     console.warn('No content to clear.');
//   }
// }
// function clearSheetContent(sheet) {
//   var range = sheet.getRange(6, 1, sheet.getMaxRows() - 5, sheet.getMaxColumns());
//   var values = range.getValues();
  
//   for (var i = 0; i < values.length; i++) {
//     for (var j = 0; j < values[i].length; j++) {
//       if (typeof values[i][j] === 'string') {
//         values[i][j] = '';
//       }
//     }
//   }
  
//   range.setValues(values);
// }




// Appends a summary row to the given sheet
function appendSummaryRow(sheet, totalCount) {
  const summaryRange = sheet.getRange(sheet.getLastRow() + 1, 1, 1, 5);
  summaryRange.setValue(`Total Count: ${totalCount}`).setFontWeight("bold").setFontSize(14).mergeAcross();
}
 
  // Helper functions to normalize order numbers and format rows
function normalizeOrderNumber(orderNumber) {
  return String(orderNumber).replace(/^[^\d]+/, '');
}

  // Extracts necessary values from a CSV row based on specific indices
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
