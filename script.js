document.addEventListener("DOMContentLoaded", function() {
    const cohorts = {
        "L1": 13,
        "L2": 10,
        "L3": 12,
        "L6": 16,
        "L5": 14,
        "L4": 25,
        "CC": 7,
        "PPP": 23
    };

    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
    const rows = Math.ceil(totalPeople / columns);

    let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Place PPP cohort
    let pppRows = Math.ceil(cohorts["PPP"] / columns);
    let pppStartRow = rows - pppRows;
    let remainingPPP = cohorts["PPP"];
    for (let row = pppStartRow; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (remainingPPP > 0) {
                grid[row][col] = "PPP";
                remainingPPP--;
            }
        }
    }

    // Place CC cohort above PPP
    let ccRow = pppStartRow - 1;
    let remainingCC = cohorts["CC"];
    for (let col = 0; col < columns; col++) {
        if (remainingCC > 0) {
            grid[ccRow][col] = "CC";
            remainingCC--;
        }
    }

    // Function to assign cohorts to specific columns
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

    // Place primary cohorts (L1-L6)
    cohorts["L1"] = assignCohort("L1", cohorts["L1"], 3, 4, ccRow);
    cohorts["L2"] = assignCohort("L2", cohorts["L2"], 2, 5, ccRow);
    cohorts["L3"] = assignCohort("L3", cohorts["L3"], 1, 6, ccRow);
    cohorts["L6"] = assignCohort("L6", cohorts["L6"], 0, 7, ccRow);

    // Place L5 starting after L6
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

    // Place L4 in remaining empty slots
    let remainingL4 = cohorts["L4"];
    for (let row = 0; row < ccRow; row++) {
        for (let col = 1; col < columns - 1; col++) {
            if (remainingL4 <= 0) break;
            if (grid[row][col] === "EMPTY") {
                grid[row][col] = "L4";
                remainingL4--;
            }
        }
    }

    // Place the grid in the HTML
    const gridContainer = document.getElementById("grid-container");
    grid.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("grid-row");
        row.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("grid-cell");
            cellDiv.textContent = cell;
            rowDiv.appendChild(cellDiv);
        });
        gridContainer.appendChild(rowDiv);
    });

    // Display the cohort counts
    const cohortList = document.getElementById("cohort-list");
    for (let cohort in cohorts) {
        const listItem = document.createElement("li");
        listItem.textContent = `${cohort}: Initial = ${cohorts[cohort]}, Placed = ${grid.flat().filter(cell => cell === cohort).length}`;
        cohortList.appendChild(listItem);
    }
});
