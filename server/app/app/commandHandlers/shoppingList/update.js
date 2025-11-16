/**
 * Command handler for shoppingList/update
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const updateData = {};
  if (dtoIn.name !== undefined) {
    updateData.name = dtoIn.name;
  }
  
  const shoppingList = await ShoppingList.update(ucEnv, dtoIn.id, updateData);
  
  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }
  
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
