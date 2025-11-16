/**
 * Command handler for item/update
 * Business logic not implemented yet - returns mock data
 */
const Item = require("../../models/Item");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const updateData = {};
  if (dtoIn.name !== undefined) {
    updateData.name = dtoIn.name;
  }
  
  const item = await Item.update(ucEnv, dtoIn.listId, dtoIn.id, updateData);
  
  if (!item) {
    throw new Error("Item not found");
  }
  
  return {
    item: {
      id: item.id,
      listId: item.listId,
      name: item.name,
      isResolved: item.isResolved
    }
  };
}

module.exports = handler;
