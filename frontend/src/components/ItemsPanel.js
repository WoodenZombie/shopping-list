import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';

// ItemRow component
function ItemRow({ item, onToggle, onRemove, showResolved }) {
  if (!showResolved && item.resolved) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <input
        type="checkbox"
        checked={item.resolved}
        onChange={() => onToggle(item.id)}
        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 text-gray-700 ${
          item.resolved ? 'line-through text-gray-400' : ''
        }`}
      >
        {item.name}
      </span>
      <button
        onClick={() => onRemove(item.id)}
        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

function ItemsPanel({
  items,
  showResolved,
  onAddItem,
  onRemoveItem,
  onToggleResolved,
  onToggleShowResolved,
  onToggleItemResolved
}) {
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName('');
    }
  };

  const visibleItems = showResolved
    ? items
    : items.filter(item => !item.resolved);

  const totalItems = items.length;
  const resolvedItems = items.filter(item => item.resolved).length;
  const remainingItems = totalItems - resolvedItems;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>

      {/* Add item form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add new item…"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Check size={18} />
          Add
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-1 mb-6 min-h-[200px]">
        {visibleItems.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No items found</p>
        ) : (
          visibleItems.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={onToggleItemResolved || onToggleResolved}
              onRemove={onRemoveItem}
              showResolved={showResolved}
            />
          ))
        )}
      </div>

      {/* Item statistics and show resolved link */}
      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <div className="flex gap-4 text-sm text-gray-600">
          <span>
            <span className="font-semibold">{totalItems}</span> total
          </span>
          <span>
            <span className="font-semibold">{resolvedItems}</span> resolved
          </span>
          <span>
            <span className="font-semibold">{remainingItems}</span> remaining
          </span>
        </div>
        <button
          onClick={onToggleShowResolved}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          {showResolved ? 'Hide' : 'Show'} resolved items
        </button>
      </div>
    </div>
  );
}

export default ItemsPanel;

