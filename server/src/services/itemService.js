// Mongo-backed item operations using embedded items in ShoppingList.
// Items are stored inside the ShoppingList.items array (see ShoppingList model).
// Each item has _id (ObjectId), name, isResolved.
const ShoppingList = require("../models/ShoppingList");

function toDto(item) {
  if (!item) return null;
  return {
    id: item._id.toString(),
    name: item.name,
    resolved: !!item.isResolved
  };
}

const service = {
  async add(dtoIn) {
    const { listId, name } = dtoIn;
    const list = await ShoppingList.findById(listId);
    if (!list) return { error: "LIST_NOT_FOUND" };
    list.items.push({ name });
    await list.save();
    const added = list.items[list.items.length - 1];
    return { data: toDto(added) };
  },
  async remove(id) {
    // Find list containing the item
    const list = await ShoppingList.findOne({ "items._id": id });
    if (!list) return { error: "ITEM_NOT_FOUND" };
    list.items.id(id).deleteOne();
    await list.save();
    return { data: { id } };
  },
  async update(id, dtoIn) {
    const list = await ShoppingList.findOne({ "items._id": id });
    if (!list) return { error: "ITEM_NOT_FOUND" };
    const item = list.items.id(id);
    if (!item) return { error: "ITEM_NOT_FOUND" };
    if (dtoIn.name !== undefined) item.name = dtoIn.name;
    await list.save();
    return { data: toDto(item) };
  },
  async resolve(id) {
    const list = await ShoppingList.findOne({ "items._id": id });
    if (!list) return { error: "ITEM_NOT_FOUND" };
    const item = list.items.id(id);
    if (!item) return { error: "ITEM_NOT_FOUND" };
    item.isResolved = true;
    await list.save();
    return { data: toDto(item) };
  },
  async unresolve(id) {
    const list = await ShoppingList.findOne({ "items._id": id });
    if (!list) return { error: "ITEM_NOT_FOUND" };
    const item = list.items.id(id);
    if (!item) return { error: "ITEM_NOT_FOUND" };
    item.isResolved = false;
    await list.save();
    return { data: toDto(item) };
  },
  async list(listId) {
    const list = await ShoppingList.findById(listId);
    if (!list) return { error: "LIST_NOT_FOUND" };
    return { data: list.items.map(toDto) };
  },
  async get(id) {
    const list = await ShoppingList.findOne({ "items._id": id });
    if (!list) return { error: "ITEM_NOT_FOUND" };
    const item = list.items.id(id);
    if (!item) return { error: "ITEM_NOT_FOUND" };
    return { data: toDto(item), listId: list._id.toString() };
  }
};

module.exports = service;
