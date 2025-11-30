import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// Removed unused Edit2 import
import HeaderBar from './components/HeaderBar';
import MainContent from './components/MainContent';
import MembersPanel from './components/MembersPanel';
import ItemsPanel from './components/ItemsPanel';
import OwnerBadge from './components/OwnerBadge';

// Current user (align with backend seed data user-1)
const CURRENT_USER = {
  id: 'user-1',
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
  const loadListData = useCallback(async () => {
    if (!(listId || routeId)) return;
    const targetId = listId || routeId;
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/shoppingList/get', { params: { id: targetId } });
      const apiPayload = response.data;
      const fetched = apiPayload?.data;
      if (!fetched) {
        navigate('/lists');
        return;
      }
      // Backend already provides owner as string id; wrap like earlier logic
      const transformedList = transformListData(fetched);
      setLocalState(transformedList);
      setIsLoading(false);
    } catch (e) {
      console.error('Failed to fetch list', e);
      navigate('/lists');
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
  
  // Refetch list after a mutating operation to ensure consistency
  const refreshList = async () => {
    await loadListData();
  };

  // Local-only persistence was removed; keep state updates local until backend rename/member flows are wired.

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
    }
  };

  const handleLeaveList = () => {
    if (onLeaveList) {
      onLeaveList();
    } else {
      navigate('/lists');
    }
  };

  const handleAddItem = async (itemName) => {
    if (onAddItem) {
      onAddItem(itemName);
      return;
    }
    if (!itemName.trim()) return;
    try {
      const response = await axios.post('http://localhost:4000/item/add', { name: itemName.trim(), listId: localState.id }, { headers: { 'x-profile': 'owner' } });
      const added = response.data?.data;
      if (added) {
        // Append quickly then refresh list for resolved flag sync
        setLocalState(prev => ({ ...prev, items: [...prev.items, added] }));
        await refreshList();
      }
    } catch (e) {
      console.error('Add item failed', e);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
      return;
    }
    try {
      await axios.delete('http://localhost:4000/item/remove', { data: { id: itemId }, headers: { 'x-profile': 'owner' } });
      setLocalState(prev => ({ ...prev, items: prev.items.filter(i => i.id !== itemId) }));
    } catch (e) {
      console.error('Remove item failed', e);
    }
  };

  const handleToggleResolved = async (itemId) => {
    if (onToggleShowResolved) {
      // parent-controlled scenario not used now
    }
    // Optimistic UI toggle
    setLocalState(prev => ({
      ...prev,
      items: prev.items.map(it => it.id === itemId ? { ...it, resolved: !it.resolved } : it)
    }));
    try {
      const item = localState.items.find(i => i.id === itemId);
      const endpoint = item?.resolved ? 'unresolve' : 'resolve'; // because we toggled already
      await axios.put(`http://localhost:4000/item/${endpoint}`, { id: itemId }, { headers: { 'x-profile': 'owner' } });
      // Refresh to ensure server truth
      await refreshList();
    } catch (e) {
      console.error('Toggle resolved failed', e);
      // revert on error
      setLocalState(prev => ({
        ...prev,
        items: prev.items.map(it => it.id === itemId ? { ...it, resolved: !it.resolved } : it)
      }));
    }
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

  const handleArchiveToggle = async () => {
    if (!localState) return;
    try {
      const endpoint = localState.archived ? 'unarchive' : 'archive';
      await axios.put(`http://localhost:4000/shoppingList/${endpoint}`,
        { id: localState.id },
        { headers: { 'x-profile': 'owner' } }
      );
      setLocalState(prev => ({ ...prev, archived: !prev.archived }));
    } catch (e) {
      console.error('Archive toggle failed', e);
    }
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
              <h1 className={`text-3xl font-bold flex-1 ${localState.archived ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{currentListName}</h1>
              {currentIsOwner && (
                <>
                  <OwnerBadge text="Owner" />
                  <button
                    onClick={handleArchiveToggle}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${localState.archived ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {localState.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
                    aria-label="Edit name"
                  >
                    Rename
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
