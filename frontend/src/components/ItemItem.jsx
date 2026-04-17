import { useState } from 'react';

export default function ItemItem({ item, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(item.name);

    const handleSave = () => {
        if (!editValue.trim()) return;
        onUpdate(item.id, editValue);
        setEditing(false);
    };

    return (
        <li className="flex items-center justify-between py-3 border-b border-base-300 last:border-b-0">
            {editing ? (
                <div className="flex gap-2 flex-1">
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="input input-bordered input-sm flex-1"
                    />
                    <button onClick={handleSave} className="btn btn-success btn-sm">Save</button>
                    <button onClick={() => setEditing(false)} className="btn btn-ghost btn-sm">Cancel</button>
                </div>
            ) : (
                <>
                    <span className="text-base">{item.name}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setEditing(true)} className="btn btn-ghost btn-sm text-info">
                            Edit
                        </button>
                        <button onClick={() => onDelete(item.id)} className="btn btn-ghost btn-sm text-error">
                            Delete
                        </button>
                    </div>
                </>
            )}
        </li>
    );
}
