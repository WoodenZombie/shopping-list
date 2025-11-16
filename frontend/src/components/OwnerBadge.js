import React from 'react';

function OwnerBadge({ text = 'Owner' }) {
  return (
    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
      {text}
    </span>
  );
}

export default OwnerBadge;

