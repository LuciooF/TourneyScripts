/**
 * Main function that orchestrates the entire process.
 * Pretty much does everything in the prefered order.
 * Fetches data from the CSV and Declaration sheets, processes the data, writes the processed data to the Master sheet, logs any errors, and updates the Club sheets.
 */
function doEverythingButton() {
    try {
        const csvSheet = SHEETS.SQUARE_CSV;
        const playerSheet = SHEETS.PLAYER_MASTER;
        const declarationSheet = SHEETS.DECLARATION_FORM;
        clearProgressSheet();
        updateStatus("Starting Update", "Initializing the update process...");
        const [csvData, declarationData] = fetchCsvAndDeclarationData(csvSheet, declarationSheet);
        updateStatus("Fetching Data", "Retrieving data from Square CSV and Declaraion Form");

        const [dataToWrite, errorRows] = processCsvAndDeclarationData(csvData, declarationData);
        updateStatus("Processing Data", "Formatting data for future use");

        populatePlayerSheet(playerSheet, dataToWrite);
        updateStatus("Populating Player sheet", "Populating the player sheet with processed data...");

        logUnfilledDeclarationsInSheet(errorRows);
        updateStatus("Populating Missing Declarations Sheet", "Adding people who have an order but no declaration to the sheet...");
        highlightIncorrectOrderNumber(csvData, declarationData);
        updateStatus("Populating Incorrect Order Number sheet", "Adding people who have a declaration with a order number we dont recognise");

        createClubSpreadsheets();
        updateStatus("Creating/Updating Club Sheets", "Sheets being updated");

        updateStatus("Update Complete", "All tasks completed successfully at " + new Date().toLocaleString('en-US', { hour12: false }));
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
function populatePlayerSheetButton() {
    try {
        const csvSheet = SHEETS.SQUARE_CSV;
        const playerSheet = SHEETS.PLAYER_MASTER;
        const declarationSheet = SHEETS.DECLARATION_FORM;
        clearProgressSheet();
        updateStatus("Starting Update", "Initializing the update process...");
        const [csvData, declarationData] = fetchCsvAndDeclarationData(csvSheet, declarationSheet);
        updateStatus("Fetching Data", "Retrieving data from Square CSV and Declaraion Form");

        const [dataToWrite, _] = processCsvAndDeclarationData(csvData, declarationData);
        updateStatus("Processing Data", "Formatting data for future use");

        populatePlayerSheet(playerSheet, dataToWrite);
        updateStatus("Populating Player sheet", "Populating the player sheet with processed data...");
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
function populateUnfilledDeclarationsInSheetButton() {
    try {
        const csvSheet = SHEETS.SQUARE_CSV;
        const declarationSheet = SHEETS.DECLARATION_FORM;
        clearProgressSheet();
        updateStatus("Starting Update", "Initializing the update process...");
        const [csvData, declarationData] = fetchCsvAndDeclarationData(csvSheet, declarationSheet);
        updateStatus("Fetching Data", "Retrieving data from Square CSV and Declaraion Form");

        const [_, errorRows] = processCsvAndDeclarationData(csvData, declarationData);
        updateStatus("Processing Data", "Formatting data for future use");

        logUnfilledDeclarationsInSheet(errorRows);
        updateStatus("Populating Missing Declarations Sheet", "Adding people who have an order but no declaration to the sheet...");
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
function populateIncorrectOrderNumberSheetButton() {
    try {
        const csvSheet = SHEETS.SQUARE_CSV;
        const declarationSheet = SHEETS.DECLARATION_FORM;
        clearProgressSheet();
        updateStatus("Starting Update", "Initializing the update process...");
        const [csvData, declarationData] = fetchCsvAndDeclarationData(csvSheet, declarationSheet);
        updateStatus("Fetching Data", "Retrieving data from Square CSV and Declaraion Form");

        highlightIncorrectOrderNumber(csvData, declarationData);
        updateStatus("Populating Incorrect Order Number sheet", "Adding people who have a declaration with a order number we dont recognise");
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
function createClubSpreadsheetsButton() {
    try {
        clearProgressSheet();
        updateStatus("Starting Update", "Initializing the update process...");
        createClubSpreadsheets();
        updateStatus("Creating/Updating Club Sheets", "Sheets being updated");
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
