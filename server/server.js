const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Auto detect python command
function getPythonCmd() {
  return process.platform === "win32" ? "python" : "python3";
}

// TEST GET route so browser won't show "Cannot GET"
app.get("/predict", (req, res) => {
  res.send("Use POST /predict with JSON { text: \"email text\" }");
});

// MAIN prediction route (POST)
app.post("/predict", (req, res) => {
  const text = req.body.text || "";

  const pythonFile = path.join(__dirname, "python", "predict.py");

  const python = spawn(getPythonCmd(), [pythonFile]);
  let result = "";

  python.stdin.write(JSON.stringify({ text }));
  python.stdin.end();

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  python.on("close", () => {
    try {
      const output = JSON.parse(result);
      res.json(output);
    } catch (error) {
      console.error("JSON error:", error);
      res.status(500).json({ error: "Prediction failed" });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Backend running.");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
