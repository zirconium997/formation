document.addEventListener("DOMContentLoaded", function () {
    // Password protection
    const correctPassword = "DefileFormation";
    const enteredPassword = prompt("Enter the password to access the site:");

    if (enteredPassword !== correctPassword) {
        alert("Incorrect password.");
        return;
    }

    document.getElementById("content").style.display = "block";

    document.getElementById("generate-grid").addEventListener("click", function () {
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
        const totalPeople = Object.values(cohorts).reduce((sum, count) => sum + count, 0);
        const rows = Math.ceil(totalPeople / columns);

        let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

        // Grid generation logic
        // Place PPP, CC, and other cohorts according to rules...

        grid = grid.reverse(); // Rotate the grid by 180°

        const gridTable = document.getElementById("grid-table");
        gridTable.innerHTML = "";

        // Add column headers
        const headerRow = document.createElement("tr");
        for (let col = 0; col < columns; col++) {
            const headerCell = document.createElement("th");
            headerCell.textContent = `Line ${String.fromCharCode(65 + col)}`;
            headerRow.appendChild(headerCell);
        }
        gridTable.appendChild(headerRow);

        // Populate grid rows
        grid.forEach((row, rowIndex) => {
            const tableRow = document.createElement("tr");
            const rowLabel = document.createElement("th");
            rowLabel.textContent = `Line ${rowIndex + 1}`;
            tableRow.appendChild(rowLabel);

            row.forEach(cell => {
                const tableCell = document.createElement("td");
                tableCell.textContent = cell;
                tableCell.classList.add(cell);
                tableRow.appendChild(tableCell);
            });
            gridTable.appendChild(tableRow);
        });
    });
});
