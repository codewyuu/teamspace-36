
# Using Excel as a Database in EventScribe

This guide explains how to use Excel spreadsheets as a database for the EventScribe application.

## Overview

EventScribe now supports Excel (.xlsx) files as a data source. You can:
- Import event data from Excel files
- Export event data to Excel files
- Use Excel as your primary data storage

## Excel File Structure

When creating an Excel file for import, use the following column structure:

| Column Name    | Data Type | Description                                   |
|----------------|-----------|-----------------------------------------------|
| id             | String    | Unique identifier for the event               |
| name           | String    | Event name                                    |
| date           | Date      | Event date (ISO format works best)            |
| notes          | String    | Event notes                                   |
| description    | String    | Event description                             |
| tags           | String    | Comma-separated list of tags                  |
| collaborators  | String    | Comma-separated list of collaborators         |
| comments       | String    | JSON string of comments (advanced)            |

## Importing Excel Data

1. From the Dashboard, click on Settings icon and select "Export/Import"
2. Select the "Import" tab
3. Click on the "Excel" option
4. Click to select your Excel file or drag and drop
5. The application will process the file and import all events

## Exporting to Excel

1. From the Dashboard, click on Settings icon and select "Export/Import"
2. Select the "Export" tab
3. Click on the "Excel" option
4. Click "Export Events" to download your data as an Excel file

## Excel Integration Tips

- Keep column names exactly as specified for seamless imports
- For dates, use a consistent format (YYYY-MM-DD works well)
- For tags and collaborators, use comma-separated values
- Export regularly to maintain a backup of your data
- When importing, all existing data will be replaced

## Data Flow

1. **Initial Import**: Load data from Excel into the application
2. **In-App Editing**: Add, update, and delete events within the app
3. **Data Export**: Export to Excel for external use or backup
4. **Re-Import**: Import back into the app if needed

## Advanced Usage

For power users who want to maintain their data primarily in Excel:

1. Export your current data to Excel
2. Make changes in Excel using your preferred spreadsheet software
3. Import the updated Excel file back into the application

This workflow allows you to use the full power of Excel for data manipulation while still enjoying the EventScribe interface for event management.
