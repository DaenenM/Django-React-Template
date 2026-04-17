import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Layout is the shared shell that wraps every page.
// It renders once and stays mounted as the user navigates — only the <Outlet> content swaps.
export default function Layout() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar />
            {/*
              flex-1 makes main take up all remaining vertical space (pushes a footer to the bottom).
              items-start keeps page content top-aligned rather than vertically centered.
              <Outlet /> is a React Router placeholder — it renders whichever child route is active.
            */}
            <main className="flex-1 flex items-start justify-center p-8">
                <Outlet />
            </main>
        </div>
    );
}
