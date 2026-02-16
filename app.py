from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from collections import defaultdict
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


def analyze_outbreaks():
    reports = db.collection("reports").stream()

    grouped = defaultdict(list)

    for doc in reports:
        data = doc.to_dict()
        key = (data.get("village"), data.get("symptom"))
        grouped[key].append(data)

    now = datetime.utcnow()
    results = []

    for (village, symptom), entries in grouped.items():
        recent = []

        for e in entries:
            try:
                t = datetime.fromisoformat(e["time"].replace("Z", ""))
                if now - t <= timedelta(hours=24):
                    recent.append(e)
            except Exception:
                pass

        status = "outbreak" if len(recent) >= 3 else "normal"

        results.append({
            "village": village,
            "symptom": symptom,
            "recent_cases": len(recent),
            "status": status
        })

    return results


@app.route("/outbreaks")
def outbreaks():
    return jsonify(analyze_outbreaks())


@app.route("/")
def home():
    return "Aquahero Flask API is running"


if __name__ == "__main__":
    app.run(debug=True)
