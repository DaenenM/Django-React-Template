import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any route with this to require login.
// Unauthenticated users are redirected to /login.
// `replace` swaps the history entry so the back button doesn't loop back to the protected page.
export default function ProtectedRoute() {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
