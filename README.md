# Email Phishing Detector

## Project Overview
A MERN stack application that detects phishing emails using machine learning and rule-based analysis with high accuracy.

## Folder Structure
```
phishing-detector/
├── frontend/           # React application (Vite)
├── server/             # Node.js Express backend
│   ├── python/         # ML model and scripts
│   ├── routes/         # API endpoints
│   └── models/         # MongoDB schemas
└── presentation/       # Project presentation files
```

## Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (optional)

## Installation & Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/phishing_detector
MODEL_PATH=./server/model/phishing_model.pkl
```

### 2. Backend Setup
```bash
cd server
npm install
npm start
```
Runs on `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`

### 4. ML Model Setup
```bash
pip install scikit-learn pandas numpy
```
Model loads automatically with backend.

## Running the Application
1. Start MongoDB (optional)
2. Start backend: `cd server && npm start`
3. Start frontend: `cd frontend && npm run dev`
4. Open `http://localhost:3000`

## API Usage

### Endpoint: POST /api/predict
**Request:**
```json
{
  "text": "Your account is suspended. Click here to verify."
}
```

**Response:**
```json
{
  "prediction": "phishing",
  "confidence": 99,
  "reasons": ["Contains urgency words", "Requests account verification"]
}
```

## Sample Input & Output

**Input:**
```
URGENT! Your package delivery failed. Update address immediately.
```

**Output:**
```
Verdict: ⚠️ Phishing Detected
Confidence: 89%
Reasons: Mentions package delivery issues, Contains urgency words
```

## Screenshots
*(Upload screenshots here)*

![Dashboard](path/to/dashboard.png)  
*Main Dashboard*

![Results](path/to/results.png)  
*Detection Results*

## Presentation
Project presentation and demo video: [presentation/](presentation/)
