document.addEventListener("DOMContentLoaded", function () {
    console.log("Document loaded");

    const submitButton = document.getElementById("submit-button");
    const generateButton = document.getElementById("generate-button");

    // Check if buttons exist
    if (!submitButton || !generateButton) {
        console.error("Buttons not found in the HTML. Please check the button IDs.");
        return;
    }

    // Password screen: Submit button event
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Password validation triggered");
        validatePassword();
    });

    // Generate grid button event
    generateButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Generate grid button clicked");
        generateFormation();
    });
});

function validatePassword() {
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (password === "DefileFormations") {
        document.getElementById("password-screen").style.display = "none";
        document.getElementById("input-screen").style.display = "block";
        console.log("Password validated successfully");
    } else {
        errorMessage.textContent = "Incorrect password. Please try again.";
        console.log("Password validation failed");
    }
}

function generateFormation() {
    console.log("Generating grid formation...");

    // Retrieve cohort sizes from input fields
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

    console.log("Cohort sizes: ", cohorts);

    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((sum, value) => sum + value, 0);
    const rows = Math.ceil(totalPeople / columns);
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Place PPP cohort
    const pppRows = Math.ceil(cohorts.PPP / columns);
    const pppStartRow = rows - pppRows;
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

    // Helper function to place cohorts in specified columns
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

    // Place cohorts in their respective columns
    cohorts.L1 = assignCohort("L1", cohorts.L1, 3, 4, rows);
    cohorts.L2 = assignCohort("L2", cohorts.L2, 2, 5, rows);
    cohorts.L3 = assignCohort("L3", cohorts.L3, 1, 6, rows);
    cohorts.L6 = assignCohort("L6", cohorts.L6, 0, 7, rows);

    // Place L5 cohort
    let remainingL5 = cohorts.L5;
    for (let row = 0; row < rows; row++) {
        if (remainingL5 <= 0) break;
        if (grid[row][0] === "EMPTY") {
            grid[row][0] = "L5";
            remainingL5--;
        }
        if (grid[row][7] === "EMPTY") {
            grid[row][7] = "L5";
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

    // Adjust the last row of PPP if needed
    for (let col = 0; col < columns; col++) {
        if (["L4", "L5"].includes(grid[rows - 1][col])) {
            for (let swapRow = pppStartRow; swapRow < pppStartRow + 2; swapRow++) {
                if (grid[swapRow][col] === "PPP") {
                    [grid[swapRow][col], grid[rows - 1][col]] = [grid[rows - 1][col], grid[swapRow][col]];
                    break;
                }
            }
        }
    }

    // Flip grid vertically and render it
    const flippedGrid = grid.reverse();
    renderGrid(flippedGrid);
}

function renderGrid(grid) {
    const gridOutput = document.getElementById("grid-output");
    if (!gridOutput) {
        console.error("Grid output element not found");
        return;
    }

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
    console.log("Grid rendered successfully");
}
