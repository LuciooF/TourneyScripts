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
    throw error; // Re-throw the error after logging it
  }
}

function getOrCreateSpreadsheet(spreadsheetName, folder) {
  const existingFiles = folder.getFilesByName(spreadsheetName);
  
  if (existingFiles.hasNext()) {
    return SpreadsheetApp.open(existingFiles.next());
  } else {
    const newSpreadsheet = SpreadsheetApp.create(spreadsheetName);
    const file = DriveApp.getFileById(newSpreadsheet.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);  // Remove from root folder
    return newSpreadsheet;
  }
}

// Duplicates the template spreadsheet and renames it
function duplicateTemplateSpreadsheet(templateSpreadsheet, clubName) {
  try {
    // Get the template file by ID
    const templateFile = DriveApp.getFileById(templateSpreadsheet.getId());

    // Make a copy of the template with the new name
    const newFile = templateFile.makeCopy(clubName);

    // Open the new file as a Spreadsheet
    const newSpreadsheet = SpreadsheetApp.openById(newFile.getId());

    return newSpreadsheet;
  } catch (error) {
    console.error("Error in duplicateTemplateSpreadsheet: " + error);
    throw error; // Re-throw the error after logging it
  }
}
function deleteAllSheetsInFolder(folder) {
  // Get all files in the folder
  const files = folder.getFiles();
  
  // Loop through the files and delete those that are Google Sheets
  while (files.hasNext()) {
    const file = files.next();
      file.setTrashed(true);
  }
}

function getSheet(spreadSheet, sheetName) {
  const sheet = spreadSheet.getSheetByName(sheetName);
  
  if (sheet) {
    return sheet;
  } else {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }
}


