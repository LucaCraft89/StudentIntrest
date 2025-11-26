// UI functions using Bootstrap

// Session management
const SESSION_KEY = "cvv_session";

function saveSession(userId, token, studentId) {
  const session = { userId, token, studentId, timestamp: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;

  const session = JSON.parse(sessionData);
  // Session expires after 24 hours
  const expirationTime = 24 * 60 * 60 * 1000;
  if (Date.now() - session.timestamp > expirationTime) {
    clearSession();
    return null;
  }
  return session;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

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
    periodHeader.className = "mb-3 pb-3 border-bottom";
    periodHeader.innerHTML = `
      <h5 class="card-title mb-2">Period ${period}</h5>
      <span class="badge bg-${getColorClass(
        periodAvr
      )} fs-6">Period Average: ${periodAvr.toFixed(1)}</span>
    `;
    cardBody.appendChild(periodHeader);

    // Subjects container with responsive grid
    const subjectsContainer = document.createElement("div");
    subjectsContainer.className = "row g-3";

    for (const subject in subjects) {
      if (subject === "period_avr") continue;

      const data = subjects[subject];

      // Each subject is its own responsive card
      const subjectCol = document.createElement("div");
      subjectCol.className = "col-12 col-md-6 col-lg-4";

      const subjectCard = document.createElement("div");
      subjectCard.className = "card h-100";

      const subjectCardBody = document.createElement("div");
      subjectCardBody.className = "card-body";

      // Subject name
      const subjectName = document.createElement("h6");
      subjectName.className = "card-subtitle mb-3 text-muted";
      subjectName.textContent = subject;
      subjectCardBody.appendChild(subjectName);

      // Grades badges
      const gradesDiv = document.createElement("div");
      gradesDiv.className = "mb-3";
      data.grades.forEach((grade) => {
        const badge = document.createElement("span");
        badge.className = `badge bg-${getColorClass(
          grade.decimalValue
        )} me-1 mb-1`;
        badge.textContent = grade.decimalValue;
        badge.style.cursor = "pointer";
        badge.onclick = () => showGradeModal(grade);
        gradesDiv.appendChild(badge);
      });
      subjectCardBody.appendChild(gradesDiv);

      // Average badge - full width
      const avgBadge = document.createElement("div");
      avgBadge.className = `alert alert-${getColorClass(
        data.avr
      )} mb-2 py-2 text-center fw-bold`;
      avgBadge.textContent = `Average: ${data.avr.toFixed(1)}`;
      subjectCardBody.appendChild(avgBadge);

      // Needed grade badge - full width
      if (data.neededFor6 !== null) {
        const neededBadge = document.createElement("div");
        neededBadge.className = "alert alert-info mb-0 py-2 text-center";
        neededBadge.textContent = `Need: ${data.neededFor6.toFixed(1)} for 6.0`;
        subjectCardBody.appendChild(neededBadge);
      }

      subjectCard.appendChild(subjectCardBody);
      subjectCol.appendChild(subjectCard);
      subjectsContainer.appendChild(subjectCol);
    }

    cardBody.appendChild(subjectsContainer);
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
  clearSession();
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

// Load grades from session
async function loadFromSession() {
  const session = getSession();
  if (!session) return false;

  try {
    // Get grades using saved token
    const grades = await getGrades(session.studentId, session.token);

    // Calculate averages
    const gradesAvr = calculateAverages(grades);

    // Display grades
    displayGrades(gradesAvr);

    // Show grades page
    showGradesPage();
    return true;
  } catch (error) {
    console.error("Session expired or invalid:", error);
    clearSession();
    return false;
  }
}

// Initialize UI event listeners
function initializeUI() {
  // Try to load from session on page load
  loadFromSession().catch((err) =>
    console.error("Failed to load session:", err)
  );

  // Logout button event listener
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

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

      // Save session
      saveSession(userId, token, studentId);

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
