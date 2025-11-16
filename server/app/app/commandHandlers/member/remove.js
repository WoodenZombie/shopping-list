/**
 * Command handler for member/remove
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const shoppingList = await ShoppingList.removeMember(ucEnv, dtoIn.listId, dtoIn.userId);
  
  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }
  
  return {};
}

module.exports = handler;
