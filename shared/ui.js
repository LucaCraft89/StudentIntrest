// UI functions

// Get color class based on grade
function getColorClass(value) {
  if (value < 5) return "danger";
  if (value >= 5 && value < 6) return "warning";
  return "good";
}

// Display grades
function displayGrades(gradesAvr) {
  // Display overall average
  const overallAvg = gradesAvr.all_avr;
  const overallAvgElement = document.getElementById("overallAverage");
  overallAvgElement.textContent = overallAvg.toFixed(1);
  overallAvgElement.className = `overall-average ${getColorClass(overallAvg)}`;

  // Display grades by period
  const gradesContent = document.getElementById("gradesContent");
  gradesContent.innerHTML = "";

  for (const period in gradesAvr) {
    if (period === "all_avr") continue;

    const subjects = gradesAvr[period];
    const periodAvr = subjects.period_avr;

    const periodSection = document.createElement("div");
    periodSection.className = "period-section";

    const periodTitle = document.createElement("div");
    periodTitle.className = "period-title";
    periodTitle.textContent = `Period ${period}`;
    periodSection.appendChild(periodTitle);

    const periodAverage = document.createElement("div");
    periodAverage.className = `period-average ${getColorClass(periodAvr)}`;
    periodAverage.textContent = periodAvr.toFixed(1);
    periodSection.appendChild(periodAverage);

    for (const subject in subjects) {
      if (subject === "period_avr") continue;

      const data = subjects[subject];
      const row = document.createElement("div");
      row.className = "subject-row";

      const subjectCell = document.createElement("div");
      subjectCell.className = "subject-name";
      subjectCell.textContent = subject;

      const gradesCell = document.createElement("div");
      gradesCell.className = "grades";
      data.grades.forEach((grade) => {
        const badge = document.createElement("span");
        badge.className = `grade-badge bg-${getColorClass(grade.decimalValue)}`;
        badge.textContent = grade.decimalValue;
        badge.onclick = () => showGradeModal(grade);
        gradesCell.appendChild(badge);
      });

      const avgContainer = document.createElement("div");
      avgContainer.className = "average-container";

      const avgCell = document.createElement("div");
      avgCell.className = `subject-average ${getColorClass(data.avr)}`;
      avgCell.textContent = data.avr.toFixed(1);
      avgContainer.appendChild(avgCell);

      // Add needed grade indicator if average < 6.0
      if (data.neededFor6 !== null) {
        const neededSpan = document.createElement("div");
        neededSpan.className = "needed-grade";
        neededSpan.textContent = `Need: ${data.neededFor6.toFixed(1)}`;
        avgContainer.appendChild(neededSpan);
      }

      row.appendChild(subjectCell);
      row.appendChild(gradesCell);
      row.appendChild(avgContainer);
      periodSection.appendChild(row);
    }

    gradesContent.appendChild(periodSection);
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
  document.getElementById("gradeModal").classList.add("show");
}

// Close modal
function closeModal() {
  document.getElementById("gradeModal").classList.remove("show");
}

// Initialize UI event listeners
function initializeUI() {
  // Close modal when clicking outside
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("gradeModal");
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle form submission
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const userId = document.getElementById("user_id").value;
    const userPass = document.getElementById("user_pass").value;
    const loginButton = document.getElementById("loginButton");

    // Show loading state
    loginButton.classList.add("loading");
    loginButton.disabled = true;

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
      loginButton.classList.remove("loading");
      loginButton.disabled = false;
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUI);
} else {
  initializeUI();
}
