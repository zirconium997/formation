document.addEventListener("DOMContentLoaded", () => {
    const PASSWORD = "DefileFormations";

    const passwordScreen = document.getElementById("password-screen");
    const passwordForm = document.getElementById("password-form");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");

    const cohortInputs = document.getElementById("cohort-inputs");
    const gridContainer = document.getElementById("grid-container");
    const generateGridButton = document.getElementById("generate-grid");
    const gridTable = document.getElementById("grid-table");

    // Handle password submission
    passwordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (passwordInput.value === PASSWORD) {
            passwordScreen.classList.add("hidden");
            cohortInputs.classList.remove("hidden");
        } else {
            errorMessage.classList.remove("hidden");
        }
    });

    // Generate grid functionality
    generateGridButton.addEventListener("click", () => {
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

        const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
        const columns = 8;
        const rows = Math.ceil(totalPeople / columns);

        let grid = Array.from({ length: rows }, () => Array(columns).fill(null));
        let emptySlots = rows * columns - totalPeople;

        const placeCohorts = (label, count, colStart, colEnd) => {
            let remaining = count;
            for (let row = rows - 1; row >= 0 && remaining > 0; row--) {
                for (let col = colStart; col <= colEnd && remaining > 0; col++) {
                    if (grid[row][col] === null) {
                        grid[row][col] = label;
                        remaining--;
                    }
                }
            }
            return remaining;
        };

        // Place cohorts based on rules
        cohorts.L6 = placeCohorts("L6", cohorts.L6, 0, 7);
        cohorts.L5 = placeCohorts("L5", cohorts.L5, 0, 7);
        cohorts.L1 = placeCohorts("L1", cohorts.L1, 3, 4);
        cohorts.L2 = placeCohorts("L2", cohorts.L2, 2, 5);
        cohorts.L3 = placeCohorts("L3", cohorts.L3, 1, 6);
        cohorts.PPP = placeCohorts("PPP", cohorts.PPP, 0, 7);
        cohorts.CC = placeCohorts("CC", cohorts.CC, 0, 7);

        // Fill empty slots symmetrically
        grid.forEach((row, rowIndex) => {
            row.forEach((slot, colIndex) => {
                if (slot === null) grid[rowIndex][colIndex] = "EMPTY";
            });
        });

        // Render grid
        gridTable.innerHTML = "";

        // Add header row
        const headerRow = document.createElement("tr");
        for (let i = 0; i < columns; i++) {
            const th = document.createElement("th");
            th.textContent = `Line ${String.fromCharCode(65 + i)}`;
            headerRow.appendChild(th);
        }
        gridTable.appendChild(headerRow);

        // Add rows
        grid.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
                const td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            });
            gridTable.appendChild(tr);
        });

        // Display grid
        gridContainer.classList.remove("hidden");
    });
});
