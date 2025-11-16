/**
 * Command handler for shoppingList/leave
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const shoppingList = await ShoppingList.leave(ucEnv, dtoIn.id);
  
  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }
  
  return {};
}

module.exports = handler;
