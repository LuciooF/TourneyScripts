/**
 * Gets a folder by name. If a parent folder is provided, it searches within that folder.
 * @param {string} folderName - The name of the folder.
 * @param {Object} parentFolder - The parent folder to search within.
 * @returns {Object} The folder.
 * @throws {Error} If no folder is found with the given name.
 */
function getFolder(folderName, parentFolder = null) {
  let folders;
  
  if (parentFolder) {
    folders = parentFolder.getFoldersByName(folderName);
  } else {
    folders = DriveApp.getFoldersByName(folderName);
  }

  if (folders.hasNext()) {
    return folders.next();
  } else {
    throw new Error(`Folder "${folderName}" not found.`);
  }
}
/**
 * Creates a club spreadsheet by duplicating a template spreadsheet and adding it to a specific folder.
 * @param {string} clubName - The name of the club.
 * @returns {Object} The new spreadsheet.
 * @throws {Error} If an error occurs while creating the spreadsheet.
 */
function createClubSpreadsheet(clubName) {
  try {
    const folder = FOLDERS.INFO_PACKS;
    const templateSpreadsheet = SPREADSHEETS.INFO_PACK_TEMPLATE;
    const newSpreadsheet = duplicateTemplateSpreadsheet(templateSpreadsheet, clubName);
    const file = DriveApp.getFileById(newSpreadsheet.getId());
    folder.addFile(file);

    DriveApp.getRootFolder().removeFile(file);

    return newSpreadsheet;
  } catch (error) {
    console.error("Error in createClubSpreadsheet: " + error);
    throw error;
  }
}
/**
 * Gets or creates a spreadsheet by name in a given folder.
 * @param {string} spreadsheetName - The name of the spreadsheet.
 * @param {Object} folder - The folder to search within or add to.
 * @returns {Object} The spreadsheet.
 */
function getOrCreateSpreadsheet(spreadsheetName, folder) {
  const existingFiles = folder.getFilesByName(spreadsheetName);
  
  if (existingFiles.hasNext()) {
    return SpreadsheetApp.open(existingFiles.next());
  } else {
    const newSpreadsheet = SpreadsheetApp.create(spreadsheetName);
    const file = DriveApp.getFileById(newSpreadsheet.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file); 
    return newSpreadsheet;
  }
}
/**
 * Duplicates a template spreadsheet and renames it.
 * @param {Object} templateSpreadsheet - The template spreadsheet to duplicate.
 * @param {string} clubName - The name to give to the new spreadsheet.
 * @returns {Object} The new spreadsheet.
 * @throws {Error} If an error occurs while duplicating the spreadsheet.
 */
function duplicateTemplateSpreadsheet(templateSpreadsheet, clubName) {
  try {
    const templateFile = DriveApp.getFileById(templateSpreadsheet.getId());
    const newFile = templateFile.makeCopy(clubName);
    const newSpreadsheet = SpreadsheetApp.openById(newFile.getId());

    return newSpreadsheet;
  } catch (error) {
    console.error("Error in duplicateTemplateSpreadsheet: " + error);
    throw error;
  }
}
/**
 * Deletes all sheets in a given folder.
 * @param {Object} folder - The folder to delete sheets from.
 */
function deleteAllSheetsInFolder(folder) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
      file.setTrashed(true);
  }
}
/**
 * Gets a sheet by name in a given spreadsheet.
 * @param {Object} spreadSheet - The spreadsheet to search within.
 * @param {string} sheetName - The name of the sheet.
 * @returns {Object} The sheet.
 * @throws {Error} If no sheet is found with the given name.
 */
function getSheet(spreadSheet, sheetName) {
  const sheet = spreadSheet.getSheetByName(sheetName);
  
  if (sheet) {
    console.log("Sheet found: " + sheetName)
    return sheet;
  } else {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }
}


