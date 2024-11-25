function validatePassword() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    if (password === "DefileFormations") {
        document.getElementById('password-screen').style.display = "none";
        document.getElementById('input-screen').style.display = "block";
    } else {
        errorMessage.textContent = "Incorrect Password";
    }
}

function generateFormation() {
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
    const totalPeople = Object.values(cohorts).reduce((a, b) => a + b, 0);
    const rows = Math.ceil(totalPeople / columns);
    const grid = Array.from({ length: rows }, () => Array(columns).fill("EMPTY"));

    let currentCohort = Object.keys(cohorts);
    let personIdx = 0;

    currentCohort.forEach(); // Inserting grid logic (step-by-step placement rules remain)
  
}
