/**
 * Command handler for shoppingList/list
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const filters = {};
  if (dtoIn.resolved !== undefined) {
    // Note: resolved filter applies to items, not lists
    // This would need to filter lists that have resolved/unresolved items
  }
  
  const itemList = await ShoppingList.list(ucEnv, filters);
  
  return {
    itemList: itemList.map(list => ({
      id: list.id,
      name: list.name,
      ownerId: list.ownerId,
      isArchived: list.isArchived,
      members: list.members,
      items: list.items
    }))
  };
}

module.exports = handler;
