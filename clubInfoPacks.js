/**
 * Appends data to the "Player Details" sheet in a spreadsheet.
 * @param {Object} spreadsheet - Spreadsheet to append data to.
 * @param {Array} dataRows - Data to append.
 * @param {Array} headers - Headers for the data.
 */
async function appendDataToPlayerDetailsSheet(spreadsheet, dataRows, headers) {
  const sheet = getSheetByName(spreadsheet, SHEET_NAMES.PLAYER_DETAILS);
  const startRow = 5;
  const startColumn = 2;

  if (Array.isArray(dataRows) && dataRows.length) {
    const range = sheet.getRange(startRow + 1, startColumn, dataRows.length, headers.length);
    await range.setValues(dataRows);
  } else {
    console.error('Invalid data format:', dataRows);
  }
}

/**
 * Retrieves player and food data from sheets.
 * @returns {Object} Object with arrays of player and food data.
 */
function fetchDataFromSheets() {
  const playerData = SHEETS.PLAYER_MASTER.getDataRange().getValues();
  const foodData = SHEETS.FOOD_FORM.getDataRange().getValues();
  return { playerData, foodData };
}

/**
 * Transforms player and food data into club and lions feed data.
 * @param {Array} playerData - Player data.
 * @param {Array} foodData - Food data.
 * @returns {Object} Object with club data and lions feed data.
 */
function processClubData(playerData, foodData) {
  const foodMap = mapFoodData(foodData);
  const { clubData, lionsFeedData } = compileClubData(playerData, foodMap);
  return { clubData, lionsFeedData };
}
/**
 * Converts food data into a Map object.
 * @param {Array} foodData - Food data.
 * @returns {Map} Map with key-value pairs representing food data rows.
 */
function mapFoodData(foodData) {
  const foodMap = new Map();
  foodData.slice(1).forEach(row => foodMap.set(row[0], row.slice(2)));  // Skip header
  return foodMap;
}
/**
 * Assembles club and lions feed data.
 * @param {Array} playerData - Player data.
 * @param {Map} foodMap - Map of food data.
 * @returns {Object} Object with club data and lions feed data.
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
 * Creates a single row of club data.
 * @param {Array} playerRow - Player data row.
 * @param {Array} foodRow - Food data row.
 * @returns {Array} Array representing a row of club data.
 */
function constructRowData(playerRow, foodRow) {
  return [
    playerRow[0], playerRow[1], playerRow[2], playerRow[5],
    playerRow[8], playerRow[9], playerRow[10],
    foodRow ? "Y" : "N", foodRow[1] || "N", ...foodRow
  ];
}

/**
 * Updates club sheets with compiled data and updates the Lions Feed sheet.
 * Fetches, processes, and appends data to the club sheets.
 */
async function createClubSpreadsheets() {
  const { playerData, foodData } = await fetchDataFromSheets();
  const { clubData, lionsFeedData } = processClubData(playerData, foodData);

  // Create Lions Feed Sheet without awaiting its completion
  createLionsFeedSheet(lionsFeedData);
  await deleteAllSheetsInFolder(FOLDERS.INFO_PACKS);

  const clubRows = [];
  const spreadsheetPromises = [];

  Object.keys(clubData).forEach(clubName => {
    const createSpreadsheet = async () => {
      const spreadsheet = await createClubSpreadsheet(clubName);
      //might need to await this.
      appendDataToPlayerDetailsSheet(spreadsheet, clubData[clubName], HEADERS.PLAYER_INFORMATION);
      const playerCount = clubData[clubName].length;
      const clubLink = `=HYPERLINK("${spreadsheet.getUrl()}", "${clubName} Sheet")`;
      clubRows.push([clubName, playerCount, clubLink]);
    };

    spreadsheetPromises.push(createSpreadsheet());
  });

  await Promise.all(spreadsheetPromises);
  
  writeDataToSheet(SHEETS.CLUB, clubRows, HEADERS.CLUB);
  applyAlternatingRowStyles(SHEETS.CLUB);
}


