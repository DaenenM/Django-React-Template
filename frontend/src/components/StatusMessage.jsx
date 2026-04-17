// Renders nothing when msg is empty, green text on ok=true, red on ok=false.
// Use with: const [status, setStatus] = useState({ msg: '', ok: true })
export default function StatusMessage({ status }) {
    if (!status.msg) return null;
    return (
        <p className={`text-sm ${status.ok ? 'text-success' : 'text-error'}`}>
            {status.msg}
        </p>
    );
}
