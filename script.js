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

    // Generate an empty grid structure
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Define the placement order with adjusted rules
    const placementOrder = ["PPP", "L1", "L6", "L5", "CC", "L2", "L3", "L4"];

    let personIdx = 0;

    placementOrder.forEach((cohort) => {
        const count = cohorts[cohort];

        for (let i = 0; i < count; i++) {
            // Calculate the next available row and column
            const row = Math.floor(personIdx / columns);
            const col = personIdx % columns;

            // Place the cohort in the grid
            grid[row][col] = cohort;
            personIdx++;
        }
    });

    // Enforce L6 -> L5 continuity
    ensureL6L5Continuity(grid, rows, columns);

    // Display the updated grid
    displayGrid(grid, rows, columns);
}

function ensureL6L5Continuity(grid, rows, columns) {
    // Find the highest position of L6
    let l6LastRow = -1;
    let l6LastCol = -1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (grid[r][c] === "L6") {
                l6LastRow = r;
                l6LastCol = c;
            }
        }
    }

    // If L6 exists, ensure L5 starts immediately after
    if (l6LastRow !== -1 && l6LastCol !== -1) {
        let l5StartIdx = l6LastRow * columns + l6LastCol + 1;

        // Find and reposition L5
        let l5Queue = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (grid[r][c] === "L5") {
                    l5Queue.push([r, c]);
                    grid[r][c] = "EMPTY";
                }
            }
        }

        // Place L5 right after L6
        for (let i = 0; i < l5Queue.length; i++) {
            const row = Math.floor(l5StartIdx / columns);
            const col = l5StartIdx % columns;

            grid[row][col] = "L5";
            l5StartIdx++;
        }
    }
}

function displayGrid(grid, rows, columns) {
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = ""; // Clear previous content

    const table = document.createElement("table");

    grid.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
            const td = document.createElement("td");

            td.textContent = cell;

            // Add color coding
            switch (cell) {
                case "PPP":
                    td.style.backgroundColor = "yellow";
                    break;
                case "L1":
                    td.style.backgroundColor = "gray";
                    break;
                case "CC":
                    td.style.backgroundColor = "blue";
                    break;
                case "L2":
                    td.style.backgroundColor = "lightgray";
                    break;
                case "L3":
                    td.style.backgroundColor = "lightblue";
                    break;
                case "L4":
                    td.style.backgroundColor = "orange";
                    break;
                case "L5":
                    td.style.backgroundColor = "green";
                    break;
                case "L6":
                    td.style.backgroundColor = "tan";
                    break;
                case "EMPTY":
                    td.style.backgroundColor = "white";
                    break;
                default:
                    td.style.backgroundColor = "white";
            }

            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    gridOutput.appendChild(table);

    // Switch to grid screen
    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
