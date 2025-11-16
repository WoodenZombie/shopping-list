/**
 * Command handler for shoppingList/create
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const shoppingListData = {
    id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: dtoIn.name,
    members: dtoIn.members || []
  };
  
  const shoppingList = await ShoppingList.create(ucEnv, shoppingListData);
  
  return {
    shoppingList: {
      id: shoppingList.id,
      name: shoppingList.name,
      ownerId: shoppingList.ownerId,
      isArchived: shoppingList.isArchived,
      members: shoppingList.members,
      items: shoppingList.items
    }
  };
}

module.exports = handler;
