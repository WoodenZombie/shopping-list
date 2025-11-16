/**
 * Command handler for item/get
 * Business logic not implemented yet - returns mock data
 */
const Item = require("../../models/Item");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const item = await Item.get(ucEnv, dtoIn.listId, dtoIn.id);
  
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
