/**
 * Authorization utility for checking user profiles
 * @param {Object} ucEnv - uuApp environment with session and profiles
 * @param {string|string[]} allowedProfiles - Profile(s) that are allowed
 * @returns {boolean} - true if user has required profile
 */
function checkAuthorization(ucEnv, allowedProfiles) {
  if (!ucEnv || !ucEnv.session || !ucEnv.session.profiles) {
    return false;
  }

  const userProfiles = ucEnv.session.profiles || [];
  const profilesArray = Array.isArray(allowedProfiles) ? allowedProfiles : [allowedProfiles];

  // Authorities (admin) can do everything
  if (userProfiles.includes("Authorities")) {
    return true;
  }

  // Check if user has any of the allowed profiles
  return profilesArray.some(profile => userProfiles.includes(profile));
}

/**
 * Check if user is owner of a shopping list
 * @param {Object} ucEnv - uuApp environment
 * @param {Object} shoppingList - Shopping list object
 * @returns {boolean}
 */
function isListOwner(ucEnv, shoppingList) {
  if (!ucEnv || !ucEnv.session || !ucEnv.session.identity || !shoppingList) {
    return false;
  }

  const userId = ucEnv.session.identity.uuIdentity;
  return shoppingList.ownerId === userId;
}

/**
 * Check if user is member of a shopping list
 * @param {Object} ucEnv - uuApp environment
 * @param {Object} shoppingList - Shopping list object
 * @returns {boolean}
 */
function isListMember(ucEnv, shoppingList) {
  if (!ucEnv || !ucEnv.session || !ucEnv.session.identity || !shoppingList) {
    return false;
  }

  const userId = ucEnv.session.identity.uuIdentity;
  if (isListOwner(ucEnv, shoppingList)) {
    return true; // Owner is also a member
  }

  const members = shoppingList.members || [];
  return members.some(member => member.userId === userId);
}

module.exports = {
  checkAuthorization,
  isListOwner,
  isListMember
};
