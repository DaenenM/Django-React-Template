import { useState } from 'react';

export default function ItemForm({ onAdd }) {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (!value.trim()) return;
        onAdd(value);
        setValue('');
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Add a new item..."
                className="input input-bordered flex-1"
            />
            <button onClick={handleSubmit} className="btn btn-primary">
                Add
            </button>
        </div>
    );
}
