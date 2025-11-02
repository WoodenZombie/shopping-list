import React, { useState } from 'react';
import { X } from 'lucide-react';

function AddMemberModal({ isOpen, onClose, onAdd }) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (email.trim()) {
      onAdd(email.trim());
      setEmail('');
      onClose();
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Member</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Member Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter member email"
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
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;

