const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/predict", (req, res) => {
  const text = req.body.text || "";

  const python = spawn("python3", ["python/predict.py"], {
    cwd: path.join(__dirname)
  });

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
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Prediction failed" });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
