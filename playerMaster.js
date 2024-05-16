function doEverything() {
    clearProgressSheet();
    updateStatus("Starting Update", "Initializing the update process...");
    const csvSheet = SHEETS.SQUARE_CSV;
    const masterSheet = SHEETS.PLAYER_MASTER;
    const declarationSheet = SHEETS.DECLARATION_FORM;
  try{
    updateStatus("Fetching Data", "Retrieving data from CSV and Declaration sheets...");
    const headers = prepareMasterSheet(masterSheet);
    const [csvData, declarationData] = fetchCsvAndDeclarationData(csvSheet, declarationSheet);
  
    updateStatus("Processing Data", "Analyzing and processing data...");
    const [dataToWrite, errorRows] = processCsvAndDeclarationData(csvData, declarationData);
  
    updateStatus("Writing to Master Sheet", "Populating the master sheet with processed data...");
    writeDataToMasterSheet(masterSheet, dataToWrite);
  
    updateStatus("Logging Errors", "Documenting errors encountered during processing...");
    logUnfilledDeclarationsInSheet(errorRows, headers);
    highlightMissingDeclarations(csvData, declarationData, headers);
  
    updateStatus("Creating/Updating Club Sheets", "Sheets being updated");
    updateClubSheets();
  
    updateStatus("Update Complete", "All tasks completed successfully at " + new Date());
  }
  catch(err){
    console.log("Error", err);
    logError(err);
  }
  }
  
  
  // Clears the master sheet and setups headers
  function prepareMasterSheet(masterSheet) {
    masterSheet.clear();
    const headers = HEADERS.MASTER_SHEET;
    masterSheet.appendRow(headers);
    return headers;
  }
  
  // Fetches data from CSV and declaration sheets
  function fetchCsvAndDeclarationData(csvSheet, declarationSheet) {
    const csvData = csvSheet.getRange(2, 1, csvSheet.getLastRow() - 1, csvSheet.getLastColumn()).getValues();
    const declarationData = declarationSheet.getRange(2, 1, declarationSheet.getLastRow() - 1, 5).getValues();
    return [csvData, declarationData];
  }
  
  // Processes data from CSV and declaration sheets
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
  
  // Creates a map from declaration data
  function createDeclarationMap(declarationData) {
    return new Map(declarationData.map(row => [normalizeOrderNumber(row[1]), row]));
  }
  
  // Generates a data row from CSV data using declaration map
  function createRowFromCsvData(row, declarationMap) {
    const orderNumber = normalizeOrderNumber(row[0]);
    const declarationRow = declarationMap.get(orderNumber);
    const newRow = constructRowFromData(row, declarationRow);
    return [!!declarationRow, newRow];
  }
  
  // Constructs a row for master sheet from CSV and declaration data
  function constructRowFromData(csvRow, declarationRow) {
    const [orderNumber, orderDate, recipientName, recipientEmail, recipientPhone, itemSKU, itemName, orderTotal, refundedAmount] = extractCsvValues(csvRow);
    const remainingAmount = orderTotal - refundedAmount;
    const club = declarationRow ? declarationRow[3] : "";
    
    return [
      orderNumber, orderDate, recipientName, recipientEmail, recipientPhone,
      itemSKU, itemName, club, orderTotal, refundedAmount, remainingAmount
    ];
  }
  
  // Write data rows to the Master sheet with alternating colors
  function writeDataToMasterSheet(masterSheet, dataToWrite) {
    dataToWrite.sort((a, b) => a[7].localeCompare(b[7]));
    dataToWrite.forEach((row, index) => {
      masterSheet.appendRow(row);
      formatRowBackground(masterSheet, row, index);
    });
  }
  
  // Logs errors in a designated 'Errors' sheet
  function logUnfilledDeclarationsInSheet(errorRows, headers) {
    const errorsSheet = SHEETS.ERRORS;
    var rowNumber = errorsSheet.appendRow(["Error: Unfilled Declarations"]).getLastRow();
  
    // Get the range of the last added row for the first 11 columns
    var cell = errorsSheet.getRange(rowNumber, 1, 1, 11);
  
    // Set the background color to purple and make the text bold for the first 11 columns
    cell.setBackground("#CBC3E3").setFontWeight("bold").setFontSize(14);
    errorRows.forEach(row => appendErrorRow(errorsSheet, row, "lightblue"));
  }
  
  // Highlights missing declarations in the 'Errors' sheet
  function highlightMissingDeclarations(csvData, declarationData, headers) {
    const errorsSheet = SHEETS.ERRORS;
    var rowNumber = errorsSheet.appendRow(["Error: Declarations without Corresponding CSV Entry"]).getLastRow();
  
    // Get the range of the last added row for the first 11 columns
    var cell = errorsSheet.getRange(rowNumber, 1, 1, 11);
  
    // Set the background color to red and make the text bold for the first 11 columns
    cell.setBackground("red").setFontWeight("bold").setFontSize(14);
  
    const csvOrderNumbers = csvData.map(row => normalizeOrderNumber(row[0]));
    declarationData.forEach(row => {
      const orderNumber = normalizeOrderNumber(row[1]);
      if (!csvOrderNumbers.includes(orderNumber)) {
        const rowData = [orderNumber, ...row.slice(0, 1), ...row.slice(2, 5)];
        appendErrorRow(errorsSheet, rowData, 'pink');
      }
    });
  }
 
  //makes one row grey after a white one
  function formatRowBackground(sheet, row, index) {
    const lastRow = sheet.getLastRow();
    const color = (index % 2 === 0) ? "#f0f0f0" : "#ffffff";
    sheet.getRange(lastRow, 1, 1, row.length).setBackground(color);
  }
  