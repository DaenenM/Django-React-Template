import axios from 'axios';
import { auth } from '../firebase';

if (!import.meta.env.VITE_API_BASE_URL) {
    console.error('[api.js] VITE_API_BASE_URL is not set. Copy frontend/.env.example to frontend/.env');
}

// axios.create makes a reusable instance with a shared baseURL.
// Every API call using this instance will automatically prepend the base URL,
// so you write API.get('items/') instead of API.get('http://localhost:8000/api/items/').
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptors run before every request is sent.
// This one checks if the user is logged in and, if so, fetches their
// Firebase ID token and attaches it as a Bearer token in the Authorization header.
// Django reads this header to verify the request came from a real authenticated user.
// Firebase caches the token and only fetches a new one when it's about to expire (~1hr).
API.interceptors.request.use(async (config) => {
    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // always return config or the request won't be sent
});

export default API;
