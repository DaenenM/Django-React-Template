import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import API from '../api/api';
import Spinner from '../components/Spinner';

const AuthContext = createContext(null);

// Instantiated once — GoogleAuthProvider holds no per-session state
const googleProvider = new GoogleAuthProvider();

// Tells Django to create/sync the Firestore profile for this user.
// username falls back to Google display name for Google sign-ins.
const syncFirestoreProfile = async (firebaseUser, username = '') => {
    await API.post('auth/register/', {
        email: firebaseUser.email,
        username: username || firebaseUser.displayName || firebaseUser.email.split('@')[0],
    });
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fires on load (restores session) and on every sign-in / sign-out.
        // Returns an unsubscribe function — React calls it on unmount to prevent memory leaks.
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch the Firestore profile so username is always authoritative
                try {
                    const res = await API.get('auth/profile/');
                    setUser({ ...firebaseUser, username: res.data.username });
                } catch {
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const register = async (email, password, username = '') => {
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store username as Firebase displayName so it's available even without a Firestore fetch
        if (username) 
            await updateProfile(newUser, { displayName: username });

        await syncFirestoreProfile(newUser, username);

        // updateProfile doesn't trigger onAuthStateChanged, so force a state refresh manually
        setUser({ ...auth.currentUser, username });

        return newUser;
    };

    const loginWithGoogle = async () => {
        const { user: googleUser } = await signInWithPopup(auth, googleProvider);
        // syncFirestoreProfile only creates a new doc if one doesn't already exist —
        // returning Google users won't lose their XP or coins
        await syncFirestoreProfile(googleUser);
        return googleUser;
    };

    const logout = () => signOut(auth);

    // Prevents a flash of the "logged out" state on page refresh while
    // Firebase is still confirming the session
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
