import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import { Plus, Trash2, Filter } from 'lucide-react';

// Default shopping lists - stored as constant at route level
const defaultLists = [
  {
    id: '1',
    name: 'Weekly Groceries',
    owner: 'user1',
    members: [
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Bob Johnson' }
    ],
    items: [
      { id: '1', name: 'Milk', resolved: false },
      { id: '2', name: 'Bread', resolved: false },
      { id: '3', name: 'Eggs', resolved: true }
    ],
    archived: false
  },
  {
    id: '2',
    name: 'Party Supplies',
    owner: 'user1',
    members: [
      { id: '4', name: 'Alice Brown' }
    ],
    items: [
      { id: '4', name: 'Balloons', resolved: false }
    ],
    archived: false
  },
  {
    id: '3',
    name: 'Old List',
    owner: 'user1',
    members: [],
    items: [],
    archived: true
  }
];

const CURRENT_USER = {
  id: 'user1',
  name: 'John Doe'
};

// Filter component - Show only active vs Show all
function FilterToggle({ showAll, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
        showAll
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <Filter size={18} />
      {showAll ? 'Show All' : 'Show Only Active'}
    </button>
  );
}

function CreateListButton({ label = 'Create New List', onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
    >
      <Plus size={18} />
      {label}
    </button>
  );
}

// Modal for creating a new shopping list
function CreateListModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Shopping List</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shopping List Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Enter list name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// Confirmation dialog for deleting a shopping list
function DeleteConfirmationModal({ isOpen, listName, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Shopping List</h2>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">"{listName}"</span>? 
          This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Shopping list tile component
function ShoppingListCard({ list, isOwner, onSelectList, onDeleteClick }) {
  const totalItems = list.items.length;
  const resolvedItems = list.items.filter(item => item.resolved).length;
  const remainingItems = totalItems - resolvedItems;

  return (
    <div
      onClick={() => onSelectList(list.id)}
      className="bg-white shadow-md rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex-1">{list.name}</h3>
        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(list.id, list.name);
            }}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
            aria-label="Delete list"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">{totalItems}</span>
          <span>total items</span>
          <span className="text-gray-400">•</span>
          <span className="font-semibold">{resolvedItems}</span>
          <span>resolved</span>
          <span className="text-gray-400">•</span>
          <span className="font-semibold">{remainingItems}</span>
          <span>remaining</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{list.members.length + 1}</span>
          <span>members</span>
          {isOwner && (
            <>
              <span className="text-gray-400">•</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                Owner
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Grid component for displaying shopping list tiles
function ShoppingListGrid({ lists, onSelectList, onDeleteClick, currentUserId }) {
  // Helper function to check if user is owner (supports both string ID and object owner)
  const isOwner = (list) => {
    if (typeof list.owner === 'string') {
      return list.owner === currentUserId;
    }
    return list.owner?.id === currentUserId;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map(list => (
        <ShoppingListCard
          key={list.id}
          list={list}
          isOwner={isOwner(list)}
          onSelectList={onSelectList}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}

// Main Shopping Lists Overview Route component
function ShoppingListsPage({
  user,
  lists,
  showAllLists,
  onCreateList,
  onOpenList,
  onToggleShowAll,
  onDeleteList
}) {
  const navigate = useNavigate();
  
  // Initialize state from localStorage or defaultLists
  // This function is only called once during component initialization
  const initializeLists = () => {
    try {
      const storedLists = localStorage.getItem('shoppingLists');
      if (storedLists) {
        const parsedLists = JSON.parse(storedLists);
        // Only use stored lists if they're valid and non-empty
        if (parsedLists && Array.isArray(parsedLists) && parsedLists.length > 0) {
          return parsedLists;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored lists:', e);
      // If there's corrupted data, remove it
      localStorage.removeItem('shoppingLists');
    }
    // If no stored lists, empty array, or error, use defaults and save them
    localStorage.setItem('shoppingLists', JSON.stringify(defaultLists));
    return defaultLists;
  };
  
  // State management using useState - initialize from localStorage
  const [shoppingLists, setShoppingLists] = useState(initializeLists);
  const [localShowAll, setLocalShowAll] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, listId: null, listName: '' });
  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Sync state to localStorage whenever shoppingLists changes (but not on initial mount)
  useEffect(() => {
    if (!lists && isInitialized) { // Only sync if not controlled by props and after initialization
      localStorage.setItem('shoppingLists', JSON.stringify(shoppingLists));
    }
  }, [shoppingLists, lists, isInitialized]);

  const currentUser = user || CURRENT_USER;
  const currentLists = lists || shoppingLists;
  const currentShowAll = showAllLists !== undefined ? showAllLists : localShowAll;

  // Filter lists based on showAll state
  // showAll = false: show only non-archived (active)
  // showAll = true: show all including archived
  const filteredLists = currentShowAll
    ? currentLists
    : currentLists.filter(list => !list.archived);

  // Handle creating a new shopping list
  const handleCreateList = (name) => {
    if (onCreateList) {
      onCreateList(name);
    } else {
      const newList = {
        id: crypto.randomUUID(),
        name: name,
        owner: currentUser.id,
        members: [],
        items: [],
        archived: false
      };
      const updatedLists = [...shoppingLists, newList];
      setShoppingLists(updatedLists);
      // Immediately save to localStorage
      localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
    }
    setIsCreateModalOpen(false);
  };

  // Handle navigation to shopping list detail route
  const handleOpenList = (listId) => {
    if (onOpenList) {
      onOpenList(listId);
    } else {
      navigate("/shopping-list/" + listId);
    }
  };

  // Handle filter toggle
  const handleToggleShowAll = () => {
    if (onToggleShowAll) {
      onToggleShowAll();
    } else {
      setLocalShowAll(!localShowAll);
    }
  };

  // Handle delete click - opens confirmation dialog
  const handleDeleteClick = (listId, listName) => {
    setDeleteConfirmation({ isOpen: true, listId, listName });
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    const { listId } = deleteConfirmation;
    
    if (onDeleteList) {
      onDeleteList(listId);
    } else {
      const updatedLists = shoppingLists.filter(list => list.id !== listId);
      setShoppingLists(updatedLists);
      // Immediately save to localStorage
      localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
    }
    
    setDeleteConfirmation({ isOpen: false, listId: null, listName: '' });
  };

  // Helper function to check if user is owner (supports both string ID and object owner)
  const isOwner = (list) => {
    if (typeof list.owner === 'string') {
      return list.owner === currentUser.id;
    }
    return list.owner?.id === currentUser.id;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <HeaderBar
            title="Shopping Lists"
            subtitle="Manage your shopping lists"
          />
          <div className="flex gap-3">
            <FilterToggle
              showAll={currentShowAll}
              onToggle={handleToggleShowAll}
            />
            <CreateListButton
              label="+ Add shopping list"
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>

        <ShoppingListGrid
          lists={filteredLists}
          onSelectList={handleOpenList}
          onDeleteClick={handleDeleteClick}
          currentUserId={currentUser.id}
        />

        <CreateListModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateList}
        />

        <DeleteConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          listName={deleteConfirmation.listName}
          onClose={() => setDeleteConfirmation({ isOpen: false, listId: null, listName: '' })}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}

export default ShoppingListsPage;

