import { useState } from 'react';

// Manages a flat form state object.
// Returns [data, field] where field('key') returns an onChange handler for that key.
// Usage: const [form, field] = useFormData({ email: '', password: '' })
//        <input value={form.email} onChange={field('email')} />
export function useFormData(initial) {
    const [data, setData] = useState(initial);
    const field = (key) => (e) => setData(prev => ({ ...prev, [key]: e.target.value }));
    return [data, field];
}
