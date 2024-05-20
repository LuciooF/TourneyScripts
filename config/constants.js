
const SPREADSHEET_NAMES = Object.freeze({
    INFO_PACKS_TEMPLATE: "Info Pack",
    LIONS_FEED: "Lions Feed",
    LUCAS_PLAYGROUND: "Luca's playground", // change later
    TEMPLATE: "Template"
});

const FOLDER_NAMES = Object.freeze({
    TOURNEY_ORGANIZATION: 'Tourney 2024 Organisation',
    INFO_PACKS: 'Info Packs (Automatically Generated)',
    MASTER: 'Master',
    TEMPLATES: 'Templates'
});

const SHEET_NAMES = Object.freeze({
    PLAYER_MASTER: "Players",
    SQUARE_CSV: "Square CSV",
    DECLARATION_FORM: "Declaration Form",
    FOOD_FORM: "Food Form",
    PROGRESS: "Progress",
    MISSING_DECLARATIONS: "Missing Declarations",
    INCORRECT_ORDER_NUMBER: "Incorrect Order Number",
    DUPLICATE_NAME: "Duplicate Name",
    PLAYER_DETAILS: "Player Details",
    LIONS_FEED: "Lions Feed",
    CLUB: "Club",
    FOOD_ORDER_COMPLETE: "Food Order Complete"
});

//Need to do like this to avoid circular dependencies
let FOLDERS = {
    TOURNEY_ORGANIZATION: getFolder(FOLDER_NAMES.TOURNEY_ORGANIZATION),
};

FOLDERS = Object.freeze({
    ...FOLDERS,
    INFO_PACKS: getFolder(FOLDER_NAMES.INFO_PACKS, FOLDERS.TOURNEY_ORGANIZATION),
    MASTER: getFolder(FOLDER_NAMES.MASTER, FOLDERS.TOURNEY_ORGANIZATION),
    TEMPLATES: getFolder(FOLDER_NAMES.TEMPLATES, FOLDERS.TOURNEY_ORGANIZATION)
});

const SPREADSHEETS = Object.freeze({
    LUCAS_PLAYGROUND: getOrCreateSpreadsheet(SPREADSHEET_NAMES.LUCAS_PLAYGROUND, FOLDERS.MASTER),
    INFO_PACK_TEMPLATE: getOrCreateSpreadsheet(SPREADSHEET_NAMES.INFO_PACKS_TEMPLATE, FOLDERS.TEMPLATES),
    LIONS_FEED: getOrCreateSpreadsheet(SPREADSHEET_NAMES.LIONS_FEED, FOLDERS.TOURNEY_ORGANIZATION),
    TEMPLATE: getOrCreateSpreadsheet(SPREADSHEET_NAMES.TEMPLATE, FOLDERS.TEMPLATES)
});

const SHEETS = Object.freeze({
    PLAYER_MASTER: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.PLAYER_MASTER),
    PROGRESS: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.PROGRESS),
    MISSING_DECLARATIONS: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.MISSING_DECLARATIONS),
    INCORRECT_ORDER_NUMBER: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.INCORRECT_ORDER_NUMBER),
    DUPLICATE_NAME: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.DUPLICATE_NAME),
    FOOD_FORM: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.FOOD_FORM),
    DECLARATION_FORM: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.DECLARATION_FORM),
    SQUARE_CSV: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.SQUARE_CSV),
    LIONS_FEED: getSheet(SPREADSHEETS.LIONS_FEED, SHEET_NAMES.LIONS_FEED),
    CLUB: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.CLUB),
    FOOD_ORDER_COMPLETE: getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.FOOD_ORDER_COMPLETE)
});

const HEADERS = Object.freeze({
    MASTER_SHEET: [
        "Order Number", "Order Date", "Name", "Email", "Phone Number",
        "SKU", "Ticket Name", "Club", "Paid", "Refunded", "Remaining (Calc)"
    ],
    LIONS_FEED: ["Name", "Club", "Food Choices", "Dietary Requirements"],
    PLAYER_INFORMATION: ["Order Number", "Order Date", "Name", "Ticket Name", "Paid", "Refunded", "Remaining", "Food Selected Y/N", "Lunch Y/N", "Food to be Paid", "Food Choices", "Dietary Requirements"],
    ERRORS: ["Order Number", "Date", "Name", "Email", "Number", "Ticket", "?", "Paid", "Refunded", "Remaining"],
    CLUB: ['Club Name', 'Player Count', 'Club Link'],
    FOOD_ORDER_COMPLETE: ['Date', 'Order Number', 'Name', 'Meal Type 1', 'Chosen Meal 1', 'Meal Type 2', 'Chosen Meal 2', 'Meal Type 3', 'Chosen Meal 3','Meal Type 4', 'Chosen Meal 4', 'Meal Type 5', 'Chosen Meal 5','Questions']
});

const COLOR = Object.freeze({
    WHITE: "#ffffff",
    GREY: "#f0f0f0",
    BLUE_GREY: "#455a64",
    DARK_GREEN: "#388e3c",
    LIGHT_GREEN: "#c8e6c9",
    BLACK: '#000000',
    SALMON: 'ffab91',
    RED: '#ff0000',
    LAVENDER: '#CBC3E3'
});

const STATUS_MESSAGES = Object.freeze({
    STARTING_UPDATE: "Starting Update - Initializing the update process",
    FETCHING_DATA: "Fetching Data - Retrieving data from Square CSV and Declaration Form",
    PROCESSING_DATA: "Processing Data - Formatting data for future use",
    POPULATING_PLAYER_SHEET: "Populating Player sheet - Populating the player sheet with processed data...",
    POPULATING_MISSING_DECLARATIONS_SHEET: "Populating Missing Declarations Sheet - Adding people who have an order but no declaration to the sheet...",
    POPULATING_INCORRECT_ORDER_NUMBER_SHEET: "Populating Incorrect Order Number sheet - Adding people who have a declaration with a order number we don't recognise",
    CREATING_UPDATING_CLUB_SHEETS: "Creating/Updating Club Sheets - Sheets being updated",
    POPULATING_FOOD_ORDER_COMPLETE_SHEET: "Populating Food Order Complete sheet - Adding people who have completed their food declaration"
});