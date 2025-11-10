document.addEventListener("DOMContentLoaded", () => {
  const activitySelect = document.getElementById("activity");
  const emailInput = document.getElementById("email");
  const signupForm = document.getElementById("signup-form");
  let submitBtn = signupForm.querySelector('button[type="submit"]');

  // Ensure there is a message area
  let msgEl = document.getElementById("signup-message");
  if (!msgEl) {
    msgEl = document.createElement("div");
    msgEl.id = "signup-message";
    signupForm.appendChild(msgEl);
  }

  function showMessage(text, type = "info") {
    msgEl.textContent = text;
    msgEl.className = type; // allow CSS to style .info, .error, .success
  }

  // Load activities and populate dropdown
  fetch("/activities")
    .then((res) => res.json())
    .then((data) => {
      activitySelect.innerHTML = "";
      Object.keys(data).forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        activitySelect.appendChild(opt);
      });
    })
    .catch(() => showMessage("Failed to load activities", "error"));

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const activity = activitySelect.value;
    const email = (emailInput.value || "").trim();

    if (!email) {
      showMessage("Please enter your email.", "error");
      return;
    }
    if (!activity) {
      showMessage("Please select an activity.", "error");
      return;
    }

    // Disable to prevent double submissions
    submitBtn.disabled = true;
    showMessage("Signing up...", "info");

    try {
      const resp = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );

      if (resp.ok) {
        const body = await resp.json();
        showMessage(body.message || "Signed up successfully.", "success");
        // Keep disabled after success to avoid duplicate registrations from the same browser session
        submitBtn.disabled = true;
      } else {
        // Try to parse JSON error message
        let errText = "Signup failed";
        try {
          const errBody = await resp.json();
          errText = errBody.detail || errBody.message || errText;
        } catch (_) {
          // ignore JSON parse error
        }
        showMessage(errText, "error");
        // Re-enable to allow retry
        submitBtn.disabled = false;
      }
    } catch (err) {
      showMessage("Network error while signing up.", "error");
      submitBtn.disabled = false;
    }
  });
});
