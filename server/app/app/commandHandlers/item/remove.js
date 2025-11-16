/**
 * Command handler for item/remove
 * Business logic not implemented yet - returns mock data
 */
const Item = require("../../models/Item");

async function handler(ucEnv, dtoIn) {
  // TODO: Implement business logic
  
  const removed = await Item.remove(ucEnv, dtoIn.listId, dtoIn.id);
  
  if (!removed) {
    throw new Error("Item not found");
  }
  
  return {};
}

module.exports = handler;
