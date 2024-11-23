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

// Event listener for grid generation
document.getElementById("generate-grid").addEventListener("click", generateGrid);

// Function to generate the grid
function generateGrid() {
  const container = document.getElementById("grid-container");
  container.innerHTML = ""; // Clear any existing grid

  // Collect input values for cohorts
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

  const totalPeople = Object.values(cohorts).reduce((sum, val) => sum + val, 0);
  const columns = 8; // Always 8 columns
  const rows = Math.ceil(totalPeople / columns); // Determine number of rows

  // Add column labels (Line A to Line H)
  const columnLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const headerRow = document.createElement("div");
  headerRow.className = "grid-label-row";
  columnLabels.forEach((label) => {
    const labelCell = document.createElement("div");
    labelCell.className = "grid-label";
    labelCell.textContent = `Line ${label}`;
    headerRow.appendChild(labelCell);
  });
  container.appendChild(headerRow);

  // Generate the grid
  let personIndex = 0;
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.className = "grid-row";

    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";

      if (personIndex < totalPeople) {
        const cohort = determineCohort(cohorts, personIndex);
        cell.textContent = cohort;
        cell.style.backgroundColor = getColor(cohort);
        personIndex++;
      } else {
        cell.textContent = "EMPTY";
        cell.style.backgroundColor = "#f0f0f0";
      }

      row.appendChild(cell);
    }

    const rowLabel = document.createElement("div");
    rowLabel.className = "grid-label";
    rowLabel.textContent = `Line ${i + 1}`;
    row.appendChild(rowLabel);

    container.appendChild(row);
  }
}

// Function to determine cohort placement
function determineCohort(cohorts, index) {
  let cumulative = 0;
  for (const [key, value] of Object.entries(cohorts)) {
    cumulative += value;
    if (index < cumulative) return key;
  }
  return "EMPTY";
}

// Function to get color based on cohort
function getColor(cohort) {
  const colors = {
    PPP: "#ffff99",
    CC: "#99ccff",
    L4: "#ffcc99",
    L5: "#99cc99",
    L6: "#cccccc",
    L3: "#99cccc",
    L2: "#ff9966",
    L1: "#ccccff",
    EMPTY: "#f0f0f0",
  };
  return colors[cohort] || "#ffffff";
}
