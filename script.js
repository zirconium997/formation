document.addEventListener("DOMContentLoaded", function () {
    // Password protection
    const correctPassword = "DefileForm4tion";
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
        for (let col = 0; col < colu
