import { useItems } from '../hooks/useItems';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import Spinner from '../components/Spinner';

export default function Home() {
    // useItems() handles all data fetching and mutations via TanStack Query.
    // Components don't need to know about Axios or API URLs — that's all inside the hook.
    const { items, isLoading, addItem, updateItem, deleteItem } = useItems();

    return (
        <div className="w-full max-w-xl">
            <h1 className="text-3xl font-bold text-center mb-6">Items</h1>
            {/* DaisyUI card — bg-base-100 is the surface colour (white in light mode) */}
            <div className="card bg-base-100 shadow-md">
                <div className="card-body gap-4">
                    {/* onAdd is a prop — ItemForm calls it when the user submits, passing the input value */}
                    <ItemForm onAdd={addItem} />
                    {/* Show a spinner while the first fetch is in flight, then render the list */}
                    {isLoading ? (
                        <Spinner size="md" center />
                    ) : (
                        <ItemList items={items} onUpdate={updateItem} onDelete={deleteItem} />
                    )}
                </div>
            </div>
        </div>
    );
}
