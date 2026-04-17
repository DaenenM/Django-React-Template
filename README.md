# Django + React + Firebase Boilerplate

Full-stack boilerplate with authentication, protected routes, Firestore user profiles, and a working CRUD example ready to build on.

---

## Stack

| Layer    | Technology                                        |
|----------|---------------------------------------------------|
| Backend  | Django 6, Django REST Framework, Firebase Admin SDK |
| Database | Firebase Firestore                                |
| Auth     | Firebase Authentication (Email/Password + Google) |
| Frontend | React 19, Vite, Tailwind CSS 4, DaisyUI 5         |
| State    | TanStack Query 5                                  |
| Routing  | React Router 7                                    |
| HTTP     | Axios (auto-attaches Firebase token)              |

---

## What's Included

- **Firebase Auth** — email/password registration + login, Google sign-in, logout
- **Firestore user profiles** — created on registration with `role`, `xp`, `coins` defaults
- **Protected routes** — `<ProtectedRoute>` redirects unauthenticated users to `/login`
- **Settings page** — change username (saved to Firestore), send password reset email
- **Items CRUD** — full add/edit/delete example wired to Firestore via TanStack Query
- **Reusable utilities** — `<Spinner>`, `<StatusMessage>`, `useFormData`, `@require_auth`
- **404 page** — catches all unmatched routes
- **Environment config** — all secrets in `.env` files, never hardcoded

---

## Setup

### 1. Create a Firebase project

1. Go to https://console.firebase.google.com → **Add project**
2. **Authentication** → Get started → Enable **Email/Password** and **Google**
3. **Firestore Database** → Create database → Start in test mode → choose a region

### 2. Get your Firebase credentials

**Frontend config** (public identifiers — not secrets):

1. Gear icon → **Project settings** → scroll to **Your apps**
2. If no web app exists, click `</>` → register it
3. Select **Config** — copy the values, you'll need them in Step 5

**Backend service account key** (secret — never commit):

1. Gear icon → **Project settings** → **Service accounts**
2. Click **Generate new private key** → download the JSON
3. Rename it `firebase-credentials.json` and place it in `backend/`

### 3. Copy the environment files

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
```

### 4. Fill in `backend/.env`

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
```

Generate a secret key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 5. Fill in `frontend/.env`

Paste the values from the Firebase config object you found in Step 2:

```env
VITE_API_BASE_URL=http://localhost:8000/api/

VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 6. Install backend dependencies

```bash
cd backend
python -m venv venv

venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac / Linux

pip install -r requirements.txt
python manage.py migrate
```

### 7. Install frontend dependencies

```bash
cd frontend
npm install
```

### 8. Start both servers

**Terminal 1 — backend:**

```bash
cd backend
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac / Linux
python manage.py runserver
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm run dev
```

Open http://localhost:5173

### 9. Verify

- [ ] Page loads with navbar and no console errors
- [ ] Register an account — username appears in navbar
- [ ] Log out → Login button shows; log back in
- [ ] Google sign-in works
- [ ] `/settings` → update username → appears in navbar after refresh
- [ ] `/settings` → Send Reset Email → email arrives
- [ ] Navigate to `/xyz` → shows 404 page
- [ ] Log out → navigate to `/settings` → redirected to `/login`

> For a more detailed walkthrough see [SETUP.md](SETUP.md).

---

## Project Structure

```
Django-React/
│
├── backend/
│   ├── .env                              ← your secrets (gitignored)
│   ├── .env.example                      ← template to copy from
│   ├── firebase-credentials.json         ← service account key (gitignored)
│   ├── firebase-credentials.example.json ← structure reference
│   ├── requirements.txt                  ← Python dependencies
│   ├── manage.py
│   │
│   ├── core/
│   │   └── settings.py                   ← all config read from .env via python-dotenv
│   │
│   └── api/
│       ├── firebase.py                   ← initialises Admin SDK + exports Firestore client
│       ├── views.py                      ← all API endpoints, uses @require_auth
│       ├── utils.py                      ← verify_firebase_token + @require_auth decorator
│       └── urls.py                       ← URL routing for /api/
│
└── frontend/
    ├── .env                              ← your secrets (gitignored)
    ├── .env.example                      ← template to copy from
    ├── package.json
    │
    └── src/
        ├── firebase.js                   ← initialises Firebase JS SDK
        ├── api/api.js                    ← Axios instance, attaches Bearer token to every request
        ├── context/AuthContext.jsx       ← login / register / logout / user state
        │
        ├── hooks/
        │   ├── useItems.js               ← TanStack Query CRUD (copy this pattern for new features)
        │   └── useFormData.js            ← reusable form state: const [form, field] = useFormData({})
        │
        ├── components/
        │   ├── Layout.jsx                ← Navbar + <Outlet /> shell
        │   ├── Navbar.jsx                ← top nav with auth dropdown
        │   ├── ProtectedRoute.jsx        ← redirects to /login if user is null
        │   ├── Spinner.jsx               ← <Spinner size="sm|md|lg" center />
        │   ├── StatusMessage.jsx         ← <StatusMessage status={{ msg, ok }} />
        │   ├── ItemForm.jsx              ← add-item input
        │   ├── ItemList.jsx              ← list of ItemItem components
        │   └── ItemItem.jsx              ← single item with inline edit/delete
        │
        └── pages/
            ├── AuthPage.jsx              ← combined login + register (two columns)
            ├── Settings.jsx              ← change username / send password reset
            ├── Home.jsx                  ← items CRUD demo
            ├── About.jsx                 ← placeholder
            ├── Services.jsx              ← placeholder
            ├── PlaceOrder.jsx            ← placeholder
            └── NotFound.jsx              ← 404
```

---

## API Endpoints

All endpoints require a valid Firebase ID token in the `Authorization: Bearer <token>` header.
The `@require_auth` decorator in `api/utils.py` handles verification on every view.

| Method | URL                        | Action                                          |
|--------|----------------------------|-------------------------------------------------|
| POST   | `/api/auth/register/`      | Create / sync Firestore user profile            |
| GET    | `/api/auth/profile/`       | Get current user's profile                     |
| PATCH  | `/api/auth/profile/`       | Update username (other fields are server-only)  |
| GET    | `/api/items/`              | List all items                                  |
| POST   | `/api/items/add/`          | Create item                                     |
| GET    | `/api/items/<id>/`         | Get one item                                    |
| PUT    | `/api/items/<id>/replace/` | Full replace                                    |
| PATCH  | `/api/items/<id>/update/`  | Partial update                                  |
| DELETE | `/api/items/<id>/delete/`  | Delete item                                     |

---

## Common Customizations

**Add a new page**

1. Create `frontend/src/pages/MyPage.jsx`
2. Add a public route in `App.jsx`:
   ```jsx
   <Route path="my-page" element={<MyPage />} />
   ```
   Or a protected route:
   ```jsx
   <Route element={<ProtectedRoute />}>
     <Route path="my-page" element={<MyPage />} />
   </Route>
   ```

**Add a new API endpoint**

1. Add a view function in `backend/api/views.py` with `@api_view` and `@require_auth`
2. Register it in `backend/api/urls.py`

**Add a new data hook**

Copy `frontend/src/hooks/useItems.js` and replace the API paths and query key.

**Rename the Firestore items collection**

Edit `COLLECTION = 'items'` at the top of `backend/api/views.py`.

**Switch to a different Firebase project**

1. Replace `backend/firebase-credentials.json` with the new service account key
2. Update all `VITE_FIREBASE_*` values in `frontend/.env`

---

## Environment Variables

### `backend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | — | Django signing key — generate one per project, never reuse |
| `DEBUG` | `True` | Set to `False` in production |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated hostnames Django will serve |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Comma-separated frontend origins |
| `FIREBASE_CREDENTIALS_PATH` | `firebase-credentials.json` | Path to service account JSON |

### `frontend/.env`

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Django API base URL — must end with `/` |
| `VITE_FIREBASE_API_KEY` | From Firebase Console → Project settings → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Numeric sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

> Frontend Firebase values are public identifiers, not secrets. They tell the JS SDK which project to connect to.
