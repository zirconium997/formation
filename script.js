document.addEventListener("DOMContentLoaded", function () {
    console.log("Document loaded");

    const submitButton = document.getElementById("submit-button");
    const generateButton = document.getElementById("generate-button");

    // Validate password on submit
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        validatePassword();
    });

    // Generate grid on button click
    generateButton.addEventListener("click", function (event) {
        event.preventDefault();
        generateFormation();
    });
});

function validatePassword() {
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (password === "DefileFormations") {
        document.getElementById("password-screen").classList.add("hidden");
        document.getElementById("input-screen").classList.remove("hidden");
        console.log("Password validated successfully.");
    } else {
        errorMessage.textContent = "Incorrect password. Please try again.";
        console.log("Password validation failed.");
    }
}

function generateFormation() {
    console.log("Generating grid formation...");

    // Cohort data from input fields
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
    const totalPeople = Object.values(cohorts).reduce((sum, value) => sum + value, 0);
    const rows = Math.ceil(totalPeople / columns);
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Place PPP
    let pppRows = Math.ceil(cohorts.PPP / columns);
    let pppStartRow = rows - pppRows;
    let remainingPPP = cohorts.PPP;
    for (let row = pppStartRow; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingPPP > 0) {
                grid[row][col] = "PPP";
                remainingPPP--;
            }
        }
    }

    // Place CC
    let remainingCC = cohorts.CC;
    let ccRow = pppStartRow - 1;
    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Helper function to assign cohorts
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

    // Assign primary cohorts
    cohorts.L1 = assignCohort("L1", cohorts.L1, 3, 4, rows);
    cohorts.L2 = assignCohort("L2", cohorts.L2, 2, 5, rows);
    cohorts.L3 = assignCohort("L3", cohorts.L3, 1, 6, rows);
    cohorts.L6 = assignCohort("L6", cohorts.L6, 0, 7, rows);

    // Place L5 and L4
    placeCohorts(grid, cohorts.L5, "L5", [0, 7], ccRow);
    placeCohorts(grid, cohorts.L4, "L4", [1, 2, 3, 4, 5, 6], rows);

    renderGrid(grid.reverse());
}

function placeCohorts(grid, count, cohort, columns, stopRow) {
    for (let row = 0; row < stopRow; row++) {
        for (let col of columns) {
            if (count <= 0) return;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = cohort;
                count--;
            }
        }
    }
}

function renderGrid(grid) {
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = "";

    grid.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            td.className = cell;
            tr.appendChild(td);
        });
        gridOutput.appendChild(tr);
    });

    document.getElementById("input-screen").classList.add("hidden");
    document.getElementById("grid-screen").classList.remove("hidden");
}
