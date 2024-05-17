import * as gDriveHelper from './gDriveHelper';
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
    PLAYER_MASTER: "Player Master",
    SQUARE_CSV: "Square CSV",
    DECLARATION_FORM: "Declaration Form",
    FOOD_FORM: "Food Form",
    PROGRESS: "Progress",
    ERRORS: "Errors",
    PLAYER_DETAILS: "Player Details",
    LIONS_FEED:"Lions Feed"
});

let FOLDERS = {
    TOURNEY_ORGANIZATION: gDriveHelper.getFolder(FOLDER_NAMES.TOURNEY_ORGANIZATION),
};

FOLDERS = Object.freeze({
    ...FOLDERS,
    INFO_PACKS: gDriveHelper.getFolder(FOLDER_NAMES.INFO_PACKS, FOLDERS.TOURNEY_ORGANIZATION),
    MASTER: gDriveHelper.getFolder(FOLDER_NAMES.MASTER, FOLDERS.TOURNEY_ORGANIZATION),
    TEMPLATES: gDriveHelper.getFolder(FOLDER_NAMES.TEMPLATES, FOLDERS.TOURNEY_ORGANIZATION)
});

const SPREADSHEETS = Object.freeze({
    LUCAS_PLAYGROUND: gDriveHelper.getOrCreateSpreadsheet(SPREADSHEET_NAMES.LUCAS_PLAYGROUND, FOLDERS.MASTER),
    INFO_PACK_TEMPLATE: gDriveHelper.getOrCreateSpreadsheet(SPREADSHEET_NAMES.INFO_PACKS_TEMPLATE, FOLDERS.TEMPLATES),
    LIONS_FEED: gDriveHelper.getOrCreateSpreadsheet(SPREADSHEET_NAMES.LIONS_FEED, FOLDERS.TOURNEY_ORGANIZATION),
    TEMPLATE: gDriveHelper.getOrCreateSpreadsheet(SPREADSHEET_NAMES.TEMPLATE, FOLDERS.TEMPLATES)
});

export const SHEETS = Object.freeze({
    PLAYER_MASTER: gDriveHelper.getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.PLAYER_MASTER),
    PROGRESS: gDriveHelper.getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.PROGRESS),
    ERRORS: gDriveHelper.getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.ERRORS),
    FOOD_FORM: gDriveHelper.getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.FOOD_FORM),
    DECLARATION_FORM: gDriveHelper.getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.DECLARATION_FORM),
    SQUARE_CSV: gDriveHelper.getSheet(SPREADSHEETS.LUCAS_PLAYGROUND, SHEET_NAMES.SQUARE_CSV),
    LIONS_FEED: gDriveHelper.getSheet(SPREADSHEETS.LIONS_FEED, SHEET_NAMES.LIONS_FEED)
});

export const HEADERS = Object.freeze({
    MASTER_SHEET: [
        "Order Number", "Order Date", "Name", "Email", "Phone Number",
        "SKU", "Ticket Name", "Club", "Paid", "Refunded", "Remaining (Calc)"
    ],
    LIONS_FEED: ["Name", "Club", "Food Choices", "Dietary Requirements"]
});