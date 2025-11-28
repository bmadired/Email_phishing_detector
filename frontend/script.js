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

  // Confidence disk
  const circleContainer = document.getElementById("confidenceCircle");
  const circle = document.querySelector(".progress");
  const confidenceLabel = document.getElementById("confidenceLabel");

  // 👉 Render backend endpoint
  const API_URL = "https://phishing-detector-backend-o0la.onrender.com/predict";

  analyzeBtn.addEventListener("click", async () => {
    const text = emailTextEl.value.trim();

    if (!text) {
      statusText.textContent = "Please paste an email first.";
      return;
    }

    // Reset UI before each request
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
          "Content-Type": "application/json",
          "Accept": "application/json"
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

      // 🔵 --- Badge Styling & Result Message ---
      resultBadge.classList.remove("phishing", "legit");

      if (label === "phishing") {
        resultBadge.textContent = "Phishing";
        resultBadge.classList.add("phishing");
        resultMessage.textContent =
          "This email looks suspicious. Be careful before clicking any links or sharing information.";
      } 
      else if (label === "legit") {
        resultBadge.textContent = "Likely Safe";
        resultBadge.classList.add("legit");
        resultMessage.textContent =
          "This email looks reasonably safe, but always double-check the sender and links.";
      } 
      else {
        resultBadge.textContent = "Unknown";
        resultMessage.textContent =
          "The system could not confidently classify this email.";
      }

      // 🔵 --- Confidence Disk ---
      if (score !== null) {
        const pct = Math.round(score * 100);
        confidenceLabel.textContent = pct + "%";
        circleContainer.classList.remove("hidden");

        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (pct / 100) * circumference;

        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = offset;

        if (pct < 30) {
          circle.style.stroke = "#16a34a"; // green
        } else if (pct < 70) {
          circle.style.stroke = "#f59e0b"; // yellow
        } else {
          circle.style.stroke = "#dc2626"; // red
        }
      }

      // 🔵 --- Reasons List ---
      if (reasons.length > 0) {
        reasonContainer.classList.remove("hidden");
        reasons.forEach((reason) => {
          const li = document.createElement("li");
          li.textContent = reason;
          reasonList.appendChild(li);
        });
      }

      // Show results
      resultSection.classList.remove("hidden");
      statusText.textContent = "Done.";
    } 
    catch (err) {
      console.error("Frontend Error:", err);
      statusText.textContent =
        "Could not analyze the email. The backend may be sleeping (Render Free Tier). Try again in 20 seconds.";
    } 
    finally {
      analyzeBtn.disabled = false;
    }
  });
});
