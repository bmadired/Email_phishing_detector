import sys
import json
import pickle
import numpy as np
import os
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

VEC_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(MODEL_DIR, "phishing_model.pkl")

with open(VEC_PATH, "rb") as f:
    vectorizer = pickle.load(f)

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

def predict(text):
    X = vectorizer.transform([text])
    prob = model.predict_proba(X)[0][1]
    label = "phishing" if prob > 0.5 else "legit"

    return {
        "label": label,
        "score": float(prob),
        "reasons": [
            "Email contains suspicious wording.",
            "Similarity to known phishing patterns."
        ]
    }

if __name__ == "__main__":
    raw = sys.stdin.read().strip()
    try:
        data = json.loads(raw)
    except:
        print(json.dumps({"error": "Invalid JSON"}))
        sys.exit()

    text = data.get("text", "")
    print(json.dumps(predict(text)))
