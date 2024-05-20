/**
 * Main function that orchestrates the entire process.
 * Fetches data from the CSV and Declaration sheets, processes the data,
 * writes the processed data to the Master sheet, logs any errors, and updates the Club sheets.
 * @function doEverythingButton
 */
async function doEverythingButton() {
    try {
        clearProgressSheet();

        setTaskToProcessing(STATUS_MESSAGES.STARTING_UPDATE);
        setLastTaskToDone();
        const [csvData, declarationData, foodFormData] = fetchAllData();
        const [dataToWrite, errorRows] = processCsvAndDeclarationData(csvData, declarationData);
        populatePlayerSheet(dataToWrite);
        logUnfilledDeclarationsInSheet(errorRows);
        highlightIncorrectOrderNumber(csvData, declarationData);
        await createClubSpreadsheets();
        populateFoodOrderComplete(foodFormData)
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
        setTaskToProcessing(STATUS_MESSAGES.STARTING_UPDATE);
        setLastTaskToDone();

        const [csvData, declarationData, x] = fetchAllData();

        const [dataToWrite, _] = processCsvAndDeclarationData(csvData, declarationData);

        populatePlayerSheet(dataToWrite);

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
        setTaskToProcessing(STATUS_MESSAGES.STARTING_UPDATE);
        setLastTaskToDone();

        const [csvData, declarationData, x] = fetchAllData();

        const [_, errorRows] = processCsvAndDeclarationData(csvData, declarationData);
        logUnfilledDeclarationsInSheet(errorRows);
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
        setTaskToProcessing(STATUS_MESSAGES.STARTING_UPDATE);
        setLastTaskToDone();

        const [csvData, declarationData, _] = fetchAllData();
        highlightIncorrectOrderNumber(csvData, declarationData);
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
async function createClubSpreadsheetsButton() {
    try {
        clearProgressSheet();
        setTaskToProcessing(STATUS_MESSAGES.STARTING_UPDATE);
        setLastTaskToDone();

        await createClubSpreadsheets()
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
        setTaskToProcessing(STATUS_MESSAGES.STARTING_UPDATE);
        setLastTaskToDone();

        const [_, _1, foodFormData] = fetchAllData();
        populateFoodOrderComplete(foodFormData);
        addSuccessfullRunStatus();
    }
    catch (err) {
        console.log("Error", err);
        logError(err);
    }
}
