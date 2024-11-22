const password = "DefileFormations";

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

function generateGrid() {
  const ppp = parseInt(document.getElementById("ppp").value) || 0;
  const l1 = parseInt(document.getElementById("l1").value) || 0;
  const cc = parseInt(document.getElementById("cc").value) || 0;
  const l2 = parseInt(document.getElementById("l2").value) || 0;
  const l3 = parseInt(document.getElementById("l3").value) || 0;
  const l4 = parseInt(document.getElementById("l4").value) || 0;
  const l5 = parseInt(document.getElementById("l5").value) || 0;
  const l6 = parseInt(document.getElementById("l6").value) || 0;

  const totalPopulation = ppp + l1 + cc + l2 + l3 + l4 + l5 + l6;
  const rows = Math.ceil(totalPopulation / 8);
  const grid = Array(rows * 8).fill("EMPTY");

  let index = 0;

  function placeCohort(count, label, styleClass) {
    for (let i = 0; i < count; i++) {
      while (grid[index] !== "EMPTY") index++;
      grid[index] = { label, styleClass };
    }
  }

  // Label Rows and Columns
  const gridHeader = document.getElementById("grid-header");
  gridHeader.innerHTML = "";
  const letters = "ABCDEFGH".split("");
  letters.forEach(letter => {
    const headerCell = document.createElement("div");
    headerCell.className = "column-label";
    headerCell.textContent = `Line ${letter}`;
    gridHeader.appendChild(headerCell);
  });

  const gridBody = document.getElementById("grid-body");
  gridBody.innerHTML = "";

  grid.forEach((cell, idx) => {
    const div = document.createElement("div");
    div.className = `grid-cell ${cell.styleClass}`;
    div.textContent = cell.label;
    gridBody.appendChild(div);
  });
}
