# Setup Guide

Complete walkthrough for getting this Django + React + Firebase project running from scratch.

&nbsp;

---

&nbsp;

## Prerequisites

Make sure these are installed before starting:

&nbsp;

| Tool | Min Version | Download |
|------|-------------|----------|
| Python | 3.11+ | https://www.python.org/downloads/ |
| Node.js | 18+ | https://nodejs.org/ |
| Git | any | https://git-scm.com/ |

&nbsp;

---

&nbsp;

## Step 1 — Create a Firebase Project

Everything in this app (Auth, Firestore, password reset emails) runs through Firebase.

&nbsp;

1. Go to https://console.firebase.google.com and sign in with your Google account.

2. Click **Add project**, give it a name, and finish the wizard.

&nbsp;

---

&nbsp;

## Step 2 — Enable Firebase Authentication

&nbsp;

1. In the Firebase Console sidebar, click **Authentication**.

2. Click **Get started**.

3. Under the **Sign-in method** tab, enable the following providers:

   - **Email/Password** — click it → toggle **Enable** → Save

   - **Google** — click it → toggle **Enable** → pick a support email → Save

&nbsp;

---

&nbsp;

## Step 3 — Enable Firestore

&nbsp;

1. In the sidebar, click **Firestore Database**.

2. Click **Create database**.

3. Choose **Start in test mode** (you can lock down rules later).

4. Pick any region (e.g. `us-east1`) → click **Done**.

&nbsp;

---

&nbsp;

## Step 4 — Get the Frontend Firebase Config

This gives the React app (browser side) permission to connect to Firebase Auth.

&nbsp;

1. In the Firebase Console, click the **gear icon** next to **Project Overview** → **Project settings**.

2. Scroll down to **Your apps**.
   If no web app is listed, click the `</>` icon, give it a nickname, and click **Register app**.

3. Under **SDK setup and configuration**, select **Config**.

4. You will see an object like this:

&nbsp;

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

&nbsp;

Keep this page open — you will paste these values into `frontend/.env` in Step 7.

&nbsp;

> **Note:** These values are **not secrets**. They are public identifiers that tell the Firebase JS SDK which project to connect to. Storing them in `.env` keeps the project portable across machines.

&nbsp;

---

&nbsp;

## Step 5 — Generate a Firebase Service Account Key

This gives the Django server admin-level access to verify Auth tokens and read/write Firestore.

&nbsp;

1. In **Project settings** → open the **Service accounts** tab.

2. Click **Generate new private key** → **Generate key**.

3. A JSON file will download. **This file is a secret — never commit it to git.**

4. Rename the file to `firebase-credentials.json` and place it in the `backend/` folder:

&nbsp;

```
backend/
  firebase-credentials.json   ← place it here
```

&nbsp;

The file will look like this (with your real values filled in):

&nbsp;

```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "abc123",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  ...
}
```

&nbsp;

> Reference: [`backend/firebase-credentials.example.json`](backend/firebase-credentials.example.json) shows the expected structure with placeholder values.

&nbsp;

---

&nbsp;

## Step 6 — Configure the Backend Environment

&nbsp;

**1. Copy the example file:**

```bash
cp backend/.env.example backend/.env
```

&nbsp;

**2. Open [`backend/.env`](backend/.env) and fill in each value:**

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
```

&nbsp;

**`SECRET_KEY`**

Django uses this to sign cookies and tokens. Generate a strong random one:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Paste the output as the value. Never share or commit this key.

&nbsp;

**`DEBUG`**

Keep `True` for local development. Set to `False` before deploying to production.

&nbsp;

**`ALLOWED_HOSTS`**

Comma-separated list of hostnames Django will serve requests for.
In production, replace with your real domain (e.g. `myapp.com`).

&nbsp;

**`CORS_ALLOWED_ORIGINS`**

Comma-separated list of frontend origins allowed to call the API.
`http://localhost:5173` is the default Vite dev server address.

&nbsp;

**`FIREBASE_CREDENTIALS_PATH`**

Path to the service account JSON, relative to where you run `manage.py`.
If you placed the file directly in `backend/`, the default value is correct.

&nbsp;

> These settings are read by [`backend/core/settings.py`](backend/core/settings.py) using `os.environ.get(...)`.

&nbsp;

---

&nbsp;

## Step 7 — Configure the Frontend Environment

&nbsp;

**1. Copy the example file:**

```bash
cp frontend/.env.example frontend/.env
```

&nbsp;

**2. Open [`frontend/.env`](frontend/.env) and fill in the Firebase values from Step 4:**

```env
VITE_API_BASE_URL=http://localhost:8000/api/

VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

&nbsp;

**`VITE_API_BASE_URL`**

The Django API base URL. Leave as-is for local development.

&nbsp;

> Only variables prefixed with `VITE_` are exposed to the browser by Vite.
> These are read in [`frontend/src/firebase.js`](frontend/src/firebase.js) via `import.meta.env.VITE_*`.

&nbsp;

---

&nbsp;

## Step 8 — Install Backend Dependencies

&nbsp;

**1. Create a virtual environment:**

```bash
cd backend
python -m venv venv
```

&nbsp;

**2. Activate it:**

- **Windows:** `venv\Scripts\activate`
- **Mac / Linux:** `source venv/bin/activate`

&nbsp;

**3. Install packages:**

```bash
pip install -r requirements.txt
```

&nbsp;

Key packages (see [`backend/requirements.txt`](backend/requirements.txt)):

&nbsp;

| Package | Purpose |
|---------|---------|
| `Django` | Web framework |
| `djangorestframework` | REST API helpers |
| `django-cors-headers` | Allows the frontend origin to call the API |
| `firebase_admin` | Verifies Firebase Auth tokens and accesses Firestore |

&nbsp;

---

&nbsp;

## Step 9 — Run Django Migrations

```bash
cd backend
python manage.py migrate
```

&nbsp;

> This project stores user profiles in Firestore, not SQLite. The migration only creates Django's internal tables (sessions, admin, etc.).

&nbsp;

---

&nbsp;

## Step 10 — Install Frontend Dependencies

```bash
cd frontend
npm install
```

&nbsp;

Key packages (see [`frontend/package.json`](frontend/package.json)):

&nbsp;

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `firebase` | Firebase Auth JS SDK (browser) |
| `axios` | HTTP client for API calls |
| `@tanstack/react-query` | Server state management and data fetching |
| `tailwindcss` + `daisyui` | Styling and UI components |

&nbsp;

---

&nbsp;

## Step 11 — Start the Servers

Open **two separate terminals**.

&nbsp;

**Terminal 1 — Django backend:**

```bash
cd backend

venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac / Linux

python manage.py runserver
```

Runs at → http://localhost:8000

&nbsp;

**Terminal 2 — React frontend:**

```bash
cd frontend
npm run dev
```

Runs at → http://localhost:5173

&nbsp;

Open http://localhost:5173 in your browser.
You should see the app load with the navbar and login page.

&nbsp;

---

&nbsp;

## Step 12 — Verify Everything Works

Work through this checklist top to bottom:

&nbsp;

- [ ] Page loads without a white screen or console errors
- [ ] Register a new account — you should land on the home page with your username in the navbar
- [ ] Log out — navbar should switch back to the Login button
- [ ] Log back in with the same credentials
- [ ] Try Google sign-in
- [ ] Go to `/settings` — update your username and confirm it appears in the navbar after refresh
- [ ] Go to `/settings` → **Send Reset Email** — check your inbox and confirm the link arrives
- [ ] Navigate to a nonexistent URL (e.g. `/xyz`) — should show the 404 page
- [ ] Log out and try navigating to `/settings` — should redirect to `/login`

&nbsp;

---

&nbsp;

## File Reference

```
Django-React/
│
├── backend/
│   ├── .env                              ← your secrets (gitignored)
│   ├── .env.example                      ← template — copy this to .env
│   ├── firebase-credentials.json         ← service account key (gitignored)
│   ├── firebase-credentials.example.json ← structure reference only
│   ├── requirements.txt                  ← Python dependencies
│   ├── manage.py                         ← Django CLI entrypoint
│   │
│   ├── core/
│   │   └── settings.py                   ← reads all config from .env
│   │
│   └── api/
│       ├── firebase.py                   ← initialises Admin SDK + Firestore client
│       ├── views.py                      ← API endpoints (auth, items CRUD)
│       ├── utils.py                      ← token verification + @require_auth decorator
│       └── urls.py                       ← URL routing for /api/
│
└── frontend/
    ├── .env                              ← your secrets (gitignored)
    ├── .env.example                      ← template — copy this to .env
    ├── package.json                      ← Node dependencies
    │
    └── src/
        ├── firebase.js                   ← initialises Firebase JS SDK
        ├── api/api.js                    ← Axios instance with auth token interceptor
        ├── context/AuthContext.jsx       ← login / register / logout state
        │
        ├── hooks/
        │   ├── useItems.js               ← TanStack Query CRUD example
        │   └── useFormData.js            ← reusable form state hook
        │
        ├── components/
        │   ├── Layout.jsx                ← navbar + <Outlet /> page shell
        │   ├── Navbar.jsx                ← top navigation bar
        │   ├── ProtectedRoute.jsx        ← redirects to /login if not authenticated
        │   ├── Spinner.jsx               ← reusable loading spinner
        │   └── StatusMessage.jsx         ← reusable success / error message
        │
        └── pages/
            ├── AuthPage.jsx              ← combined login + register page
            ├── Settings.jsx              ← change username / send password reset
            ├── Home.jsx                  ← items CRUD example
            ├── About.jsx                 ← placeholder
            ├── Services.jsx              ← placeholder
            ├── PlaceOrder.jsx            ← placeholder
            └── NotFound.jsx              ← 404 page
```

&nbsp;

---

&nbsp;

## Common Errors

&nbsp;

**`VITE_API_BASE_URL is not set`**

You have not created `frontend/.env`.
Copy from `.env.example` and fill in the values (Step 7).

&nbsp;

**`auth/invalid-api-key`**

The Firebase API key in `frontend/.env` is still the placeholder.
Fill in the real values from the Firebase Console (Step 4).

&nbsp;

**`Could not load Firebase credentials`**

`backend/firebase-credentials.json` is missing or the path is wrong.
Check that `FIREBASE_CREDENTIALS_PATH` in `backend/.env` matches where you placed the file (Steps 5–6).

&nbsp;

**CORS error / connection refused**

The Django server is not running.
Start it with `python manage.py runserver` in the backend terminal (Step 11).

&nbsp;

**Username not showing in the navbar**

This usually means the `GET /api/auth/profile/` request failed (Django not running),
or the Firestore profile was not created during registration.
Try logging out and back in to re-trigger the profile fetch.
