// Password Protection
function checkPassword() {
  const correctPassword = "QBADefile";
  const enteredPassword = document.getElementById("password").value;

  if (enteredPassword === correctPassword) {
    document.getElementById("password-prompt").style.display = "none"; // Hide the password prompt
    document.getElementById("main-content").style.display = "block"; // Show main content
    initializeGrid(); // Initialize grid formation after successful login
  } else {
    document.getElementById("error-message").style.display = "block"; // Show error message
  }
}

// Grid Formation Logic (Move your grid logic into a function for modularity)
function initializeGrid() {
  // Add your grid generation logic here.
  // For example:
  const gridOutput = document.getElementById("grid-output");
  gridOutput.innerHTML = "<p>Your generated grid will appear here.</p>";
}
