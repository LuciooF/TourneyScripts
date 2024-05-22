/**
 * Normalizes an order number by removing non-digit characters from the start.
 * @function normalizeOrderNumber
 * @param {string} orderNumber - The order number to normalize.
 * @returns {string} The normalized order number.
 */
function normalizeOrderNumber(orderNumber) {
    return String(orderNumber).replace(/^[^\d]+/, '');
  }