function generateGrid() {
  const cohorts = {
    L1: parseInt(document.getElementById("L1").value) || 0,
    L2: parseInt(document.getElementById("L2").value) || 0,
    L3: parseInt(document.getElementById("L3").value) || 0,
    L4: parseInt(document.getElementById("L4").value) || 0,
    L5: parseInt(document.getElementById("L5").value) || 0,
    L6: parseInt(document.getElementById("L6").value) || 0,
    CC: parseInt(document.getElementById("CC").value) || 0,
    PPP: parseInt(document.getElementById("PPP").value) || 0,
  };

  const columns = 8;
  const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
  const rows = Math.ceil(totalPeople / columns);
  const totalCells = rows * columns;
  const initialGaps = totalCells - totalPeople;

  const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

  // Calculate PPP placement
  const pppRows = Math.ceil(cohorts.PPP / columns);
  const pppStartRow = rows - pppRows;

  let remainingPPP = cohorts.PPP;
  for (let row = pppStartRow; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (remainingPPP > 0) {
        grid[row][col] = "PPP";
        remainingPPP--;
      }
    }
  }

  // Place CC in row above PPP
  const ccRow = pppStartRow - 1;
  let remainingCC = cohorts.CC;
  for (let col = 0; col < columns; col++) {
    if (remainingCC > 0) {
      grid[ccRow][col] = "CC";
      remainingCC--;
    }
  }

  // Function to assign cohorts to columns with constraints
  function assignCohort(cohort, count, col1, col2, stopRow) {
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

  // Assign cohorts to specified positions
  cohorts.L1 = assignCohort("L1", cohorts.L1, 3, 4, rows);
  cohorts.L2 = assignCohort("L2", cohorts.L2, 2, 5, rows);
  cohorts.L3 = assignCohort("L3", cohorts.L3, 1, 6, rows);
  cohorts.L6 = assignCohort("L6", cohorts.L6, 0, 7, rows);

  // Assign L5 directly after L6, respecting gaps and constraints
  let remainingL5 = cohorts.L5;
  for (let row = 0; row < rows; row++) {
    if (remainingL5 <= 0) break;
    if (row < ccRow && grid[row][0] === "EMPTY") {
      grid[row][0] = "L5";
      remainingL5--;
    }
    if (remainingL5 > 0 && row < ccRow && grid[row][7] === "EMPTY") {
      grid[row][7] = "L5";
      remainingL5--;
    }
  }

  // Place L4 in remaining gaps
  let remainingL4 = cohorts.L4;
  for (let row = 0; row < rows; row++) {
    for (let col = 1; col < columns - 1; col++) {
      if (remainingL4 <= 0) break;
      if (grid[row][col] === "EMPTY") {
        grid[row][col] = "L4";
        remainingL4--;
      }
    }
  }

  // Handle PPP rules
  for (let col = 0; col < columns; col++) {
    for (let row = pppStartRow; row < rows; row++) {
      if (["L4", "L5"].includes(grid[row][col])) {
        const pppCount = grid[row].filter(cell => cell === "PPP").length;
        if (pppCount > 5) {
          for (let ccCol = 0; ccCol < columns; ccCol++) {
            if (grid[ccRow][ccCol] === "CC") {
              grid[ccRow][ccCol] = grid[row][col];
              grid[row][col] = "CC";
              break;
            }
          }
        }
      }
    }
  }

  // Display the grid
  const gridOutput = document.getElementById("grid-output");
  gridOutput.innerHTML = `
    <h3>Generated Grid:</h3>
    <table border="1">
      ${grid.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
    </table>
  `;
}
