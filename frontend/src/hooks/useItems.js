import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';

// The cache key for the items list. Used in both useQuery and invalidateQueries
// so they always refer to the same cache entry. Defined as a constant to avoid typos.
const QUERY_KEY = ['items'];

// Plain async functions that talk to the Django API.
// Defined outside the hook so they're created once, not on every render.
// Each returns response.data directly so the hook receives clean data, not an Axios response object.
const fetchItems    = async ()             => (await API.get('items/')).data;
const addItemFn     = async (name)         => (await API.post('items/add/', { name })).data;
const updateItemFn  = async ({ id, name }) => (await API.patch(`items/${id}/update/`, { name })).data;
const deleteItemFn  = async (id)           => (await API.delete(`items/${id}/delete/`)).data;

export function useItems() {
    // useQueryClient gives access to the cache so we can invalidate (refresh) data after mutations
    const queryClient = useQueryClient();

    // Shared onSuccess — all three mutations do the same thing after succeeding:
    // mark the items cache as stale so TanStack Query refetches the latest list automatically
    const onSuccess = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

    // useQuery fetches and caches the items list.
    // It runs automatically on mount and again when the cache goes stale.
    // data defaults to [] so components never receive undefined on first render.
    const { data: items = [], isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: fetchItems,
    });

    // useMutation handles create/update/delete operations.
    // Unlike useQuery it does NOT run automatically — you call mutation.mutate() to trigger it.
    const addMutation    = useMutation({ mutationFn: addItemFn,    onSuccess });
    const updateMutation = useMutation({ mutationFn: updateItemFn, onSuccess });
    const deleteMutation = useMutation({ mutationFn: deleteItemFn, onSuccess });

    // Expose a clean API to components — they call addItem(name) instead of addMutation.mutate(name)
    return {
        items,
        isLoading, // true while the initial fetch is in flight
        isError,   // true if the fetch failed — use this to show an error message
        addItem:    (name)     => addMutation.mutate(name),
        updateItem: (id, name) => updateMutation.mutate({ id, name }),
        deleteItem: (id)       => deleteMutation.mutate(id),
    };
}
