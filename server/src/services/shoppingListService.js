const ShoppingList = require("../models/ShoppingList");

const service = {
  create: async (dtoIn) => {
    const list = new ShoppingList({
      name: dtoIn.name,
      ownerId: dtoIn.owner,
      // Do not duplicate owner inside members; members will contain only non-owner collaborators.
      members: [],
      items: [],
      isArchived: false
    });
    await list.save();
    return list;
  },
  list: async (userId) => {
    if (userId) {
      // Return lists where the user is the owner OR a member
      return await ShoppingList.find({
        $or: [
          { ownerId: userId },
          { "members.userId": userId }
        ]
      });
    }
    return await ShoppingList.find();
  },
  get: async (id) => {
    return await ShoppingList.findById(id);
  },
  update: async (id, dtoIn) => {
    return await ShoppingList.findByIdAndUpdate(id, dtoIn, { new: true });
  },
  archive: async (id) => {
    return await ShoppingList.findByIdAndUpdate(id, { isArchived: true }, { new: true });
  },
  unarchive: async (id) => {
    return await ShoppingList.findByIdAndUpdate(id, { isArchived: false }, { new: true });
  },
  delete: async (id) => {
    return await ShoppingList.findByIdAndDelete(id);
  },
  leave: async (id, userId) => {
    const list = await ShoppingList.findById(id);
    if (list) {
      list.members = list.members.filter(m => m.userId !== userId);
      await list.save();
    }
    return true;
  }
};

module.exports = service;
