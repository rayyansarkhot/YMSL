// Fetch data from the API
fetch('http://localhost:3000/api/leaderboard-data')
  .then(response => response.json())
  .then(data => {
    // Create the table element
    const table = document.createElement('table');
    table.classList.add('data-table'); // Add a CSS class for styling (optional)

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    data[0].forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      const icon = document.createElement('i');
      icon.classList.add('fas', 'fa-sort');
      th.appendChild(icon);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    for (let i = 1; i < data.length; i++) {
      const row = document.createElement('tr');
      data[i].forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        row.appendChild(td);
      });
      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    // Append the table to a container element in your HTML (e.g., with id "table-container")
    const tableContainer = document.getElementById('table-container');
    tableContainer.appendChild(table);

    // Function to sort the table rows alphabetically or numerically based on the values in the specified column
    const sortTableRows = (columnIndex, ascending, isNumeric) => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const sortedRows = rows.sort((a, b) => {
        let comparison = 0;
        const valueA = isNumeric ? parseFloat(a.cells[columnIndex].textContent) : a.cells[columnIndex].textContent;
        const valueB = isNumeric ? parseFloat(b.cells[columnIndex].textContent) : b.cells[columnIndex].textContent;

        if (valueA > valueB) {
          comparison = 1;
        } else if (valueA < valueB) {
          comparison = -1;
        }
        return ascending ? comparison : -comparison;
      });
      sortedRows.forEach(row => {
        tbody.appendChild(row);
      });
    };

    // Add click event listeners to the table headers
    const tableHeaders = headerRow.querySelectorAll('th');
    let sortAscending = true;
    tableHeaders.forEach((header, columnIndex) => {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        sortAscending = !sortAscending;
        const isNumeric = columnIndex > 0; // Assuming the first column is non-numeric
        sortTableRows(columnIndex, sortAscending, isNumeric);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
