# Phishing Email Detector - MERN Stack

A full-stack phishing email detection system built with the MERN stack (MongoDB, Express, React, Node.js) and machine learning.

## 🚀 Technology Stack

- **MongoDB** - Database for storing analysis history
- **Express.js** - Backend REST API
- **React** - Modern frontend with Vite
- **Node.js** - Runtime environment
- **Python** - Machine learning model integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.x
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
cd phishing-detector
```

### 2. Install MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update the `.env` file with your connection string

### 3. Set up Backend

```bash
cd server
npm install

# Install Python dependencies
pip install -r requirements.txt
```

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/phishing-detector
PORT=8000
```

### 4. Set up Frontend

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd server
npm start
```

The backend will run on `http://localhost:8000`

### Start Frontend (React)

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

- `POST /api/predict` - Analyze email text
  ```json
  {
    "text": "Your email content here"
  }
  ```

- `GET /api/history` - Get analysis history (last 50)

- `DELETE /api/history/:id` - Delete specific analysis

- `DELETE /api/history` - Clear all history

## 🎨 Features

- **Real-time Email Analysis** - Analyze emails for phishing indicators
- **Confidence Scoring** - Visual confidence meter (0-100%)
- **Analysis History** - MongoDB-powered history with timestamps
- **Reason Breakdown** - Detailed explanations for each prediction
- **Modern UI** - Beautiful React interface with animations
- **Responsive Design** - Works on all devices

## 📁 Project Structure

```
phishing-detector/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── Analysis.js          # Mongoose schema
│   ├── routes/
│   │   └── api.js               # API endpoints
│   ├── python/
│   │   └── predict.py           # ML model
│   ├── model/                   # Trained ML model files
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── EmailAnalyzer.jsx
│   │   │   ├── ResultDisplay.jsx
│   │   │   └── HistoryPanel.jsx
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.jsx              # Main React component
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── .env                         # Environment variables
```

## 🔧 Development

### Backend Development

The backend uses:
- Express.js for REST API
- Mongoose for MongoDB ODM
- Child process to run Python ML model
- CORS enabled for frontend communication

### Frontend Development

The frontend uses:
- React 18 with hooks
- Vite for fast development
- Axios for API calls
- CSS with custom properties

### Database Schema

```javascript
{
  emailText: String,
  prediction: String,      // 'phishing' or 'safe'
  confidence: Number,      // 0-100
  reasons: [String],
  timestamp: Date
}
```

## 🧪 Testing

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Paste an email text and click "Analyze Email"
4. View results and check history panel
5. Verify data is saved in MongoDB

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

**Python Model Error:**
- Install Python dependencies: `pip install -r requirements.txt`
- Ensure Python is in PATH
- Check model files exist in `server/model/`

**Frontend Can't Connect:**
- Verify backend is running on port 8000
- Check CORS settings in `server.js`
- Update API_URL in `App.jsx` if needed

## 📝 License

This project is for educational purposes only. Not a replacement for professional security tools.

## 🎯 Future Enhancements

- User authentication
- Email attachment analysis
- Real-time notifications
- Advanced ML models
- Export analysis reports
