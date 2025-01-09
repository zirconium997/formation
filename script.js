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
    let rowTracker = 0;

    // Place L6 cohort in columns 1 and 8 from top to bottom
    rowTracker = placeCohort(grid, "L6", cohorts["L6"], 0, columns, rowTracker, [0, 7]);

    // Place L5 directly after L6 in columns 1 and 8
    rowTracker = placeCohort(grid, "L5", cohorts["L5"], rowTracker, columns, rowTracker, [0, 7]);

    // Place CC cohort above PPP, filling the last row in order
    rowTracker = placeCohort(grid, "CC", cohorts["CC"], rows - 2, columns, rowTracker, "fullRow");

    // Place PPP cohort in the last rows
    rowTracker = placeCohort(grid, "PPP", cohorts["PPP"], rows - 1, columns, rowTracker, "fullRow");

    // Fill L4 in the middle grid spaces
    rowTracker = placeCohort(grid, "L4", cohorts["L4"], 0, columns, rowTracker, "middle");

    // Remaining L1, L2, L3 placement
    ["L1", "L2", "L3"].forEach(cohort => {
        rowTracker = placeCohort(grid, cohort, cohorts[cohort], 0, columns, rowTracker, "remainder");
    });

    renderGrid(grid);
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
