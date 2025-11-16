/**
 * Command handler for item/add
 * Business logic not implemented yet - returns mock data
 */
const Item = require("../../models/Item");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const itemData = {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: dtoIn.name
  };
  
  const item = await Item.add(ucEnv, dtoIn.listId, itemData);
  
  if (!item) {
    throw new Error("Shopping list not found");
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
