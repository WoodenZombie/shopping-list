import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import HeaderBar from './components/HeaderBar';
import MainContent from './components/MainContent';
import MembersPanel from './components/MembersPanel';
import ItemsPanel from './components/ItemsPanel';
import OwnerBadge from './components/OwnerBadge';

// Mock data for a shopping list - stored as constant at route level
const INITIAL_SHOPPING_LIST = {
  id: '1',
  name: 'Weekly Groceries',
  owner: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  },
  members: [
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com'
    }
  ],
  items: [
    {
      id: '1',
      name: 'Milk',
      resolved: false
    },
    {
      id: '2',
      name: 'Bread',
      resolved: false
    },
    {
      id: '3',
      name: 'Eggs',
      resolved: true
    },
    {
      id: '4',
      name: 'Butter',
      resolved: false
    },
    {
      id: '5',
      name: 'Cheese',
      resolved: true
    }
  ]
};

// Current user - for demonstration
const CURRENT_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

function ShoppingListDetail({
  listId,
  listName,
  isOwner,
  members,
  items,
  showResolved,
  onRenameList,
  onAddMember,
  onRemoveMember,
  onLeaveList,
  onAddItem,
  onRemoveItem,
  onToggleShowResolved
}) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  
  // Use props if provided, otherwise use local state with mock data
  const [localState, setLocalState] = useState(INITIAL_SHOPPING_LIST);
  const [isEditingName, setIsEditingName] = useState(false);
  const [localShowResolved, setLocalShowResolved] = useState(true);
  
  // Determine if we're using props or local state
  const isControlled = listId !== undefined;
  
  // Get values
  const currentListId = listId || routeId || localState.id;
  const currentListName = listName || localState.name;
  const currentIsOwner = isOwner !== undefined ? isOwner : (localState.owner.id === CURRENT_USER.id);
  const currentMembers = members || [
    { ...localState.owner, isOwner: true },
    ...localState.members.map(m => ({ ...m, isOwner: false }))
  ];
  const currentItems = items || localState.items;
  const currentShowResolved = showResolved !== undefined ? showResolved : localShowResolved;

  // Handlers
  const handleRenameList = (newName) => {
    if (onRenameList) {
      onRenameList(newName);
    } else {
      setLocalState({ ...localState, name: newName });
    }
    setIsEditingName(false);
  };
  
  const handleRenameInput = (e) => {
    const newName = e.target.value;
    if (onRenameList) {
      onRenameList(newName);
    } else {
      setLocalState({ ...localState, name: newName });
    }
  };

  const handleAddMember = (email) => {
    if (onAddMember) {
      onAddMember(email);
    } else {
      const newMember = {
        id: String(Date.now()),
        name: `User ${email.split('@')[0]}`,
        email: email,
        isOwner: false
      };
      setLocalState({
        ...localState,
        members: [...localState.members, newMember]
      });
    }
  };

  const handleRemoveMember = (memberId) => {
    if (onRemoveMember) {
      onRemoveMember(memberId);
    } else {
      setLocalState({
        ...localState,
        members: localState.members.filter(m => m.id !== memberId)
      });
    }
  };

  const handleLeaveList = () => {
    if (onLeaveList) {
      onLeaveList();
    } else {
      navigate('/lists');
    }
  };

  const handleAddItem = (itemName) => {
    if (onAddItem) {
      onAddItem(itemName);
    } else {
      const newItem = {
        id: String(Date.now()),
        name: itemName,
        resolved: false
      };
      setLocalState({
        ...localState,
        items: [...localState.items, newItem]
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    } else {
      setLocalState({
        ...localState,
        items: localState.items.filter(item => item.id !== itemId)
      });
    }
  };

  const handleToggleResolved = (itemId) => {
    // Toggle individual item resolved status
    if (onToggleShowResolved) {
      // If parent controls items, we need a different handler
      // For now, handle locally
    }
    setLocalState({
      ...localState,
      items: (currentItems || localState.items).map(item =>
        item.id === itemId ? { ...item, resolved: !item.resolved } : item
      )
    });
  };

  const handleToggleShowResolved = () => {
    if (onToggleShowResolved) {
      onToggleShowResolved();
    } else {
      setLocalShowResolved(!localShowResolved);
    }
  };

  const handleBack = () => {
    if (onLeaveList) {
      // Don't navigate if parent handles it
      return;
    }
    navigate('/lists');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with editable title */}
        <div className="mb-6 flex items-center gap-3">
          {isEditingName && currentIsOwner ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={currentListName}
                onChange={handleRenameInput}
                onBlur={() => setIsEditingName(false)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                  }
                  if (e.key === 'Escape') {
                    setIsEditingName(false);
                  }
                }}
                className="text-3xl font-bold text-gray-800 border-2 border-blue-500 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                aria-label="Go back"
              >
                ←
              </button>
              <h1 className="text-3xl font-bold text-gray-800 flex-1">{currentListName}</h1>
              {currentIsOwner && (
                <>
                  <OwnerBadge text="Owner" />
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Edit name"
                  >
                    <Edit2 size={24} />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Main Content with Members and Items panels */}
        <MainContent
          left={
            <MembersPanel
              members={currentMembers}
              isOwner={currentIsOwner}
              onAddMemberClick={() => {}}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              onLeaveList={handleLeaveList}
            />
          }
          right={
            <ItemsPanel
              items={currentItems}
              showResolved={currentShowResolved}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onToggleItemResolved={handleToggleResolved}
              onToggleShowResolved={handleToggleShowResolved}
            />
          }
        />
      </div>
    </div>
  );
}

export default ShoppingListDetail;
