document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-button");
    const generateButton = document.getElementById("generate-button");

    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        validatePassword();
    });

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

    let remainingPPP = cohorts["PPP"];
    let remainingCC = cohorts["CC"];
    let remainingL1 = cohorts["L1"];
    let remainingL2 = cohorts["L2"];
    let remainingL3 = cohorts["L3"];
    let remainingL4 = cohorts["L4"];
    let remainingL5 = cohorts["L5"];
    let remainingL6 = cohorts["L6"];

    // Place PPP cohort in the last rows
    let pppRows = Math.ceil(remainingPPP / columns);
    let startRow = rows - pppRows;
    for (let row = startRow; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingPPP > 0) {
                grid[row][col] = "PPP";
                remainingPPP--;
            }
        }
    }

    // Place CC cohort just above PPP
    let ccRow = startRow - 1;
    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Function to place cohorts in columns 1 and 8, filling from top to bottom
    function placeCohortsInColumns(cohort, remainingCount, col1, col2) {
        for (let row = 0; row < rows; row++) {
            if (remainingCount <= 0) break;
            if (grid[row][col1] === "EMPTY" && remainingCount > 0) {
                grid[row][col1] = cohort;
                remainingCount--;
            }
            if (grid[row][col2] === "EMPTY" && remainingCount > 0) {
                grid[row][col2] = cohort;
                remainingCount--;
            }
        }
        return remainingCount;
    }

    // Place L1, L2, L3, L6 in the grid, filling columns 1 and 8 first
    remainingL1 = placeCohortsInColumns("L1", remainingL1, 1, 8);
    remainingL2 = placeCohortsInColumns("L2", remainingL2, 0, 7);
    remainingL3 = placeCohortsInColumns("L3", remainingL3, 2, 5);
    remainingL6 = placeCohortsInColumns("L6", remainingL6, 3, 4);

    // Place L5 directly after L6 in columns 1 and 8
    remainingL5 = placeCohortsInColumns("L5", remainingL5, 1, 8);

    // Fill remaining spaces for L4
    function placeRemainingL4() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                if (remainingL4 <= 0) break;
                if (grid[row][col] === "EMPTY" && remainingL4 > 0) {
                    grid[row][col] = "L4";
                    remainingL4--;
                }
            }
        }
    }
    placeRemainingL4();

    // Render the grid to the screen
    renderGrid(grid);
}

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
        L4: "purple",
        L5: "green",
        L6: "orange"
    };
    return colors[cohort] || "white"; // Default to white if cohort not found
}
