import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFormData } from '../hooks/useFormData';
import Spinner from '../components/Spinner';

// File-local UI primitives
function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
    );
}

function Divider() {
    return (
        <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-base-300" />
            <span className="text-xs text-base-content/40 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-base-300" />
        </div>
    );
}

// Reusable labeled input — avoids repeating the DaisyUI form-control structure
function FormInput({ label, type = 'text', placeholder, value, onChange, required }) {
    return (
        <label className="form-control w-full">
            <div className="label pb-1">
                <span className="label-text font-medium">{label}</span>
            </div>
            <input
                type={type}
                placeholder={placeholder}
                className="input input-bordered w-full"
                value={value}
                onChange={onChange}
                required={required}
            />
        </label>
    );
}

export default function AuthPage() {
    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [loginData, loginField] = useFormData({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [regData, regField] = useFormData({ username: '', email: '', password: '', confirm: '' });
    const [regError, setRegError] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        try {
            await login(loginData.email, loginData.password);
            navigate('/');
        } catch {
            setLoginError('Incorrect email or password.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        if (regData.password !== regData.confirm) {
            setRegError('Passwords do not match.');
            return;
        }
        setRegLoading(true);
        try {
            await register(regData.email, regData.password, regData.username);
            navigate('/');
        } catch (err) {
            setRegError(err.message ?? 'Registration failed. Please try again.');
        } finally {
            setRegLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setLoginError(err.message ?? 'Google sign-in failed.');
        }
    };

    return (
        <div className="w-full max-w-4xl">

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Welcome</h1>
                <p className="text-base-content/50 mt-1 text-sm">Sign in to your account or create a new one</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body gap-5">
                        <div>
                            <h2 className="text-xl font-semibold">Sign In</h2>
                            <p className="text-sm text-base-content/50">Access your existing account</p>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <FormInput
                                label="Email" type="email" placeholder="you@example.com"
                                value={loginData.email} onChange={loginField('email')} required
                            />
                            <FormInput
                                label="Password" type="password" placeholder="••••••••"
                                value={loginData.password} onChange={loginField('password')} required
                            />
                            {loginError && <p className="text-error text-sm">{loginError}</p>}
                            <button type="submit" className="btn btn-primary w-full" disabled={loginLoading}>
                                {loginLoading ? <Spinner size="sm" /> : 'Sign In'}
                            </button>
                        </form>

                        <Divider />

                        <button onClick={handleGoogle} className="btn btn-outline w-full gap-2">
                            <GoogleIcon />
                            Continue with Google
                        </button>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body gap-5">
                        <div>
                            <h2 className="text-xl font-semibold">Create Account</h2>
                            <p className="text-sm text-base-content/50">Get started for free</p>
                        </div>

                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <FormInput
                                label="Username" placeholder="johndoe"
                                value={regData.username} onChange={regField('username')} required
                            />
                            <FormInput
                                label="Email" type="email" placeholder="you@example.com"
                                value={regData.email} onChange={regField('email')} required
                            />
                            <FormInput
                                label="Password" type="password" placeholder="••••••••"
                                value={regData.password} onChange={regField('password')} required
                            />
                            <FormInput
                                label="Confirm Password" type="password" placeholder="••••••••"
                                value={regData.confirm} onChange={regField('confirm')} required
                            />
                            {regError && <p className="text-error text-sm">{regError}</p>}
                            <button onClick={handleGoogle} type="button" className="btn btn-outline w-full gap-2">
                                <GoogleIcon />
                                Sign up with Google
                            </button>
                            <button type="submit" className="btn btn-primary w-full" disabled={regLoading}>
                                {regLoading ? <Spinner size="sm" /> : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
