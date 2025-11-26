// API functions using the environment-aware fetch

// Login function
async function login(userId, userPass) {
  const body = {
    ident: null,
    pass: userPass,
    uid: userId,
  };

  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMsg = `Login failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMsg += ` - ${errorData.error}`;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    throw new Error(errorMsg);
  }

  return await response.json();
}

// Get grades function
async function getGrades(studentId, token) {
  const response = await apiFetch(`/students/${studentId}/grades`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Z-Auth-Token": token,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch grades: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}
