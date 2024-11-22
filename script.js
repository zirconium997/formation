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

    // Password protection logic
    passwordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (passwordInput.value === PASSWORD) {
            passwordScreen.classList.add("hidden");
            cohortInputs.classList.remove("hidden");
        } else {
            errorMessage.classList.remove("hidden");
        }
    });

    // Grid generation logic
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

        let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));
        let currentRow = 0;
        let currentColumn = 0;

        const placeCohorts = (label, count) => {
            for (let i = 0; i < count; i++) {
                grid[currentRow][currentColumn] = label;
                currentColumn++;
                if (currentColumn >= columns) {
                    currentColumn = 0;
                    currentRow++;
                }
            }
        };

        // Place cohorts based on rules
        placeCohorts("PPP", cohorts.PPP);
        placeCohorts("CC", cohorts.CC);
        placeCohorts("L1", cohorts.L1);
        placeCohorts("L2", cohorts.L2);
        placeCohorts("L3", cohorts.L3);
        placeCohorts("L4", cohorts.L4);
        placeCohorts("L5", cohorts.L5);
        placeCohorts("L6", cohorts.L6);

        // Render grid
        gridTable.innerHTML = grid
            .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`)
            .join("");

        gridContainer.classList.remove("hidden");
    });
});
