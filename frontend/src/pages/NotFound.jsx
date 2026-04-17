import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="w-full max-w-sm">
            <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center gap-4">
                    <p className="text-6xl font-bold text-base-content/20">404</p>
                    <div>
                        <h2 className="text-xl font-semibold">Page Not Found</h2>
                        <p className="text-sm text-base-content/50 mt-1">
                            The page you're looking for doesn't exist.
                        </p>
                    </div>
                    <Link to="/" className="btn btn-primary w-full">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
