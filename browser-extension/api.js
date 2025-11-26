// API functions using the environment-aware fetch

// Login function
async function login(userId, userPass) {
  const body = {
    ident: null,
    pass: userPass,
    uid: userId,
  };

  try {
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
  } catch (error) {
    // Check for network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Cannot connect to server. Check your internet connection or Cloudflare tunnel configuration."
      );
    }
    throw error;
  }
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
