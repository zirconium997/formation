function validatePassword() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Check password validity
    if (password === "DefileFormations") {
        // Hide password screen and show cohort input screen
        document.getElementById('password-screen').style.display = "none";
        document.getElementById('input-screen').style.display = "block";
    } else {
        errorMessage.textContent = "Incorrect Password";
    }
}

function generateFormation() {
    // Fetch cohort values
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

    // Generate initial grid
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));
    let currentRow = 0;
    let currentCol = 0;

    function placeCohort(cohort, count) {
        for (let i = 0; i < count; i++) {
            grid[currentRow][currentCol] = cohort;
            currentCol++;
            if (currentCol === columns) {
                currentCol = 0;
                currentRow++;
            }
        }
    }

    // Step 1: Place cohorts PPP, L1, CC, and L2-L3 normally
    placeCohort("PPP", cohorts.PPP);
    placeCohort("L1", cohorts.L1);
    placeCohort("CC", cohorts.CC);
    placeCohort("L2", cohorts.L2);
    placeCohort("L3", cohorts.L3);

    // Step 2: Handle L4 and L5 placement
    if (cohorts.CC > 0) {
        // Place L4 and L5 aligning with CC's highest row
        placeCohort("L4", cohorts.L4);
        placeCohort("L5", cohorts.L5);
    } else {
        // Flip the grid vertically to start L4/L5 placement after PPP
        const flippedGrid = grid.filter((row) => row.some((cell) => cell === "PPP")).reverse();

        // Determine the row to align with flipped PPP
        currentRow = flippedGrid.length;
        currentCol = 0;

        // Extend grid if necessary
        while (currentRow >= grid.length) {
            grid.push(Array(columns).fill("EMPTY"));
        }

        placeCohort("L4", cohorts.L4);
        placeCohort("L5", cohorts.L5);
    }

    // Step 3: Place L6 last
    placeCohort("L6", cohorts.L6);

    // Display the grid
    displayGrid(grid, rows, columns);
}
