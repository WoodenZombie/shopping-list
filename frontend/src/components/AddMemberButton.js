import React from 'react';
import { UserPlus } from 'lucide-react';

function AddMemberButton({ label = 'Add Member', onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
    >
      <UserPlus size={18} />
      {label}
    </button>
  );
}

export default AddMemberButton;

