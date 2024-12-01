document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-button");
    const generateButton = document.getElementById("generate-button");

    // Validate password
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
    // Cohorts from user input (these can be dynamically adjusted)
    const cohorts = {
        L1: parseInt(document.getElementById("L1").value) || 0,
        L2: parseInt(document.getElementById("L2").value) || 0,
        L3: parseInt(document.getElementById("L3").value) || 0,
        L6: parseInt(document.getElementById("L6").value) || 0,
        L5: parseInt(document.getElementById("L5").value) || 0,
        L4: parseInt(document.getElementById("L4").value) || 0,
        CC: parseInt(document.getElementById("CC").value) || 0,
        PPP: parseInt(document.getElementById("PPP").value) || 0
    };

    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((sum, num) => sum + num, 0);
    const rows = Math.ceil(totalPeople / columns);
    const totalCells = rows * columns;
    const initialGaps = totalCells - totalPeople;

    // Create empty grid
    let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Calculate the row count for PPP cohort
    const pppRows = Math.ceil(cohorts["PPP"] / columns);
    const pppStartRow = rows - pppRows;  // Starting row for PPP

    // Place PPP cohort from its start row
    let remainingPPP = cohorts["PPP"];
    for (let row = pppStartRow; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingPPP > 0) {
                grid[row][col] = "PPP";
                remainingPPP--;
            }
        }
    }

    // Place CC cohort in the row directly above PPP start row
    let remainingCC = cohorts["CC"];
    const ccRow = pppStartRow - 1;
    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Function to assign cohorts to specific columns, respecting existing placements
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

    // Place primary cohorts in specific locations based on rules
    cohorts["L1"] = assignCohort("L1", cohorts["L1"], 3, 4, rows);
    cohorts["L2"] = assignCohort("L2", cohorts["L2"], 2, 5, rows);
    cohorts["L3"] = assignCohort("L3", cohorts["L3"], 1, 6, rows);
    cohorts["L6"] = assignCohort("L6", cohorts["L6"], 0, 7, rows);

    // Place L5 directly after L6 in columns 1 and 8, ensuring no excess placement
    let remainingL5 = cohorts["L5"];
    for (let row = 0; row < rows; row++) {
        if (remainingL5 <= 0) break;
        if (row < ccRow && grid[row][0] === "EMPTY") {
            grid[row][0] = "L5";
            remainingL5--;
        }
        if (remainingL5 > 0 && row < ccRow && grid[row][7] === "EMPTY") {
            grid[row][7] = "L5";
            remainingL5--;
        }
    }

    // Place remaining L5 in columns 2 and 7 if needed
    for (let row = 0; row < rows; row++) {
        if (remainingL5 <= 0) break;
        if (row < ccRow && grid[row][1] === "EMPTY") {
            grid[row][1] = "L5";
            remainingL5--;
        }
        if (remainingL5 > 0 && row < ccRow && grid[row][6] === "EMPTY") {
            grid[row][6] = "L5";
            remainingL5--;
        }
    }

    // Initial placement of L4 in remaining empty slots, from lowest to highest rows
    let remainingL4 = cohorts["L4"];
    for (let row = 0; row < rows; row++) {
        for (let col = 1; col < columns - 1; col++) {  // Avoid placing on column 1 and 8
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Secondary placement pass for any remaining L4 individuals, prioritizing remaining gaps
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Adjust individuals in the last row of PPP
    for (let col = 0; col < columns; col++) {
        if (grid[rows - 1][col] === "L4" || grid[rows - 1][col] === "L5") {
            // Find a PPP individual in the first or second row of the PPP cohort to swap
            let swapMade = false;
            for (let swapRow = pppStartRow; swapRow < pppStartRow + Math.min(2, pppRows); swapRow++) {  // First two rows of PPP
                if (grid[swapRow][col] === "PPP") {
                    // Swap the individuals
                    [grid[swapRow][col], grid[rows - 1][col]] = [grid[rows - 1][col], grid[swapRow][col]];
                    swapMade = true;
                    break;
                }
            }
            if (!swapMade) {
                console.warn(`Could not find a PPP individual to swap for column ${col}.`);
            }
        }
    }

    // Flip the grid vertically
    grid = grid.reverse();

    // Display grid with alignment and color coding
    renderGrid(grid);
}

function renderGrid(grid) {
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = "";  // Clear previous grid

    // Create the grid HTML structure
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
    console.log("Grid rendered successfully.");
}

// Color codes for cohorts
function getColorForCohort(cohort) {
    const colors = {
        PPP: "yellow",
        L1: "grey",
        CC: "blue",
        L2: "lightgrey",
        L3: "lightblue",
        L4: "orange",
        L5: "green",
        L6: "tan",
        EMPTY: "white",
    };
    return colors[cohort] || "white";
}
