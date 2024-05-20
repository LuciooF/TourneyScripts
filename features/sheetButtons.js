/**
 * Main function that orchestrates the entire process.
 * Fetches data from the CSV and Declaration sheets, processes the data,
 * writes the processed data to the Master sheet, logs any errors, and updates the Club sheets.
 * @function doEverythingButton
 */
function doEverythingButton() {
    try {
        clearProgressSheet();
        updateStatus(STATUS_MESSAGES.STARTING_UPDATE);
        const [csvData, declarationData, foodFormData] = fetchAllData();
        updateStatus(STATUS_MESSAGES.FETCHING_DATA);

        const [dataToWrite, errorRows] = processCsvAndDeclarationData(csvData, declarationData);
        updateStatus(STATUS_MESSAGES.PROCESSING_DATA);

        populatePlayerSheet(dataToWrite);
        updateStatus(STATUS_MESSAGES.POPULATING_PLAYER_SHEET);

        logUnfilledDeclarationsInSheet(errorRows);
        updateStatus(STATUS_MESSAGES.POPULATING_MISSING_DECLARATIONS_SHEET);
        highlightIncorrectOrderNumber(csvData, declarationData);
        updateStatus(STATUS_MESSAGES.POPULATING_INCORRECT_ORDER_NUMBER_SHEET);

        createClubSpreadsheets();
        updateStatus(STATUS_MESSAGES.CREATING_UPDATING_CLUB_SHEETS);

        populateFoodOrderComplete(foodFormData)
        updateStatus(STATUS_MESSAGES.POPULATING_FOOD_ORDER_COMPLETE_SHEET);

        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
/**
 * Populates the Player sheet with processed data from CSV and Declaration sheets.
 * @function populatePlayerSheetButton
 */
function populatePlayerSheetButton() {
    try {
        clearProgressSheet();
        updateStatus(STATUS_MESSAGES.STARTING_UPDATE);
        const [csvData, declarationData, x] = fetchAllData();
        updateStatus(STATUS_MESSAGES.FETCHING_DATA);

        const [dataToWrite, _] = processCsvAndDeclarationData(csvData, declarationData);
        updateStatus(STATUS_MESSAGES.PROCESSING_DATA);

        populatePlayerSheet(dataToWrite);
        updateStatus(STATUS_MESSAGES.POPULATING_PLAYER_SHEET);
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
/**
 * Logs unfilled declarations in a designated sheet.
 * @function populateUnfilledDeclarationsInSheetButton
 */
function populateUnfilledDeclarationsInSheetButton() {
    try {
        clearProgressSheet();
        updateStatus(STATUS_MESSAGES.STARTING_UPDATE);
        const [csvData, declarationData, x] = fetchAllData();
        updateStatus(STATUS_MESSAGES.FETCHING_DATA);

        const [_, errorRows] = processCsvAndDeclarationData(csvData, declarationData);
        updateStatus(STATUS_MESSAGES.PROCESSING_DATA);

        logUnfilledDeclarationsInSheet(errorRows);
        updateStatus(STATUS_MESSAGES.POPULATING_MISSING_DECLARATIONS_SHEET);
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
/**
 * Highlights missing declarations in the 'Errors' sheet.
 * @function populateIncorrectOrderNumberSheetButton
 */
function populateIncorrectOrderNumberSheetButton() {
    try {
        clearProgressSheet();
        updateStatus(STATUS_MESSAGES.STARTING_UPDATE);
        const [csvData, declarationData, _] = fetchAllData();
        updateStatus(STATUS_MESSAGES.FETCHING_DATA);

        highlightIncorrectOrderNumber(csvData, declarationData);
        updateStatus(STATUS_MESSAGES.POPULATING_INCORRECT_ORDER_NUMBER_SHEET);
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
/**
 * Creates or updates Club spreadsheets.
 * @function createClubSpreadsheetsButton
 */
function createClubSpreadsheetsButton() {
    try {
        clearProgressSheet();
        updateStatus(STATUS_MESSAGES.STARTING_UPDATE);
        createClubSpreadsheets();
        updateStatus(STATUS_MESSAGES.CREATING_UPDATING_CLUB_SHEETS);
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
/**
 * Populates the Food Order Complete sheet with data from the Food Form.
 * @function populateFoodOrderCompleteButton
 */
function populateFoodOrderCompleteButton() {
    try {
        clearProgressSheet();
        updateStatus(STATUS_MESSAGES.STARTING_UPDATE);
        const [_, _1, foodFormData] = fetchAllData();
        populateFoodOrderComplete(foodFormData)
        updateStatus(STATUS_MESSAGES.POPULATING_FOOD_ORDER_COMPLETE_SHEET);
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
