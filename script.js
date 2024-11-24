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
    // Collect cohort values
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
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Example Logic for PPP placement (replace with your detailed placement rules)
    let remaining_PPP = cohorts.PPP;
    for (let row = rows - 1; row >= 0; row--) {
        for (let col = 0; col < columns; col++) {
            if (remaining_PPP > 0) {
                grid[row][col] = "PPP";
                remaining_PPP--;
            }
        }
    }

    // Flip the grid vertically
    const flippedGrid = grid.reverse();

    // Display the grid
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = flippedGrid
        .map(row => `<div>${row.map(cell => `<span>${cell}</span>`).join(" | ")}</div>`)
        .join("");

    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
