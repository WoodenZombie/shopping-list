/**
 * ShoppingList Model - Mock implementation
 * In a real application, this would interact with a database
 */

// In-memory storage for demo purposes
let shoppingLists = [];

class ShoppingList {
  /**
   * Get shopping list by ID
   * @param {Object} ucEnv - uuApp environment
   * @param {string} id - Shopping list ID
   * @returns {Promise<Object|null>}
   */
  static async get(ucEnv, id) {
    // Mock implementation - return from in-memory storage
    return shoppingLists.find(list => list.id === id) || null;
  }

  /**
   * Create a new shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {Object} data - Shopping list data
   * @returns {Promise<Object>}
   */
  static async create(ucEnv, data) {
    const newList = {
      id: data.id || `list-${Date.now()}`,
      name: data.name,
      ownerId: ucEnv.session.identity.uuIdentity,
      isArchived: false,
      members: data.members || [],
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    shoppingLists.push(newList);
    return newList;
  }

  /**
   * Update shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {string} id - Shopping list ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>}
   */
  static async update(ucEnv, id, data) {
    const list = shoppingLists.find(l => l.id === id);
    if (!list) return null;
    
    if (data.name !== undefined) list.name = data.name;
    if (data.isArchived !== undefined) list.isArchived = data.isArchived;
    list.updatedAt = new Date().toISOString();
    
    return list;
  }

  /**
   * Delete shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {string} id - Shopping list ID
   * @returns {Promise<boolean>}
   */
  static async delete(ucEnv, id) {
    const index = shoppingLists.findIndex(l => l.id === id);
    if (index === -1) return false;
    shoppingLists.splice(index, 1);
    return true;
  }

  /**
   * List shopping lists
   * @param {Object} ucEnv - uuApp environment
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  static async list(ucEnv, filters = {}) {
    let result = [...shoppingLists];
    const userId = ucEnv.session.identity.uuIdentity;

    // Filter by user access (owner or member)
    result = result.filter(list => 
      list.ownerId === userId || 
      list.members.some(m => m.userId === userId)
    );

    // Filter by archived status if specified
    if (filters.archived !== undefined) {
      result = result.filter(list => list.isArchived === filters.archived);
    }

    return result;
  }

  /**
   * Add member to shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {string} id - Shopping list ID
   * @param {Object} member - Member data
   * @returns {Promise<Object|null>}
   */
  static async addMember(ucEnv, id, member) {
    const list = shoppingLists.find(l => l.id === id);
    if (!list) return null;
    
    const newMember = {
      userId: member.userId || `user-${Date.now()}`,
      email: member.email,
      addedAt: new Date().toISOString()
    };
    
    list.members.push(newMember);
    list.updatedAt = new Date().toISOString();
    return list;
  }

  /**
   * Remove member from shopping list
   * @param {Object} ucEnv - uuApp environment
   * @param {string} id - Shopping list ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<Object|null>}
   */
  static async removeMember(ucEnv, id, userId) {
    const list = shoppingLists.find(l => l.id === id);
    if (!list) return null;
    
    list.members = list.members.filter(m => m.userId !== userId);
    list.updatedAt = new Date().toISOString();
    return list;
  }

  /**
   * Remove current user from shopping list (leave)
   * @param {Object} ucEnv - uuApp environment
   * @param {string} id - Shopping list ID
   * @returns {Promise<Object|null>}
   */
  static async leave(ucEnv, id) {
    const userId = ucEnv.session.identity.uuIdentity;
    return this.removeMember(ucEnv, id, userId);
  }
}

module.exports = ShoppingList;
