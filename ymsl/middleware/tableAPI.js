const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();
const { JSDOM } = require('jsdom');
const fs = require('fs');
const axios = require('axios');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// Set your API key
const apiKey = process.env.API_KEY;

// Does string cleanup for league games.
let filter = (text) => {
  text = text.replace(/Division/g, ' ');
  text = text.replace(/[a-zA-Z]/g, '');
  let newText = [];
  let start = false;
  let startIndex = 0;

  for (let i = 1; i < text.length; i++) {
    if (text[i] === ' ') {
      if (text.substring(startIndex + 1, (startIndex + 1 + ((i - startIndex) / 2))).length <= 2) {
        newText.push("");
      }
      else {
        newText.push(text.substring(startIndex + 1, (startIndex + 1 + ((i - startIndex) / 2))));
      }
      startIndex = i;
    }
  }

  newText.push(text.substring(startIndex + 1, (startIndex + 1 + ((text.length - 1 - startIndex) / 2))));

  return newText;

}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Fetch all data from a Google Sheet
async function fetchSheetData(sheetID, data) {
  try {
    // Create the Sheets API client
    const sheets = google.sheets({ version: 'v4' });

    // Specify the spreadsheet ID
    const spreadsheetId = sheetID;; // Replace with your spreadsheet ID

    // Fetch all data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: data, // Replace with your desired sheet name or range
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

// Define API endpoints
app.get('/api/leaderboard-data', async (req, res) => {
  try {
    // Fetch the sheet data
    const sheetData = await fetchSheetData('1QHAQraRDpnUAtPNRQgA-Sl2fHT5VzF7-i3qXuVzOW7c', 'YMSL Stat Central!A5:Q37');

    // Return the data as the API response
    res.json(sheetData);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: 'An error occurred while fetching data from the Google Sheet.' });
  }
});

// Define the API endpoint
app.get('/api/team-data', async (req, res) => {
  try {
    // Fetch the sheet data
    const sheetData = await fetchSheetData('1YEcpxahGcLph3EcGJmUBKbVQs7fNS6_LnGFlyAZ2n8g', 'AllPlayersAllGames!A2:B313');

    // Return the data as the API response
    res.json(sheetData);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: 'An error occurred while fetching data from the Google Sheet.' });
  }
});

// Define the API endpoint
app.get('/api/team-standings', async (req, res) => {
  (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const url = 'https://scheduler.leaguelobster.com/1349899/new-league/new-season/';
      await page.goto(url);

      await page.waitForSelector('.standings-content', { timeout: 1000 });

      const content = await page.evaluate(() => {
        const element = document.querySelector('.standings-content');
        return element ? element.innerHTML : null;
      });

      // Return the data as the API response
      res.json(content);

      await browser.close();
    } catch (error) {
      console.error('Error:', error);
    }
  })();
});


app.get('/', (req, res) => {
  const apiEndpoint = 'https://scheduler.leaguelobster.com/1349899/new-league/new-season/'; // Replace with your API endpoint
  const targetClassName = 'schedule-week row'; // Replace with the class name of the elements you want to find

  axios.get(apiEndpoint)
    .then((response) => {
      // Save the API response HTML to a file
      fs.writeFile('api_response.html', response.data, (err) => {
        if (err) {
          console.error('Error saving API response:', err);
          res.send('Error saving API response');
          return;
        }

        // Read the saved HTML file
        fs.readFile('api_response.html', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading HTML file:', err);
            res.send('Error reading HTML file');
            return;
          }

          // Create a virtual DOM from the HTML file
          const dom = new JSDOM(data);
          const document = dom.window.document;

          // Retrieve all elements with the specified class name
          const elements = document.getElementsByClassName(targetClassName);

          // Check if any elements were found
          if (elements.length > 0) {
            // Prepare an array to store the text content of each element
            const textContentArray = [];

            // Iterate over all elements in the collection
            for (let i = 0; i < elements.length; i++) {
              const element = elements[i];

              // Get the trimmed text content of the element
              let textContent = element.textContent.replace(/Round/g, '');
              textContent = textContent.trim().replace(/\s+/g, '');
              textContent = textContent.substring(textContent.search(/[a-zA-Z]/));
              textContent = filter(textContent);

              // Add the text content to the array
              textContentArray.push(textContent);
            }

            // Send the text content array as the response
            res.send(textContentArray);
          } else {
            console.log('Elements not found');
            res.send('Elements not found');
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching API endpoint:', error);
      res.send('Error fetching API endpoint');
    });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


