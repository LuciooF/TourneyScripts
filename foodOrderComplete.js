function populateFoodOrderComplete(foodFormData) {
    writeDataToSheet(SHEETS.FOOD_ORDER_COMPLETE, foodFormData, HEADERS.FOOD_ORDER_COMPLETE);
    applyAlternatingRowStyles(SHEETS.FOOD_ORDER_COMPLETE);
    appendValueToCell(SHEETS.FOOD_ORDER_COMPLETE, "Total Count" + foodFormData.length, "P1", 16, true);
}