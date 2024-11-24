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

    const columns = 8; // Fixed number of columns
    const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
    const rows = Math.ceil(totalPeople / columns);

    // Create an empty grid
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Step 1: Place PPP cohort
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

    // Step 2: Place CC cohort above PPP
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

    // Step 3: Assign L1, L2, L3, and L6 in specified columns
    cohorts.L1 = assignCohort("L1", cohorts.L1, 3, 4, ccRow);
    cohorts.L2 = assignCohort("L2", cohorts.L2, 2, 5, ccRow);
    cohorts.L3 = assignCohort("L3", cohorts.L3, 1, 6, ccRow);
    cohorts.L6 = assignCohort("L6", cohorts.L6, 0, 7, ccRow);

    // Step 4: Place L5 in columns 1 and 8, ensuring dynamic placement
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

    // Step 5: Place L4 in remaining empty slots
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

    // Step 6: Flip the grid vertically
    const flippedGrid = grid.reverse();

    // Step 7: Swap L4/L5 in the first row with PPP in the last row
    for (let col = 0; col < columns; col++) {
        const firstRowCell = flippedGrid[0][col];
        const lastRowPPP = flippedGrid[flippedGrid.length - 1][col];

        if ((firstRowCell === "L4" || firstRowCell === "L5") && lastRowPPP === "PPP") {
            flippedGrid[0][col] = "PPP";
            flippedGrid[flippedGrid.length - 1][col] = firstRowCell;
        }
    }

    // Cohort colors
    const colors = {
        PPP: "yellow",
        CC: "blue",
        L1: "gray",
        L2: "lightgray",
        L3: "lightblue",
        L4: "orange",
        L5: "green",
        L6: "tan",
        EMPTY: "white",
    };

    // Step 8: Render the grid as a styled table
    const gridOutput = document.getElementById("grid-output");
    let tableHTML = "<table>";

    flippedGrid.forEach((row, rowIndex) => {
        tableHTML += "<tr>";
        row.forEach(cell => {
            tableHTML += `<td style="background-color: ${colors[cell]};">${cell}</td>`;
        });
        tableHTML += `<td>Line ${rowIndex + 1}</td>`; // Line numbers
        tableHTML += "</tr>";
    });

    tableHTML += "</table>";
    gridOutput.innerHTML = tableHTML;

    // Show the grid to the user
    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
