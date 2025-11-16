/**
 * Command handler for member/list
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const shoppingList = await ShoppingList.get(ucEnv, dtoIn.listId);
  
  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }
  
  return {
    memberList: shoppingList.members.map(member => ({
      userId: member.userId,
      email: member.email
    }))
  };
}

module.exports = handler;
