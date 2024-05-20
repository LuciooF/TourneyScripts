/**
 * Gets a folder by name. If a parent folder is provided, it searches within that folder.
 * @param {string} folderName - The name of the folder to search for.
 * @param {Object} [parentFolder=null] - The parent folder to search within. If null, searches in the root directory.
 * @returns {Object} The folder object if found.
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
 * @returns {Object} The new spreadsheet object.
 * @throws {Error} If an error occurs while creating the spreadsheet.
 */
async function createClubSpreadsheet(clubName) {
  try {
    const folder = FOLDERS.INFO_PACKS;
    const templateSpreadsheet = SPREADSHEETS.INFO_PACK_TEMPLATE;
    const newSpreadsheet = await duplicateTemplateSpreadsheet(templateSpreadsheet, clubName);
    const file = DriveApp.getFileById(newSpreadsheet.getId());

    await folder.addFile(file);
    await DriveApp.getRootFolder().removeFile(file);

    return newSpreadsheet;
  } catch (error) {
    throw new Error("Error in createClubSpreadsheet: " + error);
  }
}

/**
 * Gets or creates a spreadsheet by name in a given folder.
 * @param {string} spreadsheetName - The name of the spreadsheet to get or create.
 * @param {Object} folder - The folder to search within or add the new spreadsheet to.
 * @returns {Object} The existing or newly created spreadsheet object.
 */
function getOrCreateSpreadsheet(spreadsheetName, folder) {
  try {
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
  } catch (error) {
    throw new Error("Error in getOrCreateSpreadsheet: " + error);
  }
}

/**
 * Duplicates a template spreadsheet and renames it.
 * @param {Object} templateSpreadsheet - The template spreadsheet to duplicate.
 * @param {string} clubName - The name to assign to the new spreadsheet.
 * @returns {Object} The new spreadsheet object.
 * @throws {Error} If an error occurs while duplicating the spreadsheet.
 */
function duplicateTemplateSpreadsheet(templateSpreadsheet, clubName) {
  try {
    const templateFile = DriveApp.getFileById(templateSpreadsheet.getId());
    const newFile = templateFile.makeCopy(clubName);
    const newSpreadsheet = SpreadsheetApp.openById(newFile.getId());

    return newSpreadsheet;
  } catch (error) {
    throw new Error("Error in duplicateTemplateSpreadsheet: " + error);
  }
}

/**
 * Deletes all sheets in a given folder.
 * @param {Object} folder - The folder to delete sheets from.
 */
async function deleteAllSheetsInFolder(folder) {
  if (!folder) throw new Error('Invalid folder object');
  
  try {
    const files = folder.getFiles();
    const deletePromises = [];

    while (files.hasNext()) {
      const file = files.next();
      deletePromises.push(file.setTrashed(true));
    }

    await Promise.all(deletePromises);
  } catch (error) {
    throw new Error("Error in deleteAllSheetsInFolder: " + error);
  }
}

/**
 * Gets a sheet by name in a given spreadsheet.
 * @param {Object} spreadSheet - The spreadsheet to search within.
 * @param {string} sheetName - The name of the sheet to get.
 * @returns {Object} The sheet object if found.
 * @throws {Error} If no sheet is found with the given name.
 */
function getSheet(spreadSheet, sheetName) {
  const sheet = spreadSheet.getSheetByName(sheetName);

  if (sheet) {
    console.log("Sheet found: " + sheetName);
    return sheet;
  } else {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }
}
