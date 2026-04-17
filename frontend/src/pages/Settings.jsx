import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import StatusMessage from '../components/StatusMessage';

export default function Settings() {
    // Pull the current user out of AuthContext so we can pre-fill the username input
    const { user } = useAuth();

    const [username, setUsername] = useState(user?.username || '');
    const [usernameStatus, setUsernameStatus] = useState({ msg: '', ok: true });
    const [passwordStatus, setPasswordStatus] = useState({ msg: '', ok: true });

    // PATCH /api/auth/profile/ — only allowed to change whitelisted fields (see views.py)
    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.patch('auth/profile/', { username });
            setUsernameStatus({ msg: 'Username updated.', ok: true });
        } catch {
            setUsernameStatus({ msg: 'Failed to update username.', ok: false });
        }
    };

    // Firebase sends a password reset email. The user clicks the link and
    // completes the reset on Firebase's hosted page.
    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, user.email);
            setPasswordStatus({ msg: `Reset link sent to ${user.email}`, ok: true });
        } catch {
            setPasswordStatus({ msg: 'Failed to send reset email.', ok: false });
        }
    };

    return (
        <div className="w-full max-w-xl flex flex-col gap-6">

            {/* ── Change Username ── */}
            <div className="card bg-base-100 shadow-md">
                <div className="card-body gap-4">
                    <div>
                        <h2 className="card-title">Username</h2>
                        <p className="text-sm text-base-content/50">This is how you appear across the app</p>
                    </div>
                    <form onSubmit={handleUsernameUpdate} className="flex flex-col gap-3">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <StatusMessage status={usernameStatus} />
                        <button type="submit" className="btn btn-primary">Save Username</button>
                    </form>
                </div>
            </div>

            {/* ── Change Password ── */}
            <div className="card bg-base-100 shadow-md">
                <div className="card-body gap-4">
                    <div>
                        <h2 className="card-title">Password</h2>
                        <p className="text-sm text-base-content/50">
                            We'll send a reset link to <span className="font-medium">{user?.email}</span>
                        </p>
                    </div>
                    <StatusMessage status={passwordStatus} />
                    <button onClick={handlePasswordReset} className="btn btn-outline w-fit">
                        Send Reset Email
                    </button>
                </div>
            </div>

        </div>
    );
}
