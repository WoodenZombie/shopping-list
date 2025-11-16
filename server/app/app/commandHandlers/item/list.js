/**
 * Command handler for item/list
 * Business logic not implemented yet - returns mock data
 */
const Item = require("../../models/Item");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const filters = {};
  if (dtoIn.resolved !== undefined) {
    filters.resolved = dtoIn.resolved;
  }
  
  const itemList = await Item.list(ucEnv, dtoIn.listId, filters);
  
  return {
    itemList: itemList.map(item => ({
      id: item.id,
      listId: item.listId,
      name: item.name,
      isResolved: item.isResolved
    }))
  };
}

module.exports = handler;
