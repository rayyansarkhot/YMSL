const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3000;

// Set your API key
const apiKey = 'AIzaSyARfusRDNwT81WtRtBdlqQ1JyjyoS4YCZM'; // Replace with your API key

// Fetch all data from a Google Sheet
async function fetchSheetData() {
  try {
    // Create the Sheets API client
    const sheets = google.sheets({ version: 'v4' });

    // Specify the spreadsheet ID
    const spreadsheetId = '1QHAQraRDpnUAtPNRQgA-Sl2fHT5VzF7-i3qXuVzOW7c'; // Replace with your spreadsheet ID

    // Fetch all data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'YMSL Stat Central!A5:Q38', // Replace with your desired sheet name or range
      key: apiKey
    });

    // Extract the values from the response
    const values = response.data.values;

    // Return the data
    return values;
  } catch (error) {
    console.error('Error fetching data from Google Sheet:', error.message);
    throw error;
  }
}

// Define the API endpoint
app.get('/api/sheet-data', async (req, res) => {
  try {
    // Fetch the sheet data
    const sheetData = await fetchSheetData();

    // Return the data as the API response
    res.json(sheetData);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: 'An error occurred while fetching data from the Google Sheet.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
