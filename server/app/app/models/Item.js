/**
 * Item Model - Mock implementation
 * In a real application, this would interact with a database
 */

const ShoppingList = require("./ShoppingList");

class Item {
  /**
   * Get item by ID
   * @param {Object} ucEnv - uuApp environment
   * @param {string} listId - Shopping list ID
   * @param {string} id - Item ID
   * @returns {Promise<Object|null>}
   */
  static async get(ucEnv, listId, id) {
    const shoppingList = await ShoppingList.get(ucEnv, listId);
    if (!shoppingList) return null;
    
    return shoppingList.items.find(item => item.id === id) || null;
  }

  /**
   * Add item to shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {string} listId - Shopping list ID
   * @param {Object} data - Item data
   * @returns {Promise<Object|null>}
   */
  static async add(ucEnv, listId, data) {
    const shoppingList = await ShoppingList.get(ucEnv, listId);
    if (!shoppingList) return null;
    
    const newItem = {
      id: data.id || `item-${Date.now()}`,
      listId: listId,
      name: data.name,
      isResolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    shoppingList.items.push(newItem);
    shoppingList.updatedAt = new Date().toISOString();
    return newItem;
  }

  /**
   * Update item
   * @param {Object} ucEnv - uuApp environment
   * @param {string} listId - Shopping list ID
   * @param {string} id - Item ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>}
   */
  static async update(ucEnv, listId, id, data) {
    const shoppingList = await ShoppingList.get(ucEnv, listId);
    if (!shoppingList) return null;
    
    const item = shoppingList.items.find(i => i.id === id);
    if (!item) return null;
    
    if (data.name !== undefined) item.name = data.name;
    item.updatedAt = new Date().toISOString();
    shoppingList.updatedAt = new Date().toISOString();
    
    return item;
  }

  /**
   * Remove item from shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {string} listId - Shopping list ID
   * @param {string} id - Item ID
   * @returns {Promise<boolean>}
   */
  static async remove(ucEnv, listId, id) {
    const shoppingList = await ShoppingList.get(ucEnv, listId);
    if (!shoppingList) return false;
    
    const index = shoppingList.items.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    shoppingList.items.splice(index, 1);
    shoppingList.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Resolve item
   * @param {Object} ucEnv - uuApp environment
   * @param {string} listId - Shopping list ID
   * @param {string} id - Item ID
   * @returns {Promise<Object|null>}
   */
  static async resolve(ucEnv, listId, id) {
    const shoppingList = await ShoppingList.get(ucEnv, listId);
    if (!shoppingList) return null;
    
    const item = shoppingList.items.find(i => i.id === id);
    if (!item) return null;
    
    item.isResolved = true;
    item.updatedAt = new Date().toISOString();
    shoppingList.updatedAt = new Date().toISOString();
    
    return item;
  }

  /**
   * Unresolve item
   * @param {Object} ucEnv - uuApp environment
   * @param {string} listId - Shopping list ID
   * @param {string} id - Item ID
   * @returns {Promise<Object|null>}
   */
  static async unresolve(ucEnv, listId, id) {
    const shoppingList = await ShoppingList.get(ucEnv, listId);
    if (!shoppingList) return null;
    
    const item = shoppingList.items.find(i => i.id === id);
    if (!item) return null;
    
    item.isResolved = false;
    item.updatedAt = new Date().toISOString();
    shoppingList.updatedAt = new Date().toISOString();
    
    return item;
  }

  /**
   * List items in shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {string} listId - Shopping list ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  static async list(ucEnv, listId, filters = {}) {
    const shoppingList = await ShoppingList.get(ucEnv, listId);
    if (!shoppingList) return [];
    
    let items = [...shoppingList.items];
    
    // Filter by resolved status if specified
    if (filters.resolved !== undefined) {
      items = items.filter(item => item.isResolved === filters.resolved);
    }
    
    return items;
  }
}

module.exports = Item;
