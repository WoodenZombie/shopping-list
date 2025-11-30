import React from 'react';
import { Trash2 } from 'lucide-react';

// Helper function to get initials with safe fallbacks (name -> email -> userId -> '?')
const getInitials = (name, email, userId) => {
  const source = (name && name.trim()) || (email && email.split('@')[0]) || userId || '?';
  const parts = source.split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const initials = parts.map(p => p[0]).join('').toUpperCase();
  return initials.slice(0, 2);
};

function MemberCard({ id, name, email, userId, isOwner, onRemove }) {
  const displayName = name || (email ? email.split('@')[0] : userId || 'Unknown');
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
          {getInitials(displayName, email, userId)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">{displayName}</span>
            {isOwner && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">Owner</span>}
          </div>
          <p className="text-gray-400 text-sm">{email}</p>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          aria-label="Remove member"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}

export default MemberCard;

