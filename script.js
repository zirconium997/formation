// Function to generate the grid based on cohort populations
function generateGrid(cohortPopulations) {
    const columns = 8;
    const cohorts = { ...cohortPopulations };

    // Calculate total people and grid dimensions
    const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
    const rows = Math.ceil(totalPeople / columns);
    const totalCells = rows * columns;

    // Create empty grid
    let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Determine PPP start row
    const pppRows = Math.ceil(cohorts["PPP"] / columns);
    const pppStartRow = rows - pppRows;

    // Place PPP cohort
    let remainingPPP = cohorts["PPP"];
    for (let row = pppStartRow; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingPPP > 0) {
                grid[row][col] = "PPP";
                remainingPPP--;
            }
        }
    }

    // Place CC cohort
    let remainingCC = cohorts["CC"];
    const ccRow = pppStartRow - 1;
    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Helper function to place cohorts
    function assignCohort(cohort, count, col1, col2, stopRow) {
        for (let row = 0; row < stopRow; row++) {
            if (count <= 0) break;
            if (grid[row][col1] === "EMPTY") {
                grid[row][col1] = cohort;
                count--;
            }
            if (count > 0 && grid[row][col2] === "EMPTY") {
                grid[row][col2] = cohort;
                count--;
            }
        }
        return count;
    }

    // Place L1, L2, L3, L6
    cohorts["L1"] = assignCohort("L1", cohorts["L1"], 3, 4, rows);
    cohorts["L2"] = assignCohort("L2", cohorts["L2"], 2, 5, rows);
    cohorts["L3"] = assignCohort("L3", cohorts["L3"], 1, 6, rows);
    cohorts["L6"] = assignCohort("L6", cohorts["L6"], 0, 7, rows);

    // Place L5 directly after L6
    let remainingL5 = cohorts["L5"];
    for (let row = 0; row < ccRow; row++) {
        if (remainingL5 <= 0) break;
        if (grid[row][0] === "EMPTY") {
            grid[row][0] = "L5";
            remainingL5--;
        }
        if (remainingL5 > 0 && grid[row][7] === "EMPTY") {
            grid[row][7] = "L5";
            remainingL5--;
        }
    }

    // Place L5 in columns 2 and 7 if needed
    for (let row = 0; row < ccRow; row++) {
        if (remainingL5 <= 0) break;
        if (grid[row][1] === "EMPTY") {
            grid[row][1] = "L5";
            remainingL5--;
        }
        if (remainingL5 > 0 && grid[row][6] === "EMPTY") {
            grid[row][6] = "L5";
            remainingL5--;
        }
    }

    // Place L4 in remaining empty slots
    let remainingL4 = cohorts["L4"];
    for (let row = 0; row < rows; row++) {
        for (let col = 1; col < columns - 1; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Secondary pass for L4 in any remaining slots
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Flip grid vertically
    grid.reverse();

    return grid;
}

// Example usage with dynamically set populations
document.getElementById("generateButton").addEventListener("click", () => {
    const cohortPopulations = {
        L1: parseInt(document.getElementById("L1").value),
        L2: parseInt(document.getElementById("L2").value),
        L3: parseInt(document.getElementById("L3").value),
        L6: parseInt(document.getElementById("L6").value),
        L5: parseInt(document.getElementById("L5").value),
        L4: parseInt(document.getElementById("L4").value),
        CC: parseInt(document.getElementById("CC").value),
        PPP: parseInt(document.getElementById("PPP").value)
    };

    const grid = generateGrid(cohortPopulations);
    displayGrid(grid);
});

function displayGrid(grid) {
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.innerHTML = ""; // Clear previous grid

    grid.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("grid-row");
        row.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("grid-cell");
            cellDiv.textContent = cell;
            rowDiv.appendChild(cellDiv);
        });
        gridContainer.appendChild(rowDiv);
    });
}
