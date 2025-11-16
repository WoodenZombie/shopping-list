import React, { useState } from 'react';
import MemberCard from './MemberCard';
import AddMemberButton from './AddMemberButton';
import AddMemberModal from './AddMemberModal';

function MembersPanel({
  members,
  isOwner,
  onAddMemberClick,
  onAddMember,
  onRemoveMember,
  onLeaveList
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMemberClick = () => {
    setIsModalOpen(true);
    if (onAddMemberClick) {
      onAddMemberClick();
    }
  };

  const handleAddMember = (email) => {
    if (onAddMember) {
      onAddMember(email);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Members</h2>
      
      <div className="space-y-1 mb-4">
        {members.map(member => (
          <MemberCard
            key={member.id}
            id={member.id}
            name={member.name}
            email={member.email}
            isOwner={member.isOwner || false}
            onRemove={isOwner && !member.isOwner ? onRemoveMember : undefined}
          />
        ))}
      </div>

      {isOwner && (
        <>
          <AddMemberButton onClick={handleAddMemberClick} />
          <AddMemberModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddMember}
          />
        </>
      )}

      {!isOwner && (
        <button
          onClick={onLeaveList}
          className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium mt-4"
        >
          Leave List
        </button>
      )}
    </div>
  );
}

export default MembersPanel;

