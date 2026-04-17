import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const servicesRef = useRef(null);

    const closeServices = () => {
        if (servicesRef.current) servicesRef.current.open = false;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="navbar bg-base-100 shadow-sm px-4">

            {/* Mobile: hamburger + logo */}
            <div className="navbar-start">
                <div className="dropdown lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/place-order">Place Order</Link></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-lg font-bold">Logo</Link>
            </div>

            {/* Desktop: center nav */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li>
                        <details ref={servicesRef}>
                            <summary>Services</summary>
                            <ul className="bg-base-100 rounded-box z-10 w-44 p-2 shadow">
                                <li><Link to="/services" onClick={closeServices}>All Services</Link></li>
                                <li><Link to="/services" onClick={closeServices}>Service One</Link></li>
                                <li><Link to="/services" onClick={closeServices}>Service Two</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link to="/place-order">Place Order</Link></li>
                </ul>
            </div>

            {/* Auth section */}
            <div className="navbar-end gap-2">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                            {user.username || user.displayName || user.email}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-4 w-4 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 mt-3 w-40 p-2 shadow">
                            <li><Link to="/settings">Settings</Link></li>
                            <li><button onClick={handleLogout} className="w-full text-left text-error">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                )}
            </div>

        </div>
    );
}
