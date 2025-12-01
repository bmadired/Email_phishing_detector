# Email Phishing Detector

## Project Overview
A comprehensive MERN stack application designed to detect phishing emails using a hybrid approach of machine learning and rule-based analysis. The system identifies scams, urgency patterns, and suspicious links with high accuracy, providing a clean, professional user interface for real-time analysis.

## Folder Structure
```
phishing-detector/
├── frontend/           # React application (Vite)
│   ├── src/            # Source code
│   └── public/         # Static assets
├── server/             # Node.js Express backend
│   ├── config/         # Database configuration
│   ├── models/         # MongoDB schemas
│   ├── python/         # ML model and scripts
│   └── routes/         # API endpoints
├── presentation/       # Project presentation files
└── README.md           # Project documentation
```

## Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (optional, for history feature)

## Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8000`

## Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:3000`

## ML Model Setup
1. Ensure Python is installed and added to PATH.
2. Install required Python packages:
   ```bash
   pip install scikit-learn pandas numpy
   ```
3. The model is automatically loaded by the backend server. No separate run command is needed.

## Environment Variables Setup
1. Create a `.env` file in the root directory.
2. Use the provided `.env.example` as a template:
   ```
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/phishing_detector
   MODEL_PATH=./server/model/phishing_model.pkl
   ```

## Running Full Project
1. Start MongoDB (optional).
2. Start Backend: `cd server && npm start`
3. Start Frontend: `cd frontend && npm run dev`
4. Open browser to `http://localhost:3000`

## API Endpoint Usage

### Predict Phishing
- **Endpoint:** `POST /api/predict`
- **Input Format:**
  ```json
  {
    "text": "Your account is suspended. Click here to verify."
  }
  ```
- **Output Example:**
  ```json
  {
    "prediction": "phishing",
    "confidence": 99,
    "reasons": [
      "Contains urgency words",
      "Requests account verification"
    ]
  }
  ```

## Sample Input & Output
**Input:**
"URGENT! Your package delivery failed. Update address immediately."

**Output:**
- **Verdict:** ⚠️ Phishing Detected
- **Confidence:** 89%
- **Reasons:** Mentions package delivery issues, Contains urgency words.

## Screenshots
*(Placeholders - Upload images here)*

![Dashboard Screenshot](path/to/dashboard.png)
*Main Analysis Dashboard*

![Result Screenshot](path/to/result.png)
*Phishing Detection Result*

## Presentation
Find the project presentation and video demonstration in the [presentation/](presentation/) folder.
