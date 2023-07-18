async function fetchGames() {
  const apiEndpoint = 'http://localhost:3000/'; // Replace with your API endpoint

  try {
    const response = await fetch(apiEndpoint);
    const data = await response.json(); // Parse the response as JSON
    const container = document.getElementById('resultContainer');

    // Clear the container
    container.innerHTML = '';

    // Array of team names
    const teams = ['ICCC', 'FAJR', 'JMIC', 'MC', 'KP', 'JMIC', 'MC', 'FAJR', 'MONTVILLE',
      'ICCC', 'MONTVILLE', 'JMIC', 'MC', 'ICCC', 'KP', 'ICCC', 'JMIC', 'FAJR', 'KP', 'MONTVILLE',
      'FAJR', 'KP', 'MC', 'MONTVILLE', 'JMIC', 'ICCC', 'FAJR', 'MONTVILLE', 'MC', 'ICCC', 'KP',
      'MONTVILLE', 'FAJR', 'JMIC', 'KP', 'MC', 'MONTVILLE', 'JMIC', 'ICCC', 'FAJR', 'JMIC', 'MC',
      'FAJR', 'MONTVILLE', 'ICCC', 'MONTVILLE', 'FAJR', 'KP', 'ICCC', 'JMIC', 'FAJR', 'KP', 'MONTVILLE',
      'MC', 'KP', 'ICCC', 'MC', 'FAJR', 'KP', 'JMIC', 'MC', 'ICCC', 'MC', 'KP', 'FAJR', 'JMIC', 'FAJR',
      'MONTVILLE', 'ICCC', 'FAJR', 'JMIC', 'KP', 'MC', 'MONTVILLE'];

    // Initialize the index
    let teamIndex = 0;

    // Loop through each array of scores
    for (let i = 0; i < data.length; i++) {
      const scores = data[i];
      const teamName = teams[teamIndex];

      const scoresContainer = document.createElement('div');
      scoresContainer.classList.add('scores');

      // Loop through each individual score
      for (let score of scores) {

        const gameElement = document.createElement('div');

        // Create a span element for the left team name
        const leftTeamElement = document.createElement('span');
        leftTeamElement.classList.add('team');
        leftTeamElement.textContent = teams[teamIndex];
        gameElement.appendChild(leftTeamElement);
        ++teamIndex;
        
        const scoreElement = document.createElement('span');
        if(score === '') {score = "TBD";}
        scoreElement.textContent = score;
        gameElement.appendChild(scoreElement);

        // Create a span element for the right team name
        const rightTeamElement = document.createElement('span');
        rightTeamElement.classList.add('team');
        rightTeamElement.textContent = teams[teamIndex];
        gameElement.appendChild(rightTeamElement);
        ++teamIndex;

        const lineBreak = document.createElement('br');
        gameElement.appendChild(lineBreak);

        scoresContainer.appendChild(gameElement);

        // Increase the index by one
        teamIndex = (teamIndex + 1) % teams.length;
      }

      const scoresHeader = document.createElement('h3');
      scoresHeader.textContent = 'ROUND ' + (i+1);      
      container.appendChild(scoresHeader);

      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      wrapper.appendChild(scoresHeader);
      wrapper.appendChild(scoresContainer);
      
      container.appendChild(wrapper);
    }
  } catch (error) {
    console.error('Error fetching API endpoint:', error);
    const container = document.getElementById('resultContainer');
    container.innerText = 'Error fetching API endpoint';
  }
}

async function fetchStandings() {
  const apiEndpoint = 'http://localhost:3000/api/team-standings'; // Replace with your API endpoint

  try {
    const response = await fetch(apiEndpoint);
    let data = await response.text(); // Get the response as plain text
    data = data.replaceAll('\\n', '');
    data = data.replaceAll('\"', '');
    
    // Find the container element to display the response content
    const container = document.getElementById('standingsContainer');
    if (container) {
      container.innerHTML = data;
    } else {
      console.error('Container element not found.');
    }
  } catch (error) {
    console.error('Error fetching API endpoint:', error);
    const container = document.getElementById('standingsContainer');
    if (container) {
      container.innerText = 'Error fetching API endpoint';
    }
  }
}

// Run fetchHTML() when the page loads
window.addEventListener('load', fetchGames);
window.addEventListener('load', fetchStandings);

