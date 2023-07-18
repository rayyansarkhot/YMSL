// Create a function to fetch data from the API endpoint
async function fetchData() {
    try {
      const response = await fetch("http://localhost:3000/api/team-data");
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching data:", error);
      return null;
    }
  }
  
  // Filter out duplicate entries in the table
  function filterDuplicates(table) {
    const uniqueTable = [];
    const seen = new Set();
    
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const key = row[0] + row[1];
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTable.push(row);
      }
    }
    
    return uniqueTable;
  }
  
  function updateHTML(data) {
    const containers = document.querySelectorAll(".container");
  
    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      const h2 = container.querySelector("h2");
      const teamName = h2.textContent;
  
      const ul = container.querySelector("ul");
      ul.innerHTML = "";
  
      for (let j = 0; j < data.length; j++) {
        const row = data[j];
  
        if (row[1] === teamName || getTeamNameByAbbreviation(row[1]) === teamName) {
          const li = document.createElement("li");
          li.textContent = row[0];
          ul.appendChild(li);
        }
      }
    }
  }
  
  // Helper function to get the team name by abbreviation
  function getTeamNameByAbbreviation(abbreviation) {
    const teamAbbreviations = {
      KP: "KP KINGS",
      MC: "MC CHALLENGERS",
      JMIC: "JMIC JETS",
      ICCC: "ICCC IGUANAS",
      Montville: "MONTVILLE MUSLIMS",
      Fajr: "FAJR FIGHTERS"
    };
  
    return teamAbbreviations[abbreviation] || abbreviation;
  }
  
  
  // Fetch data and update the HTML when the page loads
  window.addEventListener("load", async () => {
    const data = await fetchData();
    
    if (data) {
      const filteredData = filterDuplicates(data);
      updateHTML(filteredData);
    }
  });
  