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

def calculate_trends(days=7):
    reports = db.collection("reports").stream()

    # Prepare date buckets
    today = datetime.utcnow().date()
    date_list = [today - timedelta(days=i) for i in range(days)]
    date_list.reverse()

    trends = {d.isoformat(): {} for d in date_list}

    for doc in reports:
        data = doc.to_dict()

        try:
            t = datetime.fromisoformat(data["time"].replace("Z", ""))
            d = t.date().isoformat()

            if d in trends:
                village = data.get("village", "Unknown")
                trends[d][village] = trends[d].get(village, 0) + 1
        except Exception:
            pass

    # Convert to list for JSON response
    result = []
    for d in date_list:
        entry = {"date": d.isoformat()}
        entry.update(trends[d.isoformat()])
        result.append(entry)

    return result


@app.route("/outbreaks")
def outbreaks():
    return jsonify(analyze_outbreaks())
@app.route("/trends")
def trends():
    return jsonify(calculate_trends())



@app.route("/")
def home():
    return "Aquahero Flask API is running"


if __name__ == "__main__":
    app.run(debug=True)
