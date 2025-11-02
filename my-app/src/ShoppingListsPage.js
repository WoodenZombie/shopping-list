import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import { Plus, Trash2, Archive } from 'lucide-react';

// Mock data for shopping lists
const INITIAL_LISTS = [
  {
    id: '1',
    name: 'Weekly Groceries',
    owner: {
      id: '1',
      name: 'John Doe'
    },
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
    owner: {
      id: '1',
      name: 'John Doe'
    },
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
    owner: {
      id: '1',
      name: 'John Doe'
    },
    members: [],
    items: [],
    archived: true
  }
];

const CURRENT_USER = {
  id: '1',
  name: 'John Doe'
};

function ShowArchivedToggle({ isArchivedView, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
        isArchivedView
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <Archive size={18} className="inline mr-2" />
      {isArchivedView ? 'Hide Archived' : 'Show Archived'}
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

function CreateListModal({ isOpen, listName, onClose, onCreate }) {
  const [name, setName] = useState(listName || '');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New List</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            List Name
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
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function ShoppingListCard({ list, isOwner, onSelectList, onDeleteList }) {
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
              onDeleteList(list.id);
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

function ShoppingListGrid({ lists, onSelectList, onDeleteList, currentUserId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map(list => (
        <ShoppingListCard
          key={list.id}
          list={list}
          isOwner={list.owner.id === currentUserId}
          onSelectList={onSelectList}
          onDeleteList={onDeleteList}
        />
      ))}
    </div>
  );
}

function ShoppingListsPage({
  user,
  lists,
  isArchivedView,
  onCreateList,
  onOpenList,
  onToggleArchivedView,
  onDeleteList
}) {
  const navigate = useNavigate();
  const [localLists, setLocalLists] = useState(INITIAL_LISTS);
  const [localIsArchivedView, setLocalIsArchivedView] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const currentUser = user || CURRENT_USER;
  const currentLists = lists || localLists;
  const currentIsArchivedView = isArchivedView !== undefined ? isArchivedView : localIsArchivedView;

  const filteredLists = currentIsArchivedView
    ? currentLists.filter(list => list.archived)
    : currentLists.filter(list => !list.archived);

  const handleCreateList = (name) => {
    if (onCreateList) {
      onCreateList(name);
    } else {
      const newList = {
        id: String(Date.now()),
        name: name,
        owner: { id: currentUser.id, name: currentUser.name },
        members: [],
        items: [],
        archived: false
      };
      setLocalLists([...localLists, newList]);
    }
    setIsCreateModalOpen(false);
  };

  const handleOpenList = (listId) => {
    if (onOpenList) {
      onOpenList(listId);
    } else {
      navigate(`/list/${listId}`);
    }
  };

  const handleToggleArchivedView = () => {
    if (onToggleArchivedView) {
      onToggleArchivedView();
    } else {
      setLocalIsArchivedView(!localIsArchivedView);
    }
  };

  const handleDeleteList = (listId) => {
    if (onDeleteList) {
      onDeleteList(listId);
    } else {
      setLocalLists(localLists.filter(list => list.id !== listId));
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
            <ShowArchivedToggle
              isArchivedView={currentIsArchivedView}
              onToggle={handleToggleArchivedView}
            />
            <CreateListButton
              label="Create New List"
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>

        <ShoppingListGrid
          lists={filteredLists}
          onSelectList={handleOpenList}
          onDeleteList={handleDeleteList}
          currentUserId={currentUser.id}
        />

        <CreateListModal
          isOpen={isCreateModalOpen}
          listName=""
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateList}
        />
      </div>
    </div>
  );
}

export default ShoppingListsPage;

