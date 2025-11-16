/**
 * Command handler for shoppingList/delete
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const deleted = await ShoppingList.delete(ucEnv, dtoIn.id);
  
  if (!deleted) {
    throw new Error("Shopping list not found");
  }
  
  return {};
}

module.exports = handler;
