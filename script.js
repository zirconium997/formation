document.addEventListener("DOMContentLoaded", function () {
    // Password protection
    const correctPassword = "DefileFormation";
    const enteredPassword = prompt("Enter the password to access the site:");

    if (enteredPassword !== correctPassword) {
        alert("Incorrect password.");
        return;
    }

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

    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
    const rows = Math.ceil(totalPeople / columns);

    let grid = Array.from({ length: rows }, () => Array(columns).fill(null));

    const placeCohort = (label, count, rules) => {
        let remaining = count;
        rules.forEach(({ rowRange, columns: colIndices }) => {
            for (let row = rowRange.start; row <= rowRange.end && remaining > 0; row++) {
                colIndices.forEach(col => {
                    if (remaining > 0 && grid[row][col] === null) {
                        grid[row][col] = label;
                        remaining--;
                    }
                });
            }
        });
        return remaining;
    };

    // Define rules for each cohort
    const rules = {
        PPP: [{ rowRange: { start: 0, end: rows - 1 }, columns: [...Array(columns).keys()] }],
        CC: [{ rowRange: { start: Math.floor(cohorts.PPP / columns), end: rows - 1 }, columns: [...Array(columns).keys()] }],
        L1: [{ rowRange: { start: rows - 1, end: rows - 1 }, columns: [3, 4] }],
        L2: [{ rowRange: { start: rows - 1, end: rows - 1 }, columns: [2, 5] }],
        L3: [{ rowRange: { start: rows - 1, end: rows - 1 }, columns: [1, 6] }],
        L6: [{ rowRange: { start: rows - 1, end: rows - 1 }, columns: [0, 7] }],
        L5: [
            { rowRange: { start: rows - 1, end: rows - 1 }, columns: [0, 7] },
            { rowRange: { start: rows - 2, end: rows - 2 }, columns: [1, 6] },
        ],
        L4: [{ rowRange: { start: 0, end: rows - 1 }, columns: [...Array(columns).keys()] }],
    };

    // Place cohorts in order
    Object.entries(rules).forEach(([label, placementRules]) => {
        cohorts[label] = placeCohort(label, cohorts[label], placementRules);
    });

    // Fill remaining empty slots with "EMPTY"
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === null) grid[rowIndex][colIndex] = "EMPTY";
        });
    });

    // Render the grid
    const gridTable = document.getElementById("grid-table");
    gridTable.innerHTML = "";

    // Column headers
    const headerRow = document.createElement("tr");
    [...Array(columns).keys()].forEach(col => {
        const th = document.createElement("th");
        th.textContent = `Line ${String.fromCharCode(65 + col)}`;
        headerRow.appendChild(th);
    });
    gridTable.appendChild(headerRow);

    // Add rows
    grid.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        gridTable.appendChild(tr);
    });
});
