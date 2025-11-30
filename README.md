# 📧 Phishing Email Detection System

### 🔐 Machine Learning + Node.js + Python + Modern Frontend UI

This project is a complete **Phishing Email Detection Web
Application**.\
Users can paste an email, and the system predicts whether the message is
**Phishing** or **Legit** using a trained Machine Learning model built
in Python.

The backend runs on **Node.js** and uses a **Python child process** to
execute the ML model.\
The frontend is designed with a clean, modern UI.

------------------------------------------------------------------------

## 🌟 Features

✔ Detects phishing vs legit emails\
✔ Provides confidence percentage\
✔ Shows suspicious reasons (only for phishing emails)\
✔ Auto-switches between Localhost and Render backend\
✔ Clean circular confidence indicator\
✔ No database required\
✔ Fully deployable on **Render**

------------------------------------------------------------------------

## 📁 Project Structure

    phishing-detector/
    │
    ├── backend/
    │   ├── server.js
    │   ├── package.json
    │   ├── runtime.txt
    │   ├── python/
    │   │   ├── predict.py
    │   │   ├── model.pkl
    │   │   └── vectorizer.pkl
    │
    └── frontend/
        ├── index.html
        ├── style.css
        ├── script.js

------------------------------------------------------------------------

## 🧠 Machine Learning Workflow

1.  User inputs email text\

2.  Frontend sends text to backend via `/predict`\

3.  Node.js spawns Python:

        python/predict.py

4.  Python loads ML model and vectorizer\

5.  Python returns:

    -   `label` → phishing / legit\
    -   `score` → confidence\
    -   `reasons` → detected warning signs\

6.  Frontend displays results beautifully

------------------------------------------------------------------------

# 🌍 Deploying Backend on Render

### **1. Create new Web Service**

-   Environment: **Node.js**

-   Build Command:

        npm install

-   Start Command:

        node server.js

------------------------------------------------------------------------

### **2. Add runtime.txt to enable Python**

Inside your backend folder, create:

    runtime.txt

Add this inside the file:

    python-3.9.12

------------------------------------------------------------------------

### **3. Deploy**

Render will generate a backend URL like:

    https://phishing-detector-backend-xxxx.onrender.com

Replace this URL in your frontend `script.js`.

------------------------------------------------------------------------

# 💡 Frontend Setup (Local)

Just open:

    frontend/index.html

Frontend will **automatically switch** between Localhost and Render:

``` javascript
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/predict"
    : "https://phishing-detector-backend-xxxx.onrender.com/predict";
```

------------------------------------------------------------------------

# ▶️ Running Backend Locally

### **1. Go to backend folder**

``` bash
cd backend
```

### **2. Install dependencies**

``` bash
npm install
```

### **3. Run backend**

``` bash
node server.js
```

Backend runs at:

    http://localhost:8000

------------------------------------------------------------------------

# 📡 API Documentation

### **POST /predict**

**Endpoint:**

    /predict

**Request Body Example:**

``` json
{
  "text": "Your email content here"
}
```

**Response Example:**

``` json
{
  "label": "phishing",
  "score": 0.87,
  "reasons": [
    "Contains suspicious terms",
    "Similarity to known phishing patterns"
  ]
}
```
------------------------------------------------------------------------

# 👨‍💻 Author

**Bhavana Madireddy**\
Phishing Email Detection Project\
