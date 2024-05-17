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

// Retrieves or creates the spreadsheet for a given club name within the "Team Infos" folder
function getOrCreateClubSpreadsheet(clubName) {
  const folder = FOLDERS.INFO_PACKS;
  const templateSpreadsheet = SPREADSHEETS.TEMPLATE;
  const newSpreadsheet = duplicateTemplateSpreadsheet(templateSpreadsheet, clubName);
  const file = DriveApp.getFileById(newSpreadsheet.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);  // Remove from root folder
  return newSpreadsheet;
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
function duplicateTemplateSpreadsheet(templateSpreadsheet, newName) {
  const templateFile = DriveApp.getFileById(templateSpreadsheet.getId());
  const newFile = templateFile.makeCopy(newName);
  return SpreadsheetApp.openById(newFile.getId());
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


