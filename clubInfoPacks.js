// Appends data to the "Player Details" sheet within another spreadsheet
function appendDataToPlayerDetailsSheet(spreadsheet, dataRows, headers) {
  const sheet = getOrCreateSheetByName(spreadsheet, SHEET_NAMES.PLAYER_DETAILS);
  clearSheetContent(sheet, 6);  // Clear existing content but keep formatting

  // Append headers at row 5, column B
  const startRow = 5;
  const startColumn = 2;  // Column B
  sheet.getRange(startRow, startColumn, 1, headers.length).setValues([headers]);

  if (Array.isArray(dataRows) && dataRows.length) {
    const range = sheet.getRange(startRow + 1, startColumn, dataRows.length, headers.length);
    range.setValues(dataRows);
  } else {
    console.error('Invalid data format:', dataRows);
  }
}
// Fetches data from player and food form sheets
function fetchDataFromSheets() {
  const playerData = SHEETS.PLAYER_MASTER.getDataRange().getValues();
  const foodData = SHEETS.FOOD_FORM.getDataRange().getValues();
  return { playerData, foodData };
}

// Processes data into structured club data and lions feed data
function processClubData(playerData, foodData) {
  const foodMap = mapFoodData(foodData);
  const { clubData, lionsFeedData } = compileClubData(playerData, foodMap);
  return { clubData, lionsFeedData };
}
// Maps food form data
function mapFoodData(foodData) {
  const foodMap = new Map();
  foodData.slice(1).forEach(row => foodMap.set(row[0], row.slice(2)));  // Skip header
  return foodMap;
}
//compiles club data and also lions feed data as it makes sense to do at same time for computational reasons
function compileClubData(playerData, foodMap) {
  const clubData = {};
  const lionsFeedData = [];

  playerData.slice(1).forEach(row => { // Skip header
    const club = row[7];
    if (!clubData[club]) clubData[club] = [];
    const foodRow = foodMap.get(row[0]) || ["TODO", "TODO", "TODO"];
    const rowData = constructRowData(row, foodRow);
    clubData[club].push(rowData);
    lionsFeedData.push([row[2], club, foodRow[2] || "N/A"]); // Name, Club, Dietary Requirements
  });

  return { clubData, lionsFeedData };
}


// Constructs a single row of club data
function constructRowData(playerRow, foodRow) {
  return [
    playerRow[0], playerRow[1], playerRow[2], playerRow[5],
    playerRow[8], playerRow[9], playerRow[10],
    foodRow ? "Y" : "N", foodRow[1] || "N", ...foodRow
  ];
}

// Updates all club sheets with the compiled data
function updateClubSheets() {
  const { playerData, foodData } = fetchDataFromSheets();
  const { clubData, lionsFeedData } = processClubData(playerData, foodData);

  createLionsFeedSheet(lionsFeedData);
  const infoPacksFolder = FOLDERS.INFO_PACKS;
  deleteAllSheetsInFolder(infoPacksFolder);
  Object.keys(clubData).forEach(clubName => {
    const spreadsheet = getOrCreateClubSpreadsheet(clubName);
    const headers = ["Order Number", "Order Date", "Name", "Ticket Name", "Paid", "Refunded", "Remaining", "Food Selected Y/N", "Lunch Y/N", "Food to be Paid", "Food Choices", "Dietary Requirements"];
    appendDataToPlayerDetailsSheet(spreadsheet, clubData[clubName], headers);
  });
}

