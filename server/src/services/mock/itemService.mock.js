// In-memory mock Item service. Items are embedded inside shoppingLists similar to Mongo design.
const { shoppingLists } = require('../../data/mockData');

function findListById(id) {
  return shoppingLists.find(l => l._id === id || l.id === id);
}

function ensureEmbedded(list) {
  if (!list.items || Array.isArray(list.items) && typeof list.items[0] === 'string') {
    list.items = list.items && typeof list.items[0] === 'string' ? [] : (list.items || []);
  }
}

function toDto(item) { return { id: item._id, name: item.name, resolved: !!item.isResolved }; }

const service = {
  async add(dtoIn) {
    const list = findListById(dtoIn.listId);
    if (!list) return { error: 'LIST_NOT_FOUND' };
    ensureEmbedded(list);
    const newItem = { _id: `item-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, name: dtoIn.name, isResolved: false };
    list.items.push(newItem);
    return { data: toDto(newItem) };
  },
  async remove(id) {
    const list = shoppingLists.find(l => l.items && l.items.some(i => i._id === id));
    if (!list) return { error: 'ITEM_NOT_FOUND' };
    list.items = list.items.filter(i => i._id !== id);
    return { data: { id } };
  },
  async update(id, dtoIn) {
    const list = shoppingLists.find(l => l.items && l.items.some(i => i._id === id));
    if (!list) return { error: 'ITEM_NOT_FOUND' };
    const item = list.items.find(i => i._id === id);
    if (!item) return { error: 'ITEM_NOT_FOUND' };
    if (dtoIn.name !== undefined) item.name = dtoIn.name;
    return { data: toDto(item) };
  },
  async resolve(id) {
    const list = shoppingLists.find(l => l.items && l.items.some(i => i._id === id));
    if (!list) return { error: 'ITEM_NOT_FOUND' };
    const item = list.items.find(i => i._id === id); if (!item) return { error: 'ITEM_NOT_FOUND' };
    item.isResolved = true; return { data: toDto(item) };
  },
  async unresolve(id) {
    const list = shoppingLists.find(l => l.items && l.items.some(i => i._id === id));
    if (!list) return { error: 'ITEM_NOT_FOUND' };
    const item = list.items.find(i => i._id === id); if (!item) return { error: 'ITEM_NOT_FOUND' };
    item.isResolved = false; return { data: toDto(item) };
  },
  async list(listId) {
    const list = findListById(listId);
    if (!list) return { error: 'LIST_NOT_FOUND' };
    ensureEmbedded(list);
    return { data: list.items.map(toDto) };
  },
  async get(id) {
    const list = shoppingLists.find(l => l.items && l.items.some(i => i._id === id));
    if (!list) return { error: 'ITEM_NOT_FOUND' };
    const item = list.items.find(i => i._id === id);
    if (!item) return { error: 'ITEM_NOT_FOUND' };
    return { data: toDto(item), listId: list._id || list.id };
  }
};

module.exports = service;
