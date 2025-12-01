# Quick Start Guide - MERN Stack Phishing Detector

## ⚡ Fast Setup (5 minutes)

### Step 1: Install MongoDB

**Option A - Local (Recommended for Development)**
```bash
# Download MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community
# After installation, start MongoDB:
net start MongoDB
```

**Option B - Cloud (MongoDB Atlas)**
```bash
# 1. Sign up at https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Get connection string
# 4. Update .env file with your connection string
```

### Step 2: Install Dependencies

```bash
# Backend
cd server
npm install
pip install -r requirements.txt

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 3: Configure Environment

Create `.env` file in project root:
```env
MONGODB_URI=mongodb://localhost:27017/phishing-detector
PORT=8000
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
✅ Backend running on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

### Step 5: Test It!

1. Open http://localhost:3000
2. Paste this test email:
   ```
   URGENT! Your account has been compromised. 
   Click here immediately to verify: http://suspicious-link.com
   ```
3. Click "Analyze Email"
4. See the phishing detection result!
5. Check the history panel

---

## 🎯 What You Get

- ✅ **MongoDB** - Stores all analysis history
- ✅ **Express API** - RESTful backend
- ✅ **React UI** - Modern, beautiful interface
- ✅ **Node.js** - Fast server runtime
- ✅ **Python ML** - Accurate phishing detection

---

## 🔧 Troubleshooting

**MongoDB won't connect?**
```bash
# Check if MongoDB is running
net start MongoDB

# Or use MongoDB Atlas (cloud) instead
```

**Port already in use?**
```bash
# Change ports in:
# - server/.env (PORT=8001)
# - frontend/src/App.jsx (API_URL)
```

**Python errors?**
```bash
pip install scikit-learn pandas numpy
```

---

## 📚 Learn More

- Full documentation: [README.md](file:///c:/Users/bhava/OneDrive/Desktop/phishing-detector/README.md)
- API endpoints: See README.md
- Architecture: See [walkthrough.md](file:///C:/Users/bhava/.gemini/antigravity/brain/5016d21d-e9c9-4ddc-bbda-3023688ed279/walkthrough.md)

---

**Ready to deploy?** The app is production-ready! Deploy backend to Railway/Heroku and frontend to Vercel/Netlify.
