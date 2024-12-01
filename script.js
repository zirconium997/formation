document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        validatePassword();
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
    const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
    const rows = Math.ceil(totalPeople / columns);
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    const pppRows = Math.ceil(cohorts.PPP / columns);
    const pppStartRow = rows - pppRows;

    // Place PPP cohort
    let remainingPPP = cohorts.PPP;
    for (let row = pppStartRow; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingPPP > 0) {
                grid[row][col] = "PPP";
                remainingPPP--;
            }
        }
    }

    // Place CC cohort
    let remainingCC = cohorts.CC;
    const ccRow = pppStartRow - 1;
    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Helper function to assign cohorts to specific columns
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
    cohorts.L1 = assignCohort("L1", cohorts.L1, 3, 4, rows);
    cohorts.L2 = assignCohort("L2", cohorts.L2, 2, 5, rows);
    cohorts.L3 = assignCohort("L3", cohorts.L3, 1, 6, rows);
    cohorts.L6 = assignCohort("L6", cohorts.L6, 0, 7, rows);

    // Place L5 cohort
    let remainingL5 = cohorts.L5;
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

    // Place L4 cohort
    let remainingL4 = cohorts.L4;
    for (let row = 0; row < rows; row++) {
        for (let col = 1; col < columns - 1; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Adjust last row of PPP
    for (let col = 0; col < columns; col++) {
        if (["L4", "L5"].includes(grid[rows - 1][col])) {
            for (let swapRow = pppStartRow; swapRow < Math.min(pppStartRow + 2, rows); swapRow++) {
                if (grid[swapRow][col] === "PPP") {
                    [grid[swapRow][col], grid[rows - 1][col]] = [grid[rows - 1][col], grid[swapRow][col]];
                    break;
                }
            }
        }
    }

    // Flip grid vertically
    const flippedGrid = grid.reverse();

    // Render grid
    renderGrid(flippedGrid);
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
    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
