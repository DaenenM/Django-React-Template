import ItemItem from './ItemItem';

export default function ItemList({ items, onUpdate, onDelete }) {
    if (items.length === 0) {
        return <p className="text-base-content/50 text-center py-4">No items yet. Add one above!</p>;
    }

    return (
        <ul className="divide-y divide-base-300">
            {items.map((item) => (
                <ItemItem
                    key={item.id}
                    item={item}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
