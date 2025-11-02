import React from 'react';
import { ArrowLeft } from 'lucide-react';

function HeaderBar({ title, subtitle, onBack }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-800 flex-1">{title}</h1>
      </div>
      {subtitle && <p className="text-gray-500 text-sm ml-1">{subtitle}</p>}
    </div>
  );
}

export default HeaderBar;

