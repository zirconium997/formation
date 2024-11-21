document.addEventListener("DOMContentLoaded", function () {
    // Password protection
    const correctPassword = "DefileFormation";
    const enteredPassword = prompt("Enter the password to access the site:");

    if (enteredPassword !== correctPassword) {
        alert("Incorrect password.");
        return;
    }

    // Show content if password is correct
    document.getElementById("content").style.display = "block";

    // Generate grid on button click
    document.getElementById("generate-grid").addEventListener("click", function () {
        // Read population values
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
        const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
        const rows = Math.ceil(totalPeople / columns);

        let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

        // Place cohorts based on rules
        function placeCohort(cohort, count, col1, col2, stopRow) {
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

        // Clear previous grid and counts
        document.getElementById("grid-container").innerHTML = "";
        document.getElementById("cohort-list").innerHTML = "";

        // Populate cohorts dynamically
        const pppRows = Math.ceil(cohorts.PPP / columns);
        const pppStartRow = rows - pppRows;

        // Place PPP
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
        const ccRow = pppStartRow - 1;
        let remainingCC = cohorts.CC;
        for (let col = 0; col < columns; col++) {
            if (remainingCC > 0) {
                grid[ccRow][col] = "CC";
                remainingCC--;
            }
        }

        // Place other cohorts
        cohorts.L1 = placeCohort("L1", cohorts.L1, 3, 4, ccRow);
        cohorts.L2 = placeCohort("L2", cohorts.L2, 2, 5, ccRow);
        cohorts.L3 = placeCohort("L3", cohorts.L3, 1, 6, ccRow);
        cohorts.L6 = placeCohort("L6", cohorts.L6, 0, 7, ccRow);

        // Place L5 after L6
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

        // Place L4 in remaining slots
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

        // Render grid
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

        // Display cohort counts
        const cohortList = document.getElementById("cohort-list");
        for (const cohort in cohorts) {
            const listItem = document.createElement("li");
            listItem.textContent = `${cohort}: Initial = ${cohorts[cohort]}, Placed = ${grid.flat().filter(cell => cell === cohort).length}`;
            cohortList.appendChild(listItem);
        }
    });
});
