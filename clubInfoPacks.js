/**
 * Appends data to the "Player Details" sheet within a given spreadsheet.
 * @param {Object} spreadsheet - The spreadsheet to append data to.
 * @param {Array} dataRows - The data to append.
 * @param {Array} headers - The headers for the data.
 */
function appendDataToPlayerDetailsSheet(spreadsheet, dataRows, headers) {
  const sheet = getSheetByName(spreadsheet, SHEET_NAMES.PLAYER_DETAILS);
  const startRow = 5;
  const startColumn = 2;
  if (Array.isArray(dataRows) && dataRows.length) {
    const range = sheet.getRange(startRow + 1, startColumn, dataRows.length, headers.length);
    range.setValues(dataRows);
  } else {
    console.error('Invalid data format:', dataRows);
  }
}
/**
 * Fetches data from player and food form sheets.
 * @returns {Object} An object containing arrays of player and food data.
 */
function fetchDataFromSheets() {
  const playerData = SHEETS.PLAYER_MASTER.getDataRange().getValues();
  const foodData = SHEETS.FOOD_FORM.getDataRange().getValues();
  return { playerData, foodData };
}

/**
 * Processes player and food data into structured club data and lions feed data.
 * @param {Array} playerData - The data about players.
 * @param {Array} foodData - The data about food.
 * @returns {Object} An object containing club data and lions feed data.
 */
function processClubData(playerData, foodData) {
  const foodMap = mapFoodData(foodData);
  const { clubData, lionsFeedData } = compileClubData(playerData, foodMap);
  return { clubData, lionsFeedData };
}
/**
 * Maps food form data into a Map object.
 * @param {Array} foodData - The data about food.
 * @returns {Map} A Map where each key-value pair represents a row of food data.
 */
function mapFoodData(foodData) {
  const foodMap = new Map();
  foodData.slice(1).forEach(row => foodMap.set(row[0], row.slice(2)));  // Skip header
  return foodMap;
}
/**
 * Compiles club data and lions feed data.
 * @param {Array} playerData - The data about players.
 * @param {Map} foodMap - A Map of food data.
 * @returns {Object} An object containing club data and lions feed data.
 */
function compileClubData(playerData, foodMap) {
  const clubData = {};
  const lionsFeedData = [];

  playerData.slice(1).forEach(row => {
    const club = row[7];
    if (!clubData[club]) clubData[club] = [];
    const foodRow = foodMap.get(row[0]) || ["TODO", "TODO", "TODO"];
    const rowData = constructRowData(row, foodRow);
    clubData[club].push(rowData);
    lionsFeedData.push([row[2], club, foodRow[2] || "N/A"]);
  });

  return { clubData, lionsFeedData };
}

/**
 * Constructs a single row of club data.
 * @param {Array} playerRow - A row of player data.
 * @param {Array} foodRow - A row of food data.
 * @returns {Array} An array representing a row of club data.
 */
function constructRowData(playerRow, foodRow) {
  return [
    playerRow[0], playerRow[1], playerRow[2], playerRow[5],
    playerRow[8], playerRow[9], playerRow[10],
    foodRow ? "Y" : "N", foodRow[1] || "N", ...foodRow
  ];
}

/**
 * Updates all club sheets with the compiled data.
 * Fetches data from sheets, processes it, and appends it to the club sheets.
 * Also updates the Lions Feed sheet with the compiled data. (It made sense to do it here as we are reusing the data)
 */
function updateClubSheets() {
  const { playerData, foodData } = fetchDataFromSheets();
  const { clubData, lionsFeedData } = processClubData(playerData, foodData);

  createLionsFeedSheet(lionsFeedData);
  const infoPacksFolder = FOLDERS.INFO_PACKS;
  deleteAllSheetsInFolder(infoPacksFolder);
  Object.keys(clubData).forEach(clubName => {
    const spreadsheet = createClubSpreadsheet(clubName);
    const headers = HEADERS.PLAYER_INFORMATION;
    appendDataToPlayerDetailsSheet(spreadsheet, clubData[clubName], headers);
  });
}

