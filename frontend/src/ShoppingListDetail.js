import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import HeaderBar from './components/HeaderBar';
import MainContent from './components/MainContent';
import MembersPanel from './components/MembersPanel';
import ItemsPanel from './components/ItemsPanel';
import OwnerBadge from './components/OwnerBadge';

// Default shopping lists - shared with ShoppingListsPage
// This should match the defaultLists in ShoppingListsPage.js
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

// Current user - for demonstration
const CURRENT_USER = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com'
};

// Helper function to transform list data structure (owner as string) to component format (owner as object)
const transformListData = (list) => {
  if (!list) return null;
  
  // If owner is already an object, return as is
  if (typeof list.owner === 'object' && list.owner !== null) {
    return list;
  }
  
  // Transform owner from string ID to object
  return {
    ...list,
    owner: {
      id: list.owner || CURRENT_USER.id,
      name: CURRENT_USER.name,
      email: CURRENT_USER.email
    }
  };
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
  
  // State management
  const [localState, setLocalState] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [localShowResolved, setLocalShowResolved] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to load list data - memoized with useCallback
  const loadListData = useCallback(() => {
    if (listId || routeId) {
      const targetId = listId || routeId;
      
      // Try to get from localStorage first (in case lists were updated)
      const storedLists = localStorage.getItem('shoppingLists');
      let allLists = defaultLists;
      
      if (storedLists) {
        try {
          const parsed = JSON.parse(storedLists);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            allLists = parsed;
          }
        } catch (e) {
          console.error('Failed to parse stored lists:', e);
        }
      }
      
      // Find the list by ID
      const foundList = allLists.find(list => list.id === targetId);
      
      if (foundList) {
        const transformedList = transformListData(foundList);
        setLocalState(transformedList);
        setIsLoading(false);
      } else {
        // List not found, redirect to lists page
        navigate('/lists');
      }
    }
  }, [listId, routeId, navigate]);

  // Load list data based on route parameter
  useEffect(() => {
    setIsLoading(true);
    loadListData();
  }, [loadListData]);
  
  // Determine if we're using props or local state
  const isControlled = listId !== undefined;
  
  // Get values
  const currentListId = listId || routeId;
  const currentListName = listName || (localState?.name || '');
  const currentIsOwner = isOwner !== undefined 
    ? isOwner 
    : (localState?.owner?.id === CURRENT_USER.id || localState?.owner === CURRENT_USER.id);
  const currentMembers = members || (localState ? [
    { ...localState.owner, isOwner: true },
    ...localState.members.map(m => ({ ...m, isOwner: false }))
  ] : []);
  const currentItems = items || (localState?.items || []);
  const currentShowResolved = showResolved !== undefined ? showResolved : localShowResolved;
  
  // Helper function to update stored list in localStorage
  const updateStoredList = (updatedList) => {
    try {
      const storedLists = localStorage.getItem('shoppingLists');
      let allLists = storedLists ? JSON.parse(storedLists) : defaultLists;
      
      const index = allLists.findIndex(list => list.id === updatedList.id);
      
      // Clean members array - remove isOwner and email if they exist, keep only id and name
      const cleanedMembers = (updatedList.members || []).map(member => {
        // Filter out the owner from members (owner is stored separately)
        if (member.isOwner) {
          return null; // Skip owner in members array
        }
        return {
          id: member.id,
          name: member.name
          // Don't include email or isOwner in storage
        };
      }).filter(m => m !== null); // Remove null entries
      
      // Transform back to storage format (owner as string, preserve all properties)
      const storageList = {
        id: updatedList.id,
        name: updatedList.name,
        owner: typeof updatedList.owner === 'object' && updatedList.owner !== null 
          ? updatedList.owner.id 
          : updatedList.owner,
        members: cleanedMembers,
        items: (updatedList.items || []).map(item => ({
          id: item.id,
          name: item.name,
          resolved: item.resolved !== undefined ? item.resolved : false
        })),
        archived: updatedList.archived !== undefined ? updatedList.archived : false
      };
      
      if (index !== -1) {
        // Update existing list
        allLists[index] = storageList;
      } else {
        // Add new list if it doesn't exist
        allLists.push(storageList);
      }
      
      localStorage.setItem('shoppingLists', JSON.stringify(allLists));
    } catch (e) {
      console.error('Failed to update stored list:', e);
    }
  };

  // Show loading state
  if (isLoading || !localState) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Handlers
  const handleRenameList = (newName) => {
    if (onRenameList) {
      onRenameList(newName);
    } else {
      const updatedList = { ...localState, name: newName };
      setLocalState(updatedList);
      updateStoredList(updatedList);
    }
    setIsEditingName(false);
  };
  
  const handleRenameInput = (e) => {
    const newName = e.target.value;
    if (onRenameList) {
      onRenameList(newName);
    } else {
      const updatedList = { ...localState, name: newName };
      setLocalState(updatedList);
      updateStoredList(updatedList);
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
      const updatedList = {
        ...localState,
        members: [...localState.members, newMember]
      };
      setLocalState(updatedList);
      updateStoredList(updatedList);
    }
  };

  const handleRemoveMember = (memberId) => {
    if (onRemoveMember) {
      onRemoveMember(memberId);
    } else {
      const updatedList = {
        ...localState,
        members: localState.members.filter(m => m.id !== memberId)
      };
      setLocalState(updatedList);
      updateStoredList(updatedList);
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
      const updatedList = {
        ...localState,
        items: [...localState.items, newItem]
      };
      setLocalState(updatedList);
      
      // Update localStorage to persist changes
      updateStoredList(updatedList);
    }
  };

  const handleRemoveItem = (itemId) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    } else {
      const updatedList = {
        ...localState,
        items: localState.items.filter(item => item.id !== itemId)
      };
      setLocalState(updatedList);
      updateStoredList(updatedList);
    }
  };

  const handleToggleResolved = (itemId) => {
    // Toggle individual item resolved status
    if (onToggleShowResolved) {
      // If parent controls items, we need a different handler
      // For now, handle locally
    }
    const updatedList = {
      ...localState,
      items: (currentItems || localState.items).map(item =>
        item.id === itemId ? { ...item, resolved: !item.resolved } : item
      )
    };
    setLocalState(updatedList);
    updateStoredList(updatedList);
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
