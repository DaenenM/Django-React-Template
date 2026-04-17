import os
import firebase_admin
from firebase_admin import credentials, firestore

# Read the path to the service account JSON from the environment.
# This file is what proves to Firebase that our Django server is authorised
# to read/write Firestore and verify Auth tokens.
cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH', 'firebase-credentials.json')
cred = credentials.Certificate(cred_path)

# initialize_app connects the Firebase Admin SDK to our project.
# Must be called once before any Firebase operation — Django loads this
# module on startup when any view imports `db`.
firebase_admin.initialize_app(cred)

# firestore.client() returns a Firestore database client.
# Imported across views as `from .firebase import db` to query collections.
db = firestore.client()
