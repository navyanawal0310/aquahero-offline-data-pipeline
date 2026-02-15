import firebase_admin
from firebase_admin import credentials, firestore

# Load service account key
cred = credentials.Certificate("serviceAccountKey.json")

# Initialize Firebase app
firebase_admin.initialize_app(cred)

# Connect to Firestore
db = firestore.client()

# Fetch all reports
reports_ref = db.collection("reports")
docs = reports_ref.stream()

print("=== Aquahero Reports ===\n")

for doc in docs:
    print(doc.to_dict())
