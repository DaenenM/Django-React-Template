import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import PlaceOrder from './pages/PlaceOrder';
import AuthPage from './pages/AuthPage';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
    return (
        // AuthProvider wraps everything so any component can call useAuth()
        // to access the current user, login, register, and logout functions
        <AuthProvider>
            {/*
              Routes renders the first <Route> whose path matches the current URL.
              The outer Route (path="/") renders Layout for every page.
              Child routes render inside Layout's <Outlet /> placeholder.
            */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Public routes — accessible without login */}
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="place-order" element={<PlaceOrder />} />
                    <Route path="login" element={<AuthPage />} />
                    <Route path="register" element={<AuthPage />} />
                    {/* Protected routes — ProtectedRoute redirects to /login if not authenticated */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* 404 — catches any path not matched above */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
