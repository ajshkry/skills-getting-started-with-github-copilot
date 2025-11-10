
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

  // Function to load activities and populate dropdown/cards
  function loadActivities() {
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

        // Render activity cards
        const activitiesContainer = document.getElementById("activities-list");
        if (activitiesContainer) {
          activitiesContainer.innerHTML = "";
          Object.entries(data).forEach(([name, activity]) => {
            const card = document.createElement("div");
            card.className = "activity-card";

            // Title
            const title = document.createElement("h4");
            title.textContent = name;
            card.appendChild(title);

            if (activity.description) {
              const desc = document.createElement("p");
              desc.textContent = activity.description;
              card.appendChild(desc);
            }

            // Participants section
            const participantsSection = document.createElement("div");
            participantsSection.className = "participants-section";
            const participantsTitle = document.createElement("h5");
            participantsTitle.textContent = "Participants";
            participantsSection.appendChild(participantsTitle);

            const participantsList = document.createElement("ul");
            participantsList.className = "participants-list";
            if (activity.participants && activity.participants.length > 0) {
              activity.participants.forEach((p) => {
                const li = document.createElement("li");
                li.className = "participant-item";
                // Container for participant name and delete icon
                const span = document.createElement("span");
                span.textContent = p;
                li.appendChild(span);

                // Delete icon
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "delete-participant-btn";
                deleteBtn.innerHTML = "&#128465;"; // Trash can icon
                deleteBtn.title = "Remove participant";
                deleteBtn.style.marginLeft = "8px";
                deleteBtn.onclick = async (e) => {
                  e.stopPropagation();
                  deleteBtn.disabled = true;
                  deleteBtn.innerHTML = "...";
                  try {
                    const resp = await fetch(`/activities/${encodeURIComponent(name)}/unregister?email=${encodeURIComponent(p)}`, { method: "POST" });
                    if (resp.ok) {
                      // Reload activities after removal
                      loadActivities();
                    } else {
                      let errText = "Failed to remove participant.";
                      try {
                        const errBody = await resp.json();
                        errText = errBody.detail || errBody.message || errText;
                      } catch (_) {}
                      alert(errText);
                    }
                  } catch (err) {
                    alert("Network error while removing participant.");
                  }
                  deleteBtn.disabled = false;
                  deleteBtn.innerHTML = "&#128465;";
                };
                li.appendChild(deleteBtn);
                participantsList.appendChild(li);
              });
            } else {
              const li = document.createElement("li");
              li.textContent = "No participants yet.";
              li.style.fontStyle = "italic";
              participantsList.appendChild(li);
            }
            participantsSection.appendChild(participantsList);
            card.appendChild(participantsSection);

            activitiesContainer.appendChild(card);
          });
        }
      })
      .catch(() => showMessage("Failed to load activities", "error"));
  }

  // Initial load
  loadActivities();

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
        // Reload activities to show new participant
        loadActivities();
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
