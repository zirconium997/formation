// Password for accessing the main content
const password = "DefileFormations";

// Event listener for password submission
document.getElementById("password-submit").addEventListener("click", () => {
  const inputPassword = document.getElementById("password-input").value;
  const errorMessage = document.getElementById("password-error");

  if (inputPassword === password) {
    document.getElementById("password-modal").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  } else {
    errorMessage.style.display = "block";
  }
});

document.getElementById("password-input").addEventListener("input", () => {
  document.getElementById("password-error").style.display = "none";
});

document.getElementById("generate").addEventListener("click", function () {
  // Fetch cohort sizes from inputs
  const cohorts = {
    PPP: parseInt(document.getElementById("PPP").value) || 0,
    CC: parseInt(document.getElementById("CC").value) || 0,
    L1: parseInt(document.getElementById("L1").value) || 0,
    L2: parseInt(document.getElementById("L2").value) || 0,
    L3: parseInt(document.getElementById("L3").value) || 0,
    L4: parseInt(document.getElementById("L4").value) || 0,
    L5: parseInt(document.getElementById("L5").value) || 0,
    L6: parseInt(document.getElementById("L6").value) || 0,
  };

  const columns = 8;
  const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
  const rows = Math.ceil(totalPeople / columns);
  const totalCells = rows * columns;
  const initialGaps = totalCells - totalPeople;

  // Create an empty grid
  let grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

  // Placement Functions
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

  // Place PPP
  let remainingPPP = cohorts.PPP;
  for (let row = rows - Math.ceil(cohorts.PPP / columns); row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (remainingPPP > 0) {
        grid[row][col] = "PPP";
        remainingPPP--;
      }
    }
  }

  // Place CC
  let remainingCC = cohorts.CC;
  const ccRow = rows - Math.ceil(cohorts.PPP / columns) - 1;
  for (let col = 0; col < columns; col++) {
    if (remainingCC > 0) {
      grid[ccRow][col] = "CC";
      remainingCC--;
    }
  }

  // Place other cohorts
  cohorts.L1 = placeCohort("L1", cohorts.L1, 3, 4, rows);
  cohorts.L2 = placeCohort("L2", cohorts.L2, 2, 5, rows);
  cohorts.L3 = placeCohort("L3", cohorts.L3, 1, 6, rows);
  cohorts.L6 = placeCohort("L6", cohorts.L6, 0, 7, rows);

  // Fill remaining slots with L4
  let remainingL4 = cohorts.L4;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (remainingL4 > 0 && grid[row][col] === "EMPTY") {
        grid[row][col] = "L4";
        remainingL4--;
      }
    }
  }

  // Flip the grid vertically
  grid.reverse();

  // Render the grid
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = ""; // Clear previous grid
  grid.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = `cell ${cell}`;
      cellDiv.textContent = cell;
      gridContainer.appendChild(cellDiv);
    });
  });
});
