document.getElementById("generateFormation").addEventListener("click", () => {
    // Fetch cohort populations dynamically from the user input
    const cohorts = {
        L1: parseInt(document.getElementById("L1").value) || 0,
        L2: parseInt(document.getElementById("L2").value) || 0,
        L3: parseInt(document.getElementById("L3").value) || 0,
        L6: parseInt(document.getElementById("L6").value) || 0,
        L5: parseInt(document.getElementById("L5").value) || 0,
        L4: parseInt(document.getElementById("L4").value) || 0,
        CC: parseInt(document.getElementById("CC").value) || 0,
        PPP: parseInt(document.getElementById("PPP").value) || 0,
    };

    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
    const rows = Math.ceil(totalPeople / columns);
    const totalCells = rows * columns;

    // Create empty grid
    let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Determine PPP placement
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

    // Place CC above PPP
    let remainingCC = cohorts.CC;
    const ccRow = pppStartRow - 1;

    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Helper function for cohort placement
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

    // Place L5 directly after L6
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

    // Fill remaining L5 slots
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

    for (let row = 0; row < rows; row++) {
        for (let col = 1; col < columns - 1; col++) {
            if (remainingL4 <= 0) break;

            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Secondary pass for L4
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingL4 <= 0) break;

            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Adjust last PPP row
    for (let col = 0; col < columns; col++) {
        if (grid[rows - 1][col] === "L4" || grid[rows - 1][col] === "L5") {
            for (let swapRow = pppStartRow; swapRow < Math.min(pppStartRow + 2, rows); swapRow++) {
                if (grid[swapRow][col] === "PPP") {
                    [grid[swapRow][col], grid[rows - 1][col]] = [grid[rows - 1][col], "PPP"];
                    break;
                }
            }
        }
    }

    // Flip the grid vertically
    grid = grid.reverse();

    // Render the grid dynamically
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.innerHTML = ""; // Clear previous grid

    grid.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "grid-row";
        row.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "grid-cell";
            cellDiv.textContent = cell;
            rowDiv.appendChild(cellDiv);
        });
        gridContainer.appendChild(rowDiv);
    });
});
