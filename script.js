document.addEventListener("DOMContentLoaded", function () {
    // Password protection
    const correctPassword = "yourPasswordHere";
    const enteredPassword = prompt("Enter the password to access the site:");

    if (enteredPassword !== correctPassword) {
        alert("Incorrect password.");
        return;
    }

    document.getElementById("content").style.display = "block";

    document.getElementById("generate-grid").addEventListener("click", function () {
        const cohorts = {
            PPP: parseInt(document.getElementById("PPP").value) || 0,
            L1: parseInt(document.getElementById("L1").value) || 0,
            CC: parseInt(document.getElementById("CC").value) || 0,
            L2: parseInt(document.getElementById("L2").value) || 0,
            L3: parseInt(document.getElementById("L3").value) || 0,
            L4: parseInt(document.getElementById("L4").value) || 0,
            L5: parseInt(document.getElementById("L5").value) || 0,
            L6: parseInt(document.getElementById("L6").value) || 0,
        };

        const columns = 8; // Fixed number of columns
        const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
        const rows = Math.ceil(totalPeople / columns);

        // Create a 2D array for the grid
        let grid = Array.from({ length: rows }, () => Array(columns).fill(null));

        // Function to fill the grid row by row
        const fillGrid = (label, count) => {
            let filled = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (grid[i][j] === null && filled < count) {
                        grid[i][j] = label;
                        filled++;
                    }
                }
            }
            return count - filled; // Return any remaining individuals to allocate
        };

        // Fill cohorts in the prescribed order
        cohorts.PPP = fillGrid("PPP", cohorts.PPP); // Top rows first
        cohorts.L1 = fillGrid("L1", cohorts.L1);   // Row 4
        cohorts.L4 = fillGrid("L4", cohorts.L4);   // Rows 5-6
        cohorts.L5 = fillGrid("L5", cohorts.L5);   // Rows 7-8
        cohorts.CC = fillGrid("CC", cohorts.CC);   // Center rows
        cohorts.L2 = fillGrid("L2", cohorts.L2);   // Rows below CC
        cohorts.L3 = fillGrid("L3", cohorts.L3);   // Rows below CC
        cohorts.L6 = fillGrid("L6", cohorts.L6);   // Bottom rows

        // Rotate the grid 180 degrees
        grid = grid.reverse().map(row => row.reverse());

        // Clear and regenerate the grid table
        const gridTable = document.getElementById("grid-table");
        gridTable.innerHTML = "";

        // Add column headers
        const headerRow = document.createElement("tr");
        for (let col = 0; col < columns; col++) {
            const headerCell = document.createElement("th");
            headerCell.textContent = `Line ${String.fromCharCode(65 + col)}`;
            headerCell.style.fontWeight = "bold";
            headerRow.appendChild(headerCell);
        }
        gridTable.appendChild(headerRow);

        // Populate grid rows
        grid.forEach((row, rowIndex) => {
            const tableRow = document.createElement("tr");

            // Add row labels (Line numbers)
            const rowLabel = document.createElement("th");
            rowLabel.textContent = `Line ${rowIndex + 1}`;
            rowLabel.style.fontWeight = "bold";
            tableRow.appendChild(rowLabel);

            // Add cells for each column
            row.forEach(cell => {
                const tableCell = document.createElement("td");
                tableCell.textContent = cell || ""; // Display cohort label or leave empty
                tableCell.classList.add(cell ? cell : "empty-slot"); // Add class for styling
                tableRow.appendChild(tableCell);
            });

            gridTable.appendChild(tableRow);
        });
    });
});
