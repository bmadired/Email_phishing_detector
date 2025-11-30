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

  const circleContainer = document.getElementById("confidenceCircle");
  const circle = document.querySelector(".progress");
  const confidenceLabel = document.getElementById("confidenceLabel");

  // ⭐ FINAL BACKEND URL SWITCHING (localhost vs Render)
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8000/predict"
      : "https://phishing-detector-backend-o0la.onrender.com/predict";

  analyzeBtn.addEventListener("click", async () => {
    const text = emailTextEl.value.trim();

    if (!text) {
      statusText.textContent = "Please paste an email first.";
      return;
    }

    // Reset UI
    resultSection.classList.add("hidden");
    reasonContainer.classList.add("hidden");
    circleContainer.classList.add("hidden");
    reasonList.innerHTML = "";
    statusText.textContent = "Analyzing...";
    analyzeBtn.disabled = true;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend:", data);

      const label = data.label || "unknown";
      const score = typeof data.score === "number" ? data.score : null;
      const reasons = Array.isArray(data.reasons) ? data.reasons : [];

      // -------------------------------
      // ⭐ Badge Styling Based on Label
      // -------------------------------
      resultBadge.classList.remove("phishing", "legit");

      if (label === "phishing") {
        resultBadge.textContent = "Phishing";
        resultBadge.classList.add("phishing");
        resultMessage.textContent =
          "This email looks dangerous. Be careful before clicking any links or sharing information.";
      } else if (label === "legit") {
        resultBadge.textContent = "Likely Safe";
        resultBadge.classList.add("legit");
        resultMessage.textContent =
          "This email seems safe. Still verify sender identity before taking action.";
      } else {
        resultBadge.textContent = "Unknown";
        resultMessage.textContent =
          "The system could not confidently classify this email.";
      }

      // -------------------------------
      // ⭐ Confidence Circle
      // -------------------------------
      if (score !== null) {
        const pct = Math.round(score * 100);
        confidenceLabel.textContent = pct + "%";
        circleContainer.classList.remove("hidden");

        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (pct / 100) * circumference;

        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = offset;

        // Color logic
        if (pct < 40) {
          circle.style.stroke = "#16a34a"; // green
        } else if (pct < 70) {
          circle.style.stroke = "#f59e0b"; // yellow
        } else {
          circle.style.stroke = "#dc2626"; // red
        }
      }

      // -------------------------------
      // ⭐ Reasons — ONLY IF PHISHING
      // -------------------------------
      if (label === "phishing" && reasons.length > 0) {
        reasonContainer.classList.remove("hidden");
        reasonList.innerHTML = "";

        reasons.forEach((r) => {
          const li = document.createElement("li");
          li.textContent = r;
          reasonList.appendChild(li);
        });
      } else {
        reasonContainer.classList.add("hidden");
        reasonList.innerHTML = "";
      }

      resultSection.classList.remove("hidden");
      statusText.textContent = "Done.";
    } catch (err) {
      console.error("Frontend Error:", err);
      statusText.textContent =
        "Could not analyze the email. The backend may be waking up. Please try again in 10–20 seconds.";
    } finally {
      analyzeBtn.disabled = false;
    }
  });
});
