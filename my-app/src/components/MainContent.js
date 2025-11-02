import React from 'react';

function MainContent({ left, right }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export default MainContent;

