// Password Protection
function checkPassword() {
  const correctPassword = "QBADefile";
  const enteredPassword = document.getElementById("password").value;

  if (enteredPassword === correctPassword) {
    document.getElementById("password-prompt").style.display = "none"; // Hide the password prompt
    document.getElementById("main-content").style.display = "block"; // Show main content
  } else {
    document.getElementById("error-message").style.display = "block"; // Show error message
  }
}

// Generate Grid Based on Cohort Inputs
function generateGrid() {
  // Get cohort populations from inputs
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

  // Validate total population
  const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
  const columns = 8;
  const rows = Math.ceil(totalPeople / columns);

  // Create grid
  const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

  // Populate grid logic (placeholders for now)
  let currentCohortIndex = 0;
  const cohortNames = Object.keys(cohorts);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (cohorts[cohortNames[currentCohortIndex]] > 0) {
        grid[i][j] = cohortNames[currentCohortIndex];
        cohorts[cohortNames[currentCohortIndex]]--;
      } else {
        currentCohortIndex++;
        if (currentCohortIndex < cohortNames.length) {
          grid[i][j] = cohortNames[currentCohortIndex];
          cohorts[cohortNames[currentCohortIndex]]--;
        }
      }
    }
  }

  // Display grid
  const gridOutput = document.getElementById("grid-output");
  gridOutput.innerHTML = `
    <h3>Generated Grid:</h3>
    <table border="1">
      ${grid.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
    </table>
  `;
}
