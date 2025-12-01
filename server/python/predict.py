import sys
import json
import pickle
import numpy as np
import os
import warnings
import re

warnings.filterwarnings("ignore", category=UserWarning)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

VEC_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
MODEL_PATH = os.path.join(MODEL_DIR, "phishing_model.pkl")

# Load model if exists
try:
    with open(VEC_PATH, "rb") as f:
        vectorizer = pickle.load(f)
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    MODEL_LOADED = True
except:
    MODEL_LOADED = False

# Comprehensive scam/phishing keywords
SCAM_KEYWORDS = [
    # Shipping/Delivery scams
    'package', 'delivery', 'shipping', 'courier', 'shipment', 'tracking number',
    'incomplete address', 'returned to sender', 'delivery attempt', 'postal',
    'customs', 'pending delivery', 'missed delivery', 'delivery fee',
    'verify address', 'update address', 'shipping support', 'delivery failed',
    
    # Urgency words
    'urgent', 'immediately', 'act now', 'limited time', 'expires', 'hurry',
    'quick', 'fast', 'asap', 'right now', 'don\'t wait', 'last chance',
    'final notice', 'deadline', 'time sensitive', 'act fast', 'instant',
    'final reminder', 'immediate action', 'required immediately',
    
    # Financial scams
    'verify account', 'confirm identity', 'update payment', 'suspended account',
    'unusual activity', 'unauthorized', 'verify now', 'confirm now',
    'account locked', 'account suspended', 'security alert', 'fraud alert',
    'billing problem', 'payment failed', 'update billing', 'expired card',
    
    # Prize/lottery scams
    'congratulations', 'winner', 'won', 'prize', 'lottery', 'jackpot',
    'claim now', 'claim prize', 'free money', 'cash prize', 'reward',
    'you\'ve been selected', 'lucky winner', 'grand prize',
    
    # IRS/Tax scams
    'irs', 'tax refund', 'tax return', 'refund pending', 'owe taxes',
    'tax debt', 'revenue service', 'tax notice', 'audit',
    
    # Banking/financial
    'bank account', 'credit card', 'social security', 'ssn', 'routing number',
    'account number', 'pin', 'password', 'security code', 'cvv',
    
    # Threats
    'legal action', 'lawsuit', 'arrest', 'police', 'warrant', 'court',
    'suspended', 'terminated', 'cancelled', 'blocked', 'restricted',
    
    # Request for action
    'click here', 'click link', 'verify here', 'confirm here', 'login here',
    'update here', 'download', 'open attachment', 'view document',
    
    # Too good to be true
    'free', 'guaranteed', 'risk free', 'no cost', 'earn money', 'make money',
    'work from home', 'easy money', 'get rich', 'double your',
    
    # Impersonation
    'dear customer', 'dear user', 'dear member', 'valued customer',
    'account holder', 'paypal', 'amazon', 'microsoft', 'apple', 'google',
    'netflix', 'facebook', 'instagram', 'bank of america', 'wells fargo',
    'chase', 'citibank',
    
    # Suspicious requests
    'send money', 'wire transfer', 'gift card', 'bitcoin', 'cryptocurrency',
    'western union', 'moneygram', 'cash app', 'venmo', 'zelle',
    
    # Spelling variations
    'acc0unt', 'verif y', 'p@ypal', 'micros0ft', 'amaz0n',
]

# Legitimate keywords (reduce false positives)
LEGIT_KEYWORDS = [
    'unsubscribe', 'privacy policy', 'terms of service', 'contact us',
    'customer service', 'help center', 'support team', 'newsletter',
    'subscription', 'preferences', 'settings', 'manage account',
]

def count_scam_indicators(text):
    """Count scam indicators in text"""
    text_lower = text.lower()
    
    indicators = {
        'scam_keywords': 0,
        'suspicious_links': 0,
        'urgency_words': 0,
        'financial_requests': 0,
        'spelling_tricks': 0,
        'threats': 0,
        'shipping_issues': 0,
        'too_good': 0,
        'legit_markers': 0
    }
    
    reasons = []
    
    # Count scam keywords
    for keyword in SCAM_KEYWORDS:
        if keyword in text_lower:
            indicators['scam_keywords'] += 1
            
            # Categorize
            if keyword in ['urgent', 'immediately', 'act now', 'limited time', 'hurry', 'asap', 'final reminder', 'final notice']:
                indicators['urgency_words'] += 1
            elif keyword in ['verify account', 'confirm identity', 'suspended account', 'account locked']:
                indicators['financial_requests'] += 1
            elif keyword in ['legal action', 'lawsuit', 'arrest', 'warrant']:
                indicators['threats'] += 1
            elif keyword in ['package', 'delivery', 'shipping', 'courier', 'incomplete address', 'returned to sender']:
                indicators['shipping_issues'] += 1
            elif keyword in ['free', 'guaranteed', 'win', 'prize', 'lottery']:
                indicators['too_good'] += 1
    
    # Check for suspicious links
    suspicious_patterns = [
        r'http[s]?://[^\s]+\.(tk|ml|ga|cf|gq)',  # Suspicious TLDs
        r'http[s]?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',  # IP addresses
        r'bit\.ly|tinyurl|goo\.gl',  # URL shorteners
        r'[^\s]+\-verify\-[^\s]+',  # verify in domain
        r'[^\s]+\-secure\-[^\s]+',  # secure in domain
    ]
    
    for pattern in suspicious_patterns:
        if re.search(pattern, text_lower):
            indicators['suspicious_links'] += 1
    
    # Check for spelling tricks
    spelling_tricks = [r'acc0unt', r'verif\s*y', r'p@ypal', r'micros0ft', r'amaz0n', r'[0O]{2,}']
    for trick in spelling_tricks:
        if re.search(trick, text_lower):
            indicators['spelling_tricks'] += 1
    
    # Check for legitimate markers
    for keyword in LEGIT_KEYWORDS:
        if keyword in text_lower:
            indicators['legit_markers'] += 1
    
    # Build reasons
    if indicators['urgency_words'] > 0:
        reasons.append(f"Contains {indicators['urgency_words']} urgency words (urgent, immediately, etc.)")
    
    if indicators['financial_requests'] > 0:
        reasons.append(f"Requests account verification or financial information")
    
    if indicators['threats'] > 0:
        reasons.append(f"Contains threats (legal action, arrest, etc.)")

    if indicators['shipping_issues'] > 0:
        reasons.append(f"Mentions package delivery issues (common scam tactic)")
    
    if indicators['suspicious_links'] > 0:
        reasons.append(f"Contains {indicators['suspicious_links']} suspicious links or URLs")
    
    if indicators['spelling_tricks'] > 0:
        reasons.append(f"Uses spelling tricks to bypass filters")
    
    if indicators['too_good'] > 0:
        reasons.append(f"Makes unrealistic promises (free money, prizes, etc.)")
    
    if indicators['scam_keywords'] > 5:
        reasons.append(f"Contains {indicators['scam_keywords']} known scam keywords")
    
    return indicators, reasons

def predict(text):
    """Enhanced prediction with rule-based + ML"""
    
    # Rule-based analysis
    indicators, reasons = count_scam_indicators(text)
    
    # Calculate rule-based score
    rule_score = 0.0
    rule_score += indicators['scam_keywords'] * 0.05
    rule_score += indicators['urgency_words'] * 0.10
    rule_score += indicators['financial_requests'] * 0.15
    rule_score += indicators['threats'] * 0.12
    rule_score += indicators['shipping_issues'] * 0.15
    rule_score += indicators['suspicious_links'] * 0.20
    rule_score += indicators['spelling_tricks'] * 0.15
    rule_score += indicators['too_good'] * 0.08
    rule_score -= indicators['legit_markers'] * 0.10
    
    # Clamp between 0 and 1
    rule_score = max(0.0, min(1.0, rule_score))
    
    # ML model score (if available)
    ml_score = 0.5
    if MODEL_LOADED:
        try:
            X = vectorizer.transform([text])
            ml_score = float(model.predict_proba(X)[0][1])
        except:
            ml_score = 0.5
    
    # Combine scores (70% rule-based, 30% ML for better accuracy)
    final_score = (rule_score * 0.7) + (ml_score * 0.3)
    
    # Determine prediction
    if final_score > 0.6:
        prediction = "phishing"
    else:
        prediction = "safe"
    
    # Add default reasons if none found
    if not reasons:
        if prediction == "phishing":
            reasons = ["Email shows some suspicious patterns"]
        else:
            reasons = ["Email appears to be legitimate"]
    
    # Add ML confidence if available
    if MODEL_LOADED and abs(ml_score - 0.5) > 0.1:
        reasons.append(f"ML model confidence: {ml_score*100:.0f}%")
    
    return {
        "prediction": prediction,
        "confidence": int(final_score * 100),
        "reasons": reasons[:5]  # Limit to top 5 reasons
    }

if __name__ == "__main__":
    raw = sys.stdin.read().strip()
    try:
        data = json.loads(raw)
    except:
        print(json.dumps({"error": "Invalid JSON"}))
        sys.exit()

    text = data.get("text", "")
    result = predict(text)
    print(json.dumps(result))
