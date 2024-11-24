function validatePassword() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    if (password === "DefileFormations") {
        document.getElementById('password-screen').style.display = "none";
        document.getElementById('input-screen').style.display = "block";
    } else {
        errorMessage.textContent = "Incorrect Password";
    }
}

function generateFormation() {
    // Get user inputs for cohort sizes
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

    // Create an empty grid
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

    // Place CC cohort directly above PPP
    let remainingCC = cohorts.CC;
    const ccRow = pppStartRow - 1;

    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Function to assign cohorts based on the rules
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

    // Place L1, L2, L3, and L6 in specific columns
    cohorts.L1 = assignCohort("L1", cohorts.L1, 3, 4, ccRow);
    cohorts.L2 = assignCohort("L2", cohorts.L2, 2, 5, ccRow);
    cohorts.L3 = assignCohort("L3", cohorts.L3, 1, 6, ccRow);
    cohorts.L6 = assignCohort("L6", cohorts.L6, 0, 7, ccRow);

    // Place L5 directly after L6 in columns 1 and 8
    let remainingL5 = cohorts.L5;
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

    // Fill remaining L5 slots in columns 2 and 7
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
    let remainingL4 = cohorts.L4;
    for (let row = 0; row < ccRow; row++) {
        for (let col = 1; col < columns - 1; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Secondary placement of remaining L4 in any available empty slots
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
    const flippedGrid = grid.reverse();

    // Display the grid
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = flippedGrid
        .map(row => `<div>${row.map(cell => `<span>${cell}</span>`).join(" | ")}</div>`)
        .join("");

    // Show the grid to the user
    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
