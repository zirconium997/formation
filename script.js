document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-button");
    const generateButton = document.getElementById("generate-button");

    // Password validation
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        validatePassword();
    });

    // Generate grid
    generateButton.addEventListener("click", function (event) {
        event.preventDefault();
        generateFormation();
    });
});

function validatePassword() {
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (password === "DefileFormations") {
        document.getElementById("password-screen").style.display = "none";
        document.getElementById("input-screen").style.display = "block";
    } else {
        errorMessage.textContent = "Incorrect password. Please try again.";
    }
}

function generateFormation() {
    const cohorts = {
        L1: parseInt(document.getElementById("L1").value) || 0,
        L2: parseInt(document.getElementById("L2").value) || 0,
        L3: parseInt(document.getElementById("L3").value) || 0,
        L4: parseInt(document.getElementById("L4").value) || 0,
        L5: parseInt(document.getElementById("L5").value) || 0,
        L6: parseInt(document.getElementById("L6").value) || 0,
        CC: parseInt(document.getElementById("CC").value) || 0,
        PPP: parseInt(document.getElementById("PPP").value) || 0
    };

    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((sum, num) => sum + num, 0);
    const rows = Math.ceil(totalPeople / columns);
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Placement logic
    // Define placement logic
function createGrid(totalPeople, cohorts) {
    const columns = 8; // Fixed number of columns
    const rows = Math.ceil(totalPeople / columns); // Calculate required rows
    let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Helper function to place individuals in specific columns
    function placeInColumns(cohort, count, colIndices, startRow = 0) {
        let row = startRow, placed = 0;
        while (count > 0 && row < rows) {
            for (let col of colIndices) {
                if (count === 0) break;
                if (grid[row][col] === "EMPTY") {
                    grid[row][col] = cohort;
                    count--;
                    placed++;
                }
            }
            row++;
        }
        return placed;
    }

    // Place L6 in columns 1 and 8
    placeInColumns("L6", cohorts.L6 || 0, [0, 7]);

    // Place L5 directly after L6 in columns 1 and 8
    placeInColumns("L5", cohorts.L5 || 0, [0, 7]);

    // Place CC in the last two rows
    placeInColumns("CC", cohorts.CC || 0, [...Array(columns).keys()], rows - 2);

    // Place PPP in the last row
    placeInColumns("PPP", cohorts.PPP || 0, [...Array(columns).keys()], rows - 1);

    // Fill L4 in the middle rows
    const middleStartRow = Math.floor(rows / 2) - 1;
    placeInColumns("L4", cohorts.L4 || 0, Array.from({ length: columns - 2 }, (_, i) => i + 1), middleStartRow);

    // Place remaining cohorts (L1, L2, L3)
    ["L1", "L2", "L3"].forEach(cohort => {
        placeInColumns(cohort, cohorts[cohort] || 0, [...Array(columns).keys()]);
    });

    return grid;
}

// Function to dynamically generate the grid layout
function generateGridLayout() {
    // Retrieve cohort populations from user inputs
    const cohorts = {
        L1: parseInt(document.getElementById("L1").value) || 0,
        L2: parseInt(document.getElementById("L2").value) || 0,
        L3: parseInt(document.getElementById("L3").value) || 0,
        L4: parseInt(document.getElementById("L4").value) || 0,
        L5: parseInt(document.getElementById("L5").value) || 0,
        L6: parseInt(document.getElementById("L6").value) || 0,
        CC: parseInt(document.getElementById("CC").value) || 0,
        PPP: parseInt(document.getElementById("PPP").value) || 0
    };

    const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
    const grid = createGrid(totalPeople, cohorts);

    // Render the grid to the results container
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    grid.forEach(row => {
        const rowElement = document.createElement("div");
        rowElement.className = "grid-row";
        row.forEach(cell => {
            const cellElement = document.createElement("div");
            cellElement.className = `grid-cell ${cell.toLowerCase()}`; // Add class for styling
            cellElement.textContent = cell; // Display cohort name
            rowElement.appendChild(cellElement);
        });
        resultsContainer.appendChild(rowElement);
    });
}

// Cohort placement helper function
function placeCohort(grid, cohort, remainingCount, startRow, columns, rowTracker, strategy) {
    const rows = grid.length;

    if (strategy === "fullRow") {
        for (let col = 0; col < columns; col++) {
            if (remainingCount <= 0) break;
            grid[startRow][col] = cohort;
            remainingCount--;
        }
    } else if (strategy === "middle") {
        for (let row = Math.floor(rows / 2); row < rows; row++) {
            for (let col = 1; col < columns - 1; col++) {
                if (remainingCount <= 0) break;
                if (grid[row][col] === "EMPTY") {
                    grid[row][col] = cohort;
                    remainingCount--;
                }
            }
        }
    } else if (Array.isArray(strategy)) {
        strategy.forEach(col => {
            for (let row = startRow; row < rows; row++) {
                if (remainingCount <= 0) break;
                if (grid[row][col] === "EMPTY") {
                    grid[row][col] = cohort;
                    remainingCount--;
                }
            }
        });
    } else {
        for (let row = startRow; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                if (remainingCount <= 0) break;
                if (grid[row][col] === "EMPTY") {
                    grid[row][col] = cohort;
                    remainingCount--;
                }
            }
        }
    }

    return rowTracker;
}

// Render the grid to the screen
function renderGrid(grid) {
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = "";

    grid.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.className = `cell ${cell}`;
            cellDiv.textContent = cell !== "EMPTY" ? cell : "";
            gridOutput.appendChild(cellDiv);
        });
    });

    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
