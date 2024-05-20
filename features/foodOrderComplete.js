/**
 * Populates the "Food Order Complete" sheet with given data.
 * Writes data to the sheet, applies alternating row styles, and appends total count to a specific cell.
 *
 * @param {Array} foodFormData - The data to be added to the sheet. It's an array of arrays, where each sub-array represents a row of data.
 */
function populateFoodOrderComplete(foodFormData) {
    setTaskToProcessing(STATUS_MESSAGES.POPULATING_FOOD_ORDER_COMPLETE_SHEET, getActualSheetUrl(SHEETS.FOOD_ORDER_COMPLETE));
    writeDataToSheet(SHEETS.FOOD_ORDER_COMPLETE, foodFormData, HEADERS.FOOD_ORDER_COMPLETE);
    applyAlternatingRowStyles(SHEETS.FOOD_ORDER_COMPLETE);
    appendValueToCell(SHEETS.FOOD_ORDER_COMPLETE, "Total Count" + foodFormData.length, "P1", 16, true);
    setLastTaskToDone();
}