// Password Validation
function validatePassword() {
    // Get the entered password and error message element
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Check if the entered password matches the correct one
    if (password === "DefileFormations") {
        // Hide the password screen and show the population input screen
        document.getElementById('password-screen').style.display = "none";
        document.getElementById('input-screen').style.display = "block";
    } else {
        // Display an error message for incorrect password
        errorMessage.textContent = "Incorrect Password";
    }
}


// Generate Formation
function generateFormation() {
    const cohorts = {
        PPP: parseInt(document.getElementById("PPP").value),
        L1: parseInt(document.getElementById("L1").value),
        CC: parseInt(document.getElementById("CC").value),
        L2: parseInt(document.getElementById("L2").value),
        L3: parseInt(document.getElementById("L3").value),
        L4: parseInt(document.getElementById("L4").value),
        L5: parseInt(document.getElementById("L5").value),
        L6: parseInt(document.getElementById("L6").value),
    };

    // Convert Python logic into JavaScript
    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
    const rows = Math.ceil(totalPeople / columns);
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    // Apply cohort placement logic
    // (Implement your Python logic in JavaScript here)

    // Flip grid vertically
    const flippedGrid = grid.reverse();

    // Display grid
    const gridOutput = document.getElementById("grid-output");
    gridOutput.innerHTML = flippedGrid
        .map(row => `<div>${row.map(cell => `<span>${cell}</span>`).join(" | ")}</div>`)
        .join("");

    document.getElementById("input-screen").style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
}
