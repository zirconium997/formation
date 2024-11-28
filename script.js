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

    // Generate a grid structure
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));
    let currentCohort = Object.keys(cohorts);
    let personIdx = 0;

    // Place people in the grid
    currentCohort.forEach((cohort) => {
        for (let i = 0; i < cohorts[cohort]; i++) {
            const row = Math.floor(personIdx / columns);
            const col = personIdx % columns;
            grid[row][col] = cohort;
            personIdx++;
        }
    });

    // Display the grid
    displayGrid(grid, rows, columns);
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
