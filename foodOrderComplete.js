/**
 * Populates the "Food Order Complete" sheet with given data.
 * Writes data to the sheet, applies alternating row styles, and appends total count to a specific cell.
 *
 * @param {Array} foodFormData - The data to be added to the sheet. It's an array of arrays, where each sub-array represents a row of data.
 */
function populateFoodOrderComplete(foodFormData) {
    writeDataToSheet(SHEETS.FOOD_ORDER_COMPLETE, foodFormData, HEADERS.FOOD_ORDER_COMPLETE);
    applyAlternatingRowStyles(SHEETS.FOOD_ORDER_COMPLETE);
    appendValueToCell(SHEETS.FOOD_ORDER_COMPLETE, "Total Count" + foodFormData.length, "P1", 16, true);
}