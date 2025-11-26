// UI functions using Bootstrap

// Get Bootstrap color class based on grade
function getColorClass(value) {
  if (value < 5) return "danger";
  if (value >= 5 && value < 6) return "warning";
  return "success";
}

// Display grades
function displayGrades(gradesAvr) {
  // Display overall average
  const overallAvg = gradesAvr.all_avr;
  const overallAvgElement = document.getElementById("overallAverage");
  overallAvgElement.textContent = overallAvg.toFixed(1);
  overallAvgElement.className = `overall-average text-${getColorClass(
    overallAvg
  )}`;

  // Display grades by period
  const gradesContent = document.getElementById("gradesContent");
  gradesContent.innerHTML = "";

  for (const period in gradesAvr) {
    if (period === "all_avr") continue;

    const subjects = gradesAvr[period];
    const periodAvr = subjects.period_avr;

    const periodCard = document.createElement("div");
    periodCard.className = "card shadow-sm mb-3";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Period title and average
    const periodHeader = document.createElement("div");
    periodHeader.className =
      "d-flex justify-content-between align-items-center mb-3";
    periodHeader.innerHTML = `
      <h5 class="card-title mb-0">Period ${period}</h5>
      <span class="badge bg-${getColorClass(
        periodAvr
      )} period-average">${periodAvr.toFixed(1)}</span>
    `;
    cardBody.appendChild(periodHeader);

    // Subjects
    for (const subject in subjects) {
      if (subject === "period_avr") continue;

      const data = subjects[subject];

      const subjectDiv = document.createElement("div");
      subjectDiv.className = "mb-3 p-3 bg-light rounded";

      // Subject name
      const subjectName = document.createElement("h6");
      subjectName.className = "mb-2";
      subjectName.textContent = subject;
      subjectDiv.appendChild(subjectName);

      // Grades badges
      const gradesDiv = document.createElement("div");
      gradesDiv.className = "mb-2";
      data.grades.forEach((grade) => {
        const badge = document.createElement("span");
        badge.className = `badge bg-${getColorClass(
          grade.decimalValue
        )} grade-badge me-1`;
        badge.textContent = grade.decimalValue;
        badge.style.cursor = "pointer";
        badge.onclick = () => showGradeModal(grade);
        gradesDiv.appendChild(badge);
      });
      subjectDiv.appendChild(gradesDiv);

      // Average and needed grade
      const avgRow = document.createElement("div");
      avgRow.className = "d-flex gap-2 flex-wrap";

      const avgBadge = document.createElement("span");
      avgBadge.className = `badge bg-${getColorClass(data.avr)} fs-6`;
      avgBadge.textContent = `Average: ${data.avr.toFixed(1)}`;
      avgRow.appendChild(avgBadge);

      if (data.neededFor6 !== null) {
        const neededBadge = document.createElement("span");
        neededBadge.className = "badge bg-info fs-6";
        neededBadge.textContent = `Need: ${data.neededFor6.toFixed(1)} for 6.0`;
        avgRow.appendChild(neededBadge);
      }

      subjectDiv.appendChild(avgRow);
      cardBody.appendChild(subjectDiv);
    }

    periodCard.appendChild(cardBody);
    gradesContent.appendChild(periodCard);
  }
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById("errorMessage");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

// Hide error message
function hideError() {
  const errorElement = document.getElementById("errorMessage");
  errorElement.style.display = "none";
}

// Show/hide pages
function showLoginPage() {
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("gradesPage").style.display = "none";
}

function showGradesPage() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("gradesPage").style.display = "block";
}

// Logout function
function logout() {
  showLoginPage();
  document.getElementById("loginForm").reset();
  hideError();
}

// Show grade details modal
function showGradeModal(grade) {
  document.getElementById("modalGrade").textContent = grade.decimalValue;
  document.getElementById("modalDate").textContent = grade.evtDate;
  document.getElementById("modalComponent").textContent = grade.componentDesc;
  document.getElementById("modalTeacher").textContent = grade.teacherName;
  document.getElementById("modalNotes").textContent =
    grade.notesForFamily || "No notes";

  const modal = new bootstrap.Modal(document.getElementById("gradeModal"));
  modal.show();
}

// Initialize UI event listeners
function initializeUI() {
  // Handle form submission
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const userId = document.getElementById("user_id").value;
    const userPass = document.getElementById("user_pass").value;
    const loginButton = document.getElementById("loginButton");
    const loginSpinner = document.getElementById("loginSpinner");

    // Show loading state
    loginButton.disabled = true;
    loginSpinner.style.display = "inline-block";

    try {
      // Login
      const loginResponse = await login(userId, userPass);
      const token = loginResponse.token;

      if (!token || token === "") {
        throw new Error("Invalid token");
      }

      // Extract student ID (digits only)
      const studentId = userId.replace(/\D/g, "");

      // Get grades
      const grades = await getGrades(studentId, token);

      // Calculate averages
      const gradesAvr = calculateAverages(grades);

      // Display grades
      displayGrades(gradesAvr);

      // Show grades page
      showGradesPage();
    } catch (error) {
      console.error("Error:", error);
      showError(`An error occurred: ${error.message}`);
    } finally {
      // Hide loading state
      loginButton.disabled = false;
      loginSpinner.style.display = "none";
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUI);
} else {
  initializeUI();
}
