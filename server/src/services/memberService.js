const { members, shoppingLists } = require("../data/mockData");
const generateId = () => `id-${Math.random().toString(36).substr(2, 9)}`;

const service = {
  add: (dtoIn) => {
    const member = { id: generateId(), ...dtoIn };
    members.push(member);
    // Add to list
    const list = shoppingLists.find(l => l.id === dtoIn.listId);
    if (list && !list.members.includes(member.id)) list.members.push(member.id);
    return member;
  },
  remove: (listId, memberId) => {
    const idx = members.findIndex(m => m.id === memberId);
    if (idx > -1) members.splice(idx, 1);
    const list = shoppingLists.find(l => l.id === listId);
    if (list) list.members = list.members.filter(m => m !== memberId);
    return true;
  },
  list: (listId) => members.filter(m => {
    const list = shoppingLists.find(l => l.id === listId);
    return list && list.members.includes(m.id);
  })
};
// Legacy in-memory member service retained for potential direct import (prefer new mock service under services/mock).
module.exports = require("./mock/memberService.mock");
