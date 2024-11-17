function generateGrid() {
    const cohorts = {
        "L1": parseInt(document.getElementById("L1").value) || 0,
        "L2": parseInt(document.getElementById("L2").value) || 0,
        "L3": parseInt(document.getElementById("L3").value) || 0,
        "L4": parseInt(document.getElementById("L4").value) || 0,
        "L5": parseInt(document.getElementById("L5").value) || 0,
        "L6": parseInt(document.getElementById("L6").value) || 0,
        "CC": parseInt(document.getElementById("CC").value) || 0,
        "PPP": parseInt(document.getElementById("PPP").value) || 0,
    };

    const columns = 8;
    const totalPeople = Object.values(cohorts).reduce((sum, value) => sum + value, 0);
    const rows = Math.ceil(totalPeople / columns);

    let gridHTML = '';
    let peopleLeft = { ...cohorts };

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = getNextCohort(peopleLeft);
            gridHTML += `<div class="cell">${cell || "EMPTY"}</div>`;
        }
    }

    document.getElementById("grid").innerHTML = gridHTML;
}

function getNextCohort(peopleLeft) {
    for (const [cohort, count] of Object.entries(peopleLeft)) {
        if (count > 0) {
            peopleLeft[cohort]--;
            return cohort;
        }
    }
    return null; // No more people left to place
}
