# Django + React + Firebase Boilerplate

Full-stack boilerplate: Django 6, Django REST Framework, Firebase Firestore, React 19, Vite, Tailwind CSS 4, DaisyUI 5, TanStack Query 5, React Router 7, Axios.

---

## Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Backend  | Django 6, DRF, Firebase Admin SDK           |
| Database | Firebase Firestore                           |
| Frontend | React 19, Vite, Tailwind CSS 4, DaisyUI 5   |
| State    | TanStack Query 5 (server state)              |
| Routing  | React Router 7                               |
| HTTP     | Axios                                        |

---

## Full Setup Guide

Follow these steps in order every time you start fresh with this boilerplate.

---

### Step 1 — Copy the environment files

These files hold your local config and are never committed to git.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

After copying, `backend/.env` will look like this:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
```

Leave everything as-is for now — you'll fill in `SECRET_KEY` in the next step.

---

### Step 2 — Generate a Django secret key

Django needs a secret key for cryptographic signing (sessions, tokens, etc.). Generate one by running:

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the printed output and paste it into `backend/.env`:

```
SECRET_KEY=paste-your-generated-key-here
```

> Never share or commit this key. Generate a new one for every project.

---

### Step 3 — Add your Firebase credentials

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create one)
3. Click the gear icon → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate new private key** → confirm → a JSON file downloads
6. Rename that file to `firebase-credentials.json` and move it into the `backend/` folder

Your `backend/firebase-credentials.json` should look like:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com",
  ...
}
```

> This file is gitignored — never commit it. The placeholder `firebase-credentials.example.json` shows the expected structure.

---

### Step 4 — Enable Firestore and Firebase Auth

**Firestore** (if you haven't already):
1. In the Firebase Console, go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (allows all reads/writes during development)
4. Select a region and click **Enable**

**Firebase Authentication:**
1. In the Firebase Console, go to **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**
4. Click **Save**

---

### Step 5 — Add Firebase config to the frontend .env

The frontend needs your Firebase project's public config (this is safe to put in `.env` — it's not a secret).

1. In the Firebase Console, click the gear icon → **Project Settings**
2. Scroll down to **Your apps** → click the web app (or create one with **Add app → Web**)
3. Copy the `firebaseConfig` object values into `frontend/.env`:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> These values are different from the service account credentials in `firebase-credentials.json`. The service account is a backend secret — these are public frontend identifiers.

---

### Step 7 — Start the Django backend

Make sure your virtual environment is active, then run:

```bash
cd backend
venv\Scripts\activate          # Mac/Linux: source venv/bin/activate
python manage.py migrate
python manage.py runserver
```

You should see:

```
Starting development server at http://127.0.0.1:8000/
```

If Django crashes on startup, it's almost always one of these:
- `firebase-credentials.json` still has placeholder values → replace with real credentials (Step 3)
- `SECRET_KEY` is still `your-secret-key-here` in `.env` → generate one (Step 2)
- Virtual environment not activated → run `venv\Scripts\activate` first

> **Optional — auto-load `.env` on server start:** Install `python-dotenv` (`pip install python-dotenv`) then add these two lines at the very top of `backend/core/settings.py`, just after the existing imports:
> ```python
> from dotenv import load_dotenv
> load_dotenv(BASE_DIR / '.env')
> ```
> Without this, you need to manually `export` each variable or set them in your shell before running `manage.py`.

---

### Step 8 — Start the React frontend

In a **separate terminal**:

```bash
cd frontend
npm install
npm run dev
```

You should see:

```
VITE ready at http://localhost:5173/
```

Open `http://localhost:5173` in your browser. The Items CRUD demo should load and connect to the backend.

---

### Step 9 — Verify everything works

1. The page loads without a blank screen or console errors
2. The Items list appears (empty is fine)
3. Type something in the input and press Enter or click Add — the item should appear
4. Edit and delete should work

If you see a CORS error in the browser console, the Django server is not running — go back to Step 5.

If you see `VITE_API_BASE_URL is not set` in the console, `frontend/.env` is missing — go back to Step 1.

---

## Project Structure

```
Django-React/
├── backend/
│   ├── api/
│   │   ├── firebase.py         — Initializes Firebase Admin SDK, exports Firestore client
│   │   ├── views.py            — All CRUD API views (function-based, @api_view)
│   │   └── urls.py             — URL patterns for /api/ endpoints
│   ├── core/
│   │   ├── settings.py         — Django settings (reads from .env)
│   │   └── urls.py             — Root URL config
│   ├── firebase-credentials.json         — Your real credentials (gitignored)
│   ├── firebase-credentials.example.json — Placeholder showing expected structure
│   ├── .env                    — Your local environment variables (gitignored)
│   ├── .env.example            — Template showing all required variables
│   └── requirements.txt        — Python dependencies
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js          — Axios instance, attaches Firebase token to every request
    │   ├── components/
    │   │   ├── Layout.jsx      — Navbar + <Outlet /> shell (wraps all pages)
    │   │   ├── ItemForm.jsx    — Add item input
    │   │   ├── ItemList.jsx    — Renders list of ItemItem components
    │   │   └── ItemItem.jsx    — Single item with edit/delete toggle
    │   ├── hooks/
    │   │   └── useItems.js     — TanStack Query hook for all CRUD operations
    │   ├── pages/
    │   │   └── Home.jsx        — Items demo page (add this pattern for new pages)
    │   ├── App.jsx             — Route definitions (<Routes> / <Route>)
    │   └── main.jsx            — App entry point, QueryClient + BrowserRouter setup
    ├── .env                    — Your local environment variables (gitignored)
    ├── .env.example            — Template showing all required variables
    └── package.json
```

---

## API Endpoints

All endpoints operate on the Firestore `items` collection. Change the collection name in `backend/api/views.py` → `COLLECTION = 'items'`.

| Method | URL                          | Auth required | Action                                    |
|--------|------------------------------|---------------|-------------------------------------------|
| POST   | `/api/auth/register/`        | Yes (token)   | Create Firestore user profile after signup |
| GET    | `/api/items/`                | No            | List all items                            |
| POST   | `/api/items/add/`            | No            | Create item                               |
| GET    | `/api/items/<id>/`           | No            | Get one item                              |
| PUT    | `/api/items/<id>/replace/`   | No            | Full replace                              |
| PATCH  | `/api/items/<id>/update/`    | No            | Partial update                            |
| DELETE | `/api/items/<id>/delete/`    | No            | Delete item                               |

> Endpoints marked "No" are open for development. Lock them down by adding `verify_firebase_token(request)` from `api/utils.py` before the main logic.

---

## Common Customizations

**Rename the Firestore collection**

Edit `COLLECTION = 'items'` at the top of `backend/api/views.py`.

**Add a new page**

1. Create `frontend/src/pages/MyPage.jsx`
2. Add a route in `frontend/src/App.jsx`:
```jsx
<Route path="/my-page" element={<MyPage />} />
```
3. Link to it from anywhere using React Router's `<Link to="/my-page">`.

**Add a new API endpoint**

1. Add a view function in `backend/api/views.py`
2. Register the URL in `backend/api/urls.py`

**Switch to a different Firebase project**

1. Generate new credentials from the new project's Firebase Console
2. Replace `backend/firebase-credentials.json` with the new file
3. Update `FIREBASE_CREDENTIALS_PATH` in `backend/.env` if the filename changed

---

## Environment Variables Reference

### `backend/.env`

| Variable                    | Example value                                       | Description                             |
|-----------------------------|-----------------------------------------------------|-----------------------------------------|
| `SECRET_KEY`                | `django-insecure-abc123...`                         | Django cryptographic key — generate one per project |
| `DEBUG`                     | `True`                                              | Set to `False` in production            |
| `ALLOWED_HOSTS`             | `localhost,127.0.0.1`                               | Comma-separated hostnames               |
| `CORS_ALLOWED_ORIGINS`      | `http://localhost:5173,http://localhost:3000`        | Comma-separated origins for the React dev server |
| `FIREBASE_CREDENTIALS_PATH` | `firebase-credentials.json`                         | Path to your service account JSON       |

### `frontend/.env`

| Variable                        | Description                                                    |
|---------------------------------|----------------------------------------------------------------|
| `VITE_API_BASE_URL`             | Full URL to Django API — must include trailing slash           |
| `VITE_FIREBASE_API_KEY`         | From Firebase Console → Project Settings → Your Apps          |
| `VITE_FIREBASE_AUTH_DOMAIN`     | `your-project-id.firebaseapp.com`                              |
| `VITE_FIREBASE_PROJECT_ID`      | Your Firebase project ID                                       |
| `VITE_FIREBASE_STORAGE_BUCKET`  | `your-project-id.firebasestorage.app`                          |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Numeric sender ID from Firebase config                     |
| `VITE_FIREBASE_APP_ID`          | App ID from Firebase config                                    |

> These are public identifiers, not secrets. They are safe to include in the frontend `.env`.
