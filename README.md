# Tournament Data Management Scripts for 2024

This project consists of a set of JavaScript Google Sheets scripts designed to streamline the handling of data for our 2024 tournament (and hopefully future ones). These scripts process and integrate data from multiple sources, helping managing participant information.

I've implemented asynchronous processing in some parts of the script, such as creating each spreadsheet one by one, where I felt it was needed. However, there is definitely room for improvement in terms of performance optimization.

## Google Sheets Integration

The scripts populate and manage several sheets within a main Google Sheets document. [View the Google Sheet here](https://docs.google.com/spreadsheets/d/1lJ14WTWZRBPJRKZR8p7cWpdjfY9faKZyVgPJuMcxLkI/edit#gid=674535903). Which is under the [Tourney Organization Folder](https://drive.google.com/drive/u/3/folders/11O6pvQZx9xnTgOqaDzO3Ojol8B5-KQcR)

### Sheets in master spreadsheet
Here I will explain the sheets you will see in the master spreadsheet and what they are

## Data Sources

There are three primary datasets received:
1. **Square Order Details**: Data from the Square website.
2. **Food Form**: A form where participants specify their food preferences.
3. **Declaration Form**: A form where players declare their order numbers and the clubs they are representing.

These datasets are processed and mapped to create new datasets that link players between the different sources.

## Script-Populated sheets

1. **Progress**
   - Contains a button to process everything (or individual tasks).
   - Shows the progress of the current run.
   - Shows errors (if any).

2. **Players**
   - Maps data from the Square orders to the Declarations.
   - Lists players, their clubs, and additional columns of relevant data.

3. **Missing Declarations**
   - Lists people who have placed an order but haven't submitted a declaration.
   - This list should get smaller as the tournament date approaches. I guess we will contact whoever still hasnt made a declaration by x date.

4. **Incorrect Order Number**
   - Contains declarations with order numbers that cannot be matched to the Square data.
   - Requires manual intervention to resolve these discrepancies. We will either have to contact these people or try to solve it ourselves if we can.

5. **Duplicate Name**
   - Identifies people with multiple orders under the same name.
   - This is likely fine as people have bought tickets for their friends, but its nice to be able to track this.

6. **Club**
   - Lists all clubs, the number of players declared for each, and links to their unique spreadsheets.

7. **Food Order Complete**
   - Lists all players who have declared their food preferences along with the necessary details.

### Additional Features

Apart from populating the above sheets, the script performs the following tasks:

- **Club Spreadsheets**: For each registered club, a unique spreadsheet is created containing:
  - A list of all registered players.
  - Sheets for timings, questions, etc.
  - These spreadsheets are stored inside the [Info Packs folder](https://drive.google.com/drive/u/3/folders/1Dalx4D3USf-ojXkyrCOCFQcCNHbY54kl), and sent to each club's coordinator.

- **Lions Sheet**: A separate sheet is populated for the Lions, providing:
  - A list of attending players.
  - Player count.
  - Food choices and dietary requirements.
  - This will be [its own spreadsheet](https://docs.google.com/spreadsheets/d/1RzFE8XkP6VL0ykOUTTWIliFHmlbwPpNOLYgdsrvrepA/edit#gid=1448082000) as we need to give this to the club

## Usage

To utilize these scripts, simply open the [Google Sheets document](https://docs.google.com/spreadsheets/d/1lJ14WTWZRBPJRKZR8p7cWpdjfY9faKZyVgPJuMcxLkI/edit#gid=674535903) and use the provided buttons to process the data. Ensure all necessary forms are filled and data is up-to-date to avoid discrepancies.


## TODO List

- [x] Try out eslint
- [x] Remove eslint (I hate it. I hate the fact that I thought it would be better)
- [x] Be cool
- [x] Create issues for all of these so they're linked here
- [ ] Maybe format into folders so we have a little bit of a better structure within the code. This only makes sense if it's getting a bit too complex. So will not yet.

## Issues

- [x] [Text/Background colours being used in magic strings](https://github.com/LuciooF/Tourney2024Scripts/issues/1){1} 
- [x] [Clearing player sheet clears the whole sheet and the formatting](https://github.com/LuciooF/Tourney2024Scripts/issues/2){2} 
- [x] [Lions sheet not being properly cleared / count in wrong place](https://github.com/LuciooF/Tourney2024Scripts/issues/3){3} 
- [x] [Create Food Master sheet](https://github.com/LuciooF/Tourney2024Scripts/issues/5){5} 
- [x] [Write explanation for the "complicated" functions](https://github.com/LuciooF/Tourney2024Scripts/issues/7){7} 
- [x] [Cleanup innecessary comments](https://github.com/LuciooF/Tourney2024Scripts/issues/8){8} 
- [x] [Look into creating proper classes for data sets](https://github.com/LuciooF/Tourney2024Scripts/issues/9){9} 
- [x] [Create a github cronjob and script so new issues are added and linked to the readme automatically](https://github.com/LuciooF/Tourney2024Scripts/issues/10){10} 
- [x] [De-complicate userFeedback.js, make it also a bit less over the top in the "UI"](https://github.com/LuciooF/Tourney2024Scripts/issues/11){11} 
- [x] [Properly name "main" function in the standalone workers. Create buttons for them in the google sheet](https://github.com/LuciooF/Tourney2024Scripts/issues/12){12} 
- [x] [Try pasting the whole values in range rather than going line by line,. improve performance](https://github.com/LuciooF/Tourney2024Scripts/issues/13){13} 
- [x] [Add club sheets](https://github.com/LuciooF/Tourney2024Scripts/issues/15){15} 
- [x] [Add "Food order complete" sheet](https://github.com/LuciooF/Tourney2024Scripts/issues/16){16} 
- [x] [Separate errors sheet ](https://github.com/LuciooF/Tourney2024Scripts/issues/17){17} 
- [x] [Implement async functions to make asyncronous and faster, especially the club spreadsheets](https://github.com/LuciooF/Tourney2024Scripts/issues/18){18} 
- [x] [Formalize Food Form data as it is currently bad.](https://github.com/LuciooF/Tourney2024Scripts/issues/19){19} 
- [ ] [Food Form/Requirements work](https://github.com/LuciooF/Tourney2024Scripts/issues/4){4} 
- [ ] [Write a well-documented readme.](https://github.com/LuciooF/Tourney2024Scripts/issues/6){6} 
- [ ] [Add duplicate peoples name to error sheet](https://github.com/LuciooF/Tourney2024Scripts/issues/14){14} 
- [ ] [Make sure making this repo is secure and im not sharing anything I should't](https://github.com/LuciooF/Tourney2024Scripts/issues/20){20} 