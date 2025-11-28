// frontend/script.js
document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const emailTextEl = document.getElementById("emailText");
  const statusText = document.getElementById("statusText");

  const resultSection = document.getElementById("resultSection");
  const resultBadge = document.getElementById("resultBadge");
  const resultMessage = document.getElementById("resultMessage");
  const reasonContainer = document.getElementById("reasonContainer");
  const reasonList = document.getElementById("reasonList");

  // NEW confidence circle elements
  const circleContainer = document.getElementById("confidenceCircle");
  const circle = document.querySelector(".progress");
  const confidenceLabel = document.getElementById("confidenceLabel");

  const API_URL = "http://localhost:8000/predict";

  analyzeBtn.addEventListener("click", async () => {
    const text = emailTextEl.value.trim();

    if (!text) {
      statusText.textContent = "Please paste an email first.";
      return;
    }

    // Reset UI
    resultSection.classList.add("hidden");
    reasonContainer.classList.add("hidden");
    reasonList.innerHTML = "";
    circleContainer.classList.add("hidden");
    statusText.textContent = "Analyzing...";
    analyzeBtn.disabled = true;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const label = data.label || "unknown";
      const score = typeof data.score === "number" ? data.score : null;
      const reasons = Array.isArray(data.reasons) ? data.reasons : [];

      // Update badge style
      resultBadge.classList.remove("phishing", "legit");
      if (label.toLowerCase() === "phishing") {
        resultBadge.textContent = "Phishing";
        resultBadge.classList.add("phishing");
        resultMessage.textContent =
          "This email looks suspicious. Be careful before clicking any links or sharing information.";
      } else if (label.toLowerCase() === "legit") {
        resultBadge.textContent = "Likely Safe";
        resultBadge.classList.add("legit");
        resultMessage.textContent =
          "This email looks reasonably safe, but always double-check the sender and links.";
      } else {
        resultBadge.textContent = "Unknown";
        resultMessage.textContent =
          "The system could not confidently classify this email.";
      }

      // ---------------------------------------------
      // ✅ NEW CONFIDENCE CIRCLE LOGIC
      // ---------------------------------------------
      if (score !== null) {
        const pct = Math.round(score * 100);
        confidenceLabel.textContent = pct + "%";

        // Show the circle
        circleContainer.classList.remove("hidden");

        // Animation math
        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (pct / 100) * circumference;

        // Apply stroke animation
        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = offset;

        // Colors based on percentage
        if (pct < 30) {
          circle.style.stroke = "#16a34a"; // green
        } else if (pct < 70) {
          circle.style.stroke = "#f59e0b"; // yellow
        } else {
          circle.style.stroke = "#dc2626"; // red
        }
      }

      // Reasons
      if (reasons.length > 0) {
        reasonContainer.classList.remove("hidden");
        reasons.forEach((reason) => {
          const li = document.createElement("li");
          li.textContent = reason;
          reasonList.appendChild(li);
        });
      }

      resultSection.classList.remove("hidden");
      statusText.textContent = "Done.";
    } catch (err) {
      console.error(err);
      statusText.textContent =
        "Could not analyze the email. Check if the backend is running.";
    } finally {
      analyzeBtn.disabled = false;
    }
  });
});
