// In-memory mock ShoppingList service compatible with controller expectations.
const { shoppingLists } = require('../../data/mockData');

// Ensure mock lists have fields similar to Mongo documents used by toDto.
function normalize(list) {
  if (!list._id) list._id = list.id || `list-${Math.random().toString(36).slice(2, 10)}`;
  if (!list.members) list.members = []; // members as array of objects { userId }
  if (!list.items) list.items = []; // items as array of objects { _id, name, isResolved }
  if (list.archived !== undefined && list.isArchived === undefined) list.isArchived = list.archived;
  return list;
}

// Convert legacy mockData shape to new shape at startup
shoppingLists.forEach(l => {
  normalize(l);
  // Convert primitive member IDs to objects
  if (Array.isArray(l.members) && l.members.length && typeof l.members[0] === 'string') {
    l.members = l.members.map(m => ({ userId: m }));
  }
  // Convert primitive item IDs if necessary (items currently array of ids referencing items array; leave empty here)
  if (Array.isArray(l.items) && l.items.length && typeof l.items[0] === 'string') {
    l.items = []; // We'll rely on add via item service; original id references removed.
  }
});

const service = {
  async create(dtoIn) {
    const list = normalize({
      _id: `list-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      name: dtoIn.name,
      ownerId: dtoIn.owner,
      members: [],
      items: [],
      isArchived: false
    });
    shoppingLists.push(list);
    return list;
  },
  async list(userId) {
    if (!userId) return shoppingLists.map(normalize);
    return shoppingLists.filter(l => l.ownerId === userId || l.members.some(m => m.userId === userId)).map(normalize);
  },
  async get(id) { return shoppingLists.find(l => (l._id === id || l.id === id)); },
  async update(id, dtoIn) {
    const list = shoppingLists.find(l => l._id === id || l.id === id);
    if (!list) return null;
    if (dtoIn.name !== undefined) list.name = dtoIn.name;
    return normalize(list);
  },
  async archive(id) { const l = shoppingLists.find(x => x._id === id || x.id === id); if (l) l.isArchived = true; return normalize(l); },
  async unarchive(id) { const l = shoppingLists.find(x => x._id === id || x.id === id); if (l) l.isArchived = false; return normalize(l); },
  async delete(id) { const idx = shoppingLists.findIndex(l => l._id === id || l.id === id); if (idx > -1) shoppingLists.splice(idx,1); return true; },
  async leave(id, userId) { const l = shoppingLists.find(x => x._id === id || x.id === id); if (l) { l.members = l.members.filter(m => m.userId !== userId); } return true; }
};

module.exports = service;
