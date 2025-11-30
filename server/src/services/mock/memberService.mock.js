// In-memory mock member service using shoppingLists for membership.
const { shoppingLists, members } = require('../../data/mockData');

function findList(id) { return shoppingLists.find(l => l._id === id || l.id === id); }

const service = {
  async add(dtoIn) {
    const list = findList(dtoIn.listId);
    if (!list) return { error: 'LIST_NOT_FOUND' };
    if (!list.members) list.members = [];
    if (list.members.some(m => m.userId === dtoIn.userId)) return { error: 'MEMBER_EXISTS' };
    const member = { userId: dtoIn.userId, email: dtoIn.email, role: dtoIn.role };
    list.members.push(member);
    // Maintain global members array for potential lookup
    if (!members.find(m => m.id === dtoIn.userId)) {
      members.push({ id: dtoIn.userId, name: dtoIn.email?.split('@')[0] || dtoIn.userId, email: dtoIn.email, role: dtoIn.role });
    }
    return { data: list };
  },
  async remove(dtoIn) {
    const list = findList(dtoIn.listId);
    if (!list) return { error: 'LIST_NOT_FOUND' };
    list.members = (list.members || []).filter(m => m.userId !== dtoIn.userId);
    return { data: list };
  },
  async list(listId) {
    const list = findList(listId);
    if (!list) return { error: 'LIST_NOT_FOUND' };
    return { data: list.members || [] };
  }
};

module.exports = service;
