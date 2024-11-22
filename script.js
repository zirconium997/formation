const password = "DefileFormations";

function validatePassword() {
  const userPassword = document.getElementById("password").value;
  const passwordError = document.getElementById("password-error");
  if (userPassword === password) {
    document.getElementById("password-protection").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  } else {
    passwordError.style.display = "block";
  }
}

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

  placeCohort(ppp, "PPP", "ppp");
  placeCohort(cc, "CC", "cc");
  placeCohort(l6, "L6", "l6");
  placeCohort(l5, "L5", "l5");
  placeCohort(l4, "L4", "l4");
  placeCohort(l3, "L3", "l3");
  placeCohort(l2, "L2", "l2");
  placeCohort(l1, "L1", "l1");

  const gridContainer = document.getElementById("grid-container");
  gridContainer.innerHTML = "";
  grid.forEach((cell, idx) => {
    const div = document.createElement("div");
    div.className = `grid-cell ${cell.styleClass}`;
    div.textContent = cell.label;
    gridContainer.appendChild(div);
  });
}
