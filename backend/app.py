from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)

# Home Route
@app.route("/", methods=["GET"])
def home():
    return "TruthLens AI is running 🚀"

# Load model
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

# Predict API
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    vec = vectorizer.transform([text])

    pred = int(model.predict(vec)[0])
    prob = model.predict_proba(vec)[0]

    confidence = min(float(max(prob)) * 100, 99.99)

    # simple explanation logic
    explanation = []

    fake_keywords = ["fake", "hoax", "claims", "immortal", "moon", "cheese", "scientists"]
    if any(word in text.lower() for word in fake_keywords):
        explanation.append("Contains suspicious keywords")

    if len(text.split()) < 20:
        explanation.append("Very short news content")

    if not explanation:
        explanation.append("Matches real news writing style")

    return jsonify({
        "label": "Fake News ❌" if pred == 0 else "Real News ✅",
        "confidence": round(confidence, 2),
        "reason": explanation
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"🔥 TruthLens AI Running on port {port}")
    app.run(host="0.0.0.0", port=port)
    # Quick test
