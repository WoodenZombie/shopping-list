/**
 * Command handler for member/add
 * Business logic not implemented yet - returns mock data
 */
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  // TODO: Resolve email to userId
  
  const memberData = {
    email: dtoIn.email,
    userId: `user-${Date.now()}` // Mock - should resolve from email
  };
  
  const shoppingList = await ShoppingList.addMember(ucEnv, dtoIn.listId, memberData);
  
  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }
  
  const addedMember = shoppingList.members.find(m => m.email === dtoIn.email);
  
  return {
    member: {
      userId: addedMember.userId,
      email: addedMember.email
    }
  };
}

module.exports = handler;
