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
    const totalPeople = Object.values(cohorts).reduce((sum, num) => sum + num, 0);
    const rows = Math.ceil(totalPeople / columns);
    const totalCells = rows * columns;
    const initialGaps = totalCells - totalPeople;

    let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Determine the row count for PPP cohort
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

    // Place CC cohort in the row directly above PPP
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

    // Place primary cohorts
    cohorts["L1"] = assignCohort("L1", cohorts["L1"], 3, 4, rows);
    cohorts["L2"] = assignCohort("L2", cohorts["L2"], 2, 5, rows);
    cohorts["L3"] = assignCohort("L3", cohorts["L3"], 1, 6, rows);
    cohorts["L6"] = assignCohort("L6", cohorts["L6"], 0, 7, rows);

    // Place L5 directly after L6 in columns 1 and 8
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

    // Place remaining L5 in columns 2 and 7 if needed
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

    // Place initial L4 in remaining empty slots
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

    // Secondary placement for any remaining L4 individuals
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Flip the grid vertically
    grid = grid.reverse();

    renderGrid(grid);
}

function renderGrid(grid) {
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = ""; // Clear previous grid

    grid.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.className = `cell ${cell}`;
            cellDiv.textContent = cell !== "EMPTY" ? cell : ""; // Add label only if not empty
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
