import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import { Plus, Trash2, Filter } from 'lucide-react';
import axios from 'axios';

// Align with backend seed data userId ("user-1") so created lists are visible on subsequent fetches
const CURRENT_USER = {
  id: 'user-1',
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
function ShoppingListCard({ list, isOwner, onSelectList, onDeleteClick, onToggleArchive }) {
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
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchive(list);
              }}
              className={`p-1.5 rounded transition-colors text-sm font-medium ${list.archived ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-label={list.archived ? 'Unarchive list' : 'Archive list'}
            >
              {list.archived ? 'Unarchive' : 'Archive'}
            </button>
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
          </div>
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
function ShoppingListGrid({ lists, onSelectList, onDeleteClick, onToggleArchive, currentUserId }) {
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
          onToggleArchive={onToggleArchive}
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
  
  const [shoppingLists, setShoppingLists] = useState([]);
  const [error, setError] = useState(null);
  const [localShowAll, setLocalShowAll] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, listId: null, listName: '' });
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch shopping lists from backend API
  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const response = await axios.get('/shoppingList/list', {
          params: { userId: (user || CURRENT_USER).id }
        });
        const apiPayload = response.data;
        const listsFromApi = Array.isArray(apiPayload?.data) ? apiPayload.data : [];
        setShoppingLists(listsFromApi);
      } catch (err) {
        console.error('Fetch lists failed:', err);
        setError('Failed to fetch shopping lists. Please try again later.');
      }
    };

    fetchShoppingLists();
  }, []);

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
  const currentLists = Array.isArray(lists) ? lists : shoppingLists;
  const currentShowAll = showAllLists !== undefined ? showAllLists : localShowAll;

  // Filter lists based on showAll state
  // showAll = false: show only non-archived (active)
  // showAll = true: show all including archived
  const filteredLists = currentShowAll
    ? currentLists
    : Array.isArray(currentLists) ? currentLists.filter(list => !list.archived) : [];

  // Handle creating a new shopping list
  const handleCreateList = async (name) => {
    try {
      if (onCreateList) {
        onCreateList(name);
      } else {
        const response = await axios.post(
          '/shoppingList/create',
          { name, owner: currentUser.id },
          { headers: { 'x-profile': 'owner' } }
        );
        const created = response.data?.data;
        if (created) {
          // Refetch lists to ensure consistent server state (in case of derived fields)
          setShoppingLists(prev => Array.isArray(prev) ? [...prev, created] : [created]);
        } else {
          console.warn('Create response missing data:', response.data);
        }
      }
    } catch (err) {
      const backendMsg = err?.response?.data?.uuAppErrorMap && Object.values(err.response.data.uuAppErrorMap)[0]?.message;
      console.error('Create list failed:', err);
      setError(backendMsg || 'Failed to create list.');
    } finally {
      setIsCreateModalOpen(false);
    }
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
  const handleConfirmDelete = async () => {
    const { listId } = deleteConfirmation;
    if (!listId) return;
    try {
      if (onDeleteList) {
        onDeleteList(listId);
      } else {
        await axios.delete('/shoppingList/delete', {
          data: { id: listId },
          headers: { 'x-profile': 'owner' }
        });
        // Remove from local state
        setShoppingLists(prev => prev.filter(list => list.id !== listId));
      }
    } catch (err) {
      console.error('Delete list failed:', err);
      setError('Failed to delete list.');
    } finally {
      setDeleteConfirmation({ isOpen: false, listId: null, listName: '' });
    }
  };

  // Helper function to check if user is owner (supports both string ID and object owner)
  const isOwner = (list) => {
    if (typeof list.owner === 'string') {
      return list.owner === currentUser.id;
    }
    return list.owner?.id === currentUser.id;
  };

  const handleToggleArchive = async (list) => {
    try {
      const endpoint = list.archived ? 'unarchive' : 'archive';
      await axios.put(`/shoppingList/${endpoint}`,
        { id: list.id },
        { headers: { 'x-profile': 'owner' } }
      );
      // Update local state
      setShoppingLists(prev => prev.map(l => l.id === list.id ? { ...l, archived: !l.archived } : l));
    } catch (err) {
      console.error('Archive toggle failed:', err);
      setError('Failed to toggle archive state.');
    }
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
              label="Add shopping list"
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <ShoppingListGrid
          lists={filteredLists}
          onSelectList={handleOpenList}
          onDeleteClick={handleDeleteClick}
          onToggleArchive={handleToggleArchive}
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

