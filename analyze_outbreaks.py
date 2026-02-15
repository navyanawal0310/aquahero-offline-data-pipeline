import firebase_admin
from firebase_admin import credentials, firestore
from collections import defaultdict
from datetime import datetime, timedelta

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Fetch reports
reports = db.collection("reports").stream()

# Store grouped data
grouped = defaultdict(list)

for doc in reports:
    data = doc.to_dict()
    key = (data.get("village"), data.get("symptom"))
    grouped[key].append(data)

print("\n=== Outbreak Analysis ===\n")

now = datetime.utcnow()

for (village, symptom), entries in grouped.items():
    # Filter last 24 hours
    recent = []

    for e in entries:
        try:
            t = datetime.fromisoformat(e["time"].replace("Z", ""))
            if now - t <= timedelta(hours=24):
                recent.append(e)
        except Exception:
            pass

    if len(recent) >= 3:
        print(f"🚨 OUTBREAK in {village} — {symptom} ({len(recent)} cases in 24h)")
    else:
        print(f"Normal: {village} — {symptom} ({len(recent)} recent cases)")
