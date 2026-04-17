import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';

// Pass the Firestore collection name to target any collection without writing a new hook.
// Usage: useItems('items') | useItems('products') | useItems('orders')
export function useItems(collection) {
    const queryClient = useQueryClient();

    // Cache key includes the collection so different collections don't share a cache entry.
    const QUERY_KEY = [collection];

    const onSuccess = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

    const { data: items = [], isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => (await API.get(`${collection}/`)).data,
    });

    const addMutation    = useMutation({ mutationFn: (name)         => API.post(`${collection}/add/`, { name }).then(r => r.data),                    onSuccess });
    const updateMutation = useMutation({ mutationFn: ({ id, name }) => API.patch(`${collection}/${id}/update/`, { name }).then(r => r.data),           onSuccess });
    const deleteMutation = useMutation({ mutationFn: (id)           => API.delete(`${collection}/${id}/delete/`).then(r => r.data),                    onSuccess });

    return {
        items,
        isLoading,
        isError,
        addItem:    (name)     => addMutation.mutate(name),
        updateItem: (id, name) => updateMutation.mutate({ id, name }),
        deleteItem: (id)       => deleteMutation.mutate(id),
    };
}
