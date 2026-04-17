// size: 'sm' | 'md' | 'lg' — maps to DaisyUI loading-spinner sizes
// center: wraps the spinner in a flex container so it sits in the middle of its parent
export default function Spinner({ size = 'md', center = false }) {
    const spinner = <span className={`loading loading-spinner loading-${size}`} />;
    if (center) return <div className="flex justify-center py-4">{spinner}</div>;
    return spinner;
}
