/**
 * Returns the name of a function.
 * @param {Function} func - The function to get the name of.
 * @returns {string} The name of the function.
 */
function getFunctionName(func) {
    return func.name || (func.toString().match(/function\s*([^(]*)\(/) || [])[1];
  }
  /**
 * Normalizes an order number by removing non-digit characters from the start.
 * @function normalizeOrderNumber
 * @param {string} orderNumber - The order number to normalize.
 * @returns {string} The normalized order number.
 */
function normalizeOrderNumber(orderNumber) {
    return String(orderNumber).replace(/^[^\d]+/, '');
  }