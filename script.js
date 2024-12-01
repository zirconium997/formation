// Event listener to ensure proper loading of password button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-button").addEventListener("click", validatePassword);
});

function validatePassword() {
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (password === "DefileFormations") {
        document.getElementById("password-screen").style.display = "none";
        document.getElementById("input-screen").style.display = "block";
    } else {
        errorMessage.textContent = "Incorrect password. Please try again.";
    }
}

function generateFormation() {
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

    const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
    const columns = 8;
    const rows = Math.ceil(totalPeople / columns);

    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    const order = ["PPP", "CC", "L1", "L2", "L3", "L4", "L5", "L6"];
    for (const cohort of order) {
        let count = cohorts[cohort];
        for (let r = 0; r < rows && count > 0; r++) {
            for (let c = 0; c < columns && count > 0; c++) {
                if (grid[r][c] === "EMPTY") {
                    grid[r][c] = cohort;
                    count--;
                }
            }
        }
    }

    const table = document.getElementById("grid-output");
    table.innerHTML = "";

    grid.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            td.className = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
